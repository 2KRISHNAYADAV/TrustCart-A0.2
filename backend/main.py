import logging
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from sqlalchemy.orm import Session

# Import schemas, DB helpers, and models
from app.schemas import (
    PredictRequest,
    PredictResponse,
    AnalyzeReviewRequest,
    AnalyzeReviewResponse,
    ModelFeaturesResponse,
    HealthStatusResponse,
    PredictionHistoryItem,
    DashboardSummaryResponse
)
from app.model_loader import model_loader
from app.prediction_service import prediction_service
from app.database import get_db, init_db
from app.db_models import ProductModel, ReviewModel, PredictionModel

# Configure logger
logger = logging.getLogger("trustcart_main")
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI App
app = FastAPI(
    title="TrustCart AI — Return Risk & Product Trust Scoring",
    description="FastAPI Backend for predicting e-commerce return risks, analyzing customer reviews, and scoring product trust.",
    version="1.0.0"
)

# Configure CORS Middleware
# This allows any React frontend (running on localhost:3000 or other ports) to interact with this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for testing/development. Can restrict to specific domains in production.
    allow_credentials=True,
    allow_methods=["*"],  # Permits all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Permits all headers
)

# Startup Event
# Automatically triggers loading of Kaggle-trained ML model files and DB tables when server starts.
@app.on_event("startup")
async def startup_event():
    logger.info("FastAPI server starting up...")
    model_loader.load_all_models()
    init_db()  # Dynamically build PostgreSQL database tables

# 1. Health check endpoint (GET /)
@app.get(
    "/",
    response_model=HealthStatusResponse,
    summary="Check API Health & Model Load Status",
    tags=["Utility"]
)
def get_health():
    """
    Check the overall health of the API.
    Returns status:
    - 'healthy': If all 5 model pickles are found and loaded.
    - 'degraded': If one or more model pickles are missing (tells you which ones are missing).
    """
    load_status = model_loader.get_model_status()
    all_loaded = model_loader.is_fully_loaded()
    
    if all_loaded:
        return HealthStatusResponse(
            status="healthy",
            message="TrustCart AI backend is fully operational. All ML models are loaded.",
            models_loaded=load_status
        )
    else:
        return HealthStatusResponse(
            status="degraded",
            message=(
                "TrustCart AI backend is running, but some machine learning models are missing. "
                "Please upload the missing pickled files (.pkl) to 'backend/saved_models/'."
            ),
            models_loaded=load_status
        )

# 2. Get required model features endpoint (GET /model-features)
@app.get(
    "/model-features",
    response_model=ModelFeaturesResponse,
    summary="Show Required Return Model Features",
    tags=["Model Info"]
)
def get_model_features():
    """
    Returns the ordered list of feature columns required by the tabular return risk model.
    """
    try:
        features = model_loader.return_model_features
        return ModelFeaturesResponse(features=features)
    except Exception as e:
        logger.error(f"Error retrieving model features: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving model features: {str(e)}"
        )

# 3. Analyze review reason only endpoint (POST /analyze-review)
@app.post(
    "/analyze-review",
    response_model=AnalyzeReviewResponse,
    summary="Analyze Review Text for Return Reasons",
    tags=["Inference"]
)
def analyze_review(request: AnalyzeReviewRequest):
    """
    Classifies a customer review text to identify the potential return reason.
    E.g. Size Issue, Quality Issue, Damaged Product, Wrong Product, Late Delivery, Misleading Image, or No Issue.
    """
    # Check if review classification models are loaded
    status_dict = model_loader.get_model_status()
    if not status_dict["review_reason_model"] or not status_dict["tfidf_vectorizer"]:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Review classifier models are not loaded. Place review_reason_model.pkl and tfidf_vectorizer.pkl in backend/saved_models/."
        )

    try:
        reason = prediction_service.analyze_review_reason(request.review_text)
        return AnalyzeReviewResponse(return_reason=reason)
    except Exception as e:
        logger.error(f"Failed to analyze review reason: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze review text: {str(e)}"
        )

# 4. Predict full scores endpoint (POST /predict)
@app.post(
    "/predict",
    response_model=PredictResponse,
    summary="Full Return Risk & Product Trust scoring",
    tags=["Inference"]
)
def predict_full_risk(request: PredictRequest, db: Session = Depends(get_db)):
    """
    Predicts return risk metrics, Trust Score, and mitigation recommendation from order specs and review details.
    Persists data automatically to database tables.
    """
    # Check if necessary models are loaded
    status_dict = model_loader.get_model_status()
    missing_models = [name for name, loaded in status_dict.items() if not loaded]
    
    if missing_models:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "ML models not ready.",
                "missing_files": [f"{model_loader.model_files[name]}" for name in missing_models],
                "action": "Ensure all 5 .pkl files are placed inside backend/saved_models/ and restart backend."
            }
        )

    try:
        # Run prediction pipeline
        results = prediction_service.full_prediction(request)
        
        # Save request and response parameters in database inside a safe transaction block
        try:
            db_product = ProductModel(
                product_category=request.product_category,
                product_price=request.product_price,
                order_quantity=request.order_quantity,
                discount_applied=request.discount_applied,
                shipping_method=request.shipping_method,
                payment_method=request.payment_method,
                user_age=request.user_age,
                user_gender=request.user_gender,
                user_location=request.user_location,
                order_value=request.order_value,
                rating=request.rating,
                review_count=request.review_count,
                seller_rating=request.seller_rating
            )
            db.add(db_product)
            db.commit()
            db.refresh(db_product)
            
            db_review = ReviewModel(
                product_id=db_product.id,
                review_text=request.review_text,
                return_reason=results["return_reason"]
            )
            db_prediction = PredictionModel(
                product_id=db_product.id,
                return_probability=results["return_probability"],
                risk_level=results["risk_level"],
                trust_score=results["trust_score"],
                recommendation=results["recommendation"]
            )
            db.add(db_review)
            db.add(db_prediction)
            db.commit()
            logger.info(f"Successfully stored prediction record for Product ID: {db_product.id}")
        except Exception as db_err:
            db.rollback()
            logger.error(f"Database save skipped (graceful connection fallback): {str(db_err)}")

        return PredictResponse(
            return_probability=results["return_probability"],
            risk_level=results["risk_level"],
            return_reason=results["return_reason"],
            trust_score=results["trust_score"],
            recommendation=results["recommendation"]
        )
    except ValueError as val_err:
        logger.error(f"Value mapping issue: {str(val_err)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incompatible input value: {str(val_err)}"
        )
    except Exception as e:
        logger.error(f"Prediction pipeline failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction pipeline error: {str(e)}"
        )

# 5. Get predictions history endpoint (GET /history)
@app.get(
    "/history",
    response_model=List[PredictionHistoryItem],
    summary="Get Prediction History",
    tags=["Database"]
)
def get_history(db: Session = Depends(get_db)):
    """
    Retrieves the list of all past predictions with their associated product metadata and review text.
    """
    try:
        records = db.query(PredictionModel).order_by(PredictionModel.created_at.desc()).all()
        history_list = []
        for pred in records:
            prod = pred.product
            rev = prod.reviews[0] if prod.reviews else None
            
            history_list.append(PredictionHistoryItem(
                id=pred.id,
                created_at=pred.created_at,
                product_category=prod.product_category,
                product_price=prod.product_price,
                order_quantity=prod.order_quantity,
                discount_applied=prod.discount_applied,
                shipping_method=prod.shipping_method,
                payment_method=prod.payment_method,
                user_age=prod.user_age,
                user_gender=prod.user_gender,
                user_location=prod.user_location,
                order_value=prod.order_value,
                rating=prod.rating,
                review_count=prod.review_count,
                seller_rating=prod.seller_rating,
                review_text=rev.review_text if rev else "",
                return_probability=pred.return_probability,
                risk_level=pred.risk_level,
                return_reason=rev.return_reason if rev else "No Issue",
                trust_score=pred.trust_score,
                recommendation=pred.recommendation
            ))
        return history_list
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query failed: {str(e)}"
        )

# 6. Get dashboard statistics summary (GET /dashboard-summary)
@app.get(
    "/dashboard-summary",
    response_model=DashboardSummaryResponse,
    summary="Get Dashboard Statistics Summary",
    tags=["Database"]
)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Calculates aggregated database statistics for frontend indicators.
    """
    try:
        from sqlalchemy import func
        
        # Total count
        total = db.query(PredictionModel).count()
        if total == 0:
            return DashboardSummaryResponse(
                total_predictions=0,
                high_risk_count=0,
                average_trust_score=0.0,
                most_common_return_reason="None"
            )
        
        # High risk count
        high_risk = db.query(PredictionModel).filter(PredictionModel.risk_level == "High").count()
        
        # Average trust score
        avg_trust = db.query(func.avg(PredictionModel.trust_score)).scalar() or 0.0
        
        reason_query = db.query(
            ReviewModel.return_reason, 
            func.count(ReviewModel.return_reason).label("count")
        ).group_by(ReviewModel.return_reason).order_by(func.count(ReviewModel.return_reason).desc()).first()
        
        most_common = reason_query[0] if reason_query else "None"
        
        return DashboardSummaryResponse(
            total_predictions=total,
            high_risk_count=high_risk,
            average_trust_score=round(float(avg_trust), 2),
            most_common_return_reason=most_common
        )
    except Exception as e:
        logger.error(f"Error fetching dashboard summary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database aggregation failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    # If run directly (e.g. python main.py), start the server on port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
