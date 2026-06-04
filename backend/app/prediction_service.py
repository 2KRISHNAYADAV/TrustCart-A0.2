import pandas as pd
import numpy as np
import logging
from typing import Dict, Any, Tuple
from app.model_loader import model_loader
from app.schemas import PredictRequest
from app.recommendation_service import recommendation_service

logger = logging.getLogger("trustcart_prediction_service")

class PredictionService:
    """
    Prediction service coordinating ML inferences for tabular order risk
    and text-based review reason analysis.
    """

    def analyze_review_reason(self, review_text: str) -> str:
        """
        Predicts return reason from text using TF-IDF vectorizer and classifier.
        """
        if not review_text or not review_text.strip():
            return "No Issue"
        
        try:
            # 1. Transform text using TF-IDF vectorizer
            vectorizer = model_loader.tfidf_vectorizer
            text_vec = vectorizer.transform([review_text])
            
            # 2. Predict using review reason classifier
            model = model_loader.review_reason_model
            prediction = model.predict(text_vec)
            
            # Extract prediction result (could be label string or class index)
            reason = str(prediction[0])
            logger.info(f"Review reason predicted: '{reason}'")
            return reason
        except Exception as e:
            logger.error(f"Error predicting review reason: {str(e)}")
            # Fallback to "No Issue" or raise depending on preferences. Let's return "No Issue" as safe fallback.
            return "No Issue"

    def predict_return_probability(self, request_data: PredictRequest) -> float:
        """
        Creates a Pandas DataFrame, runs Label Encoders, reorders columns,
        and uses return_risk_model to predict return probability.
        """
        # 1. Convert relevant structured fields to a dictionary
        input_dict = {
            "product_category": request_data.product_category,
            "product_price": request_data.product_price,
            "order_quantity": request_data.order_quantity,
            "discount_applied": request_data.discount_applied,
            "shipping_method": request_data.shipping_method,
            "payment_method": request_data.payment_method,
            "user_age": request_data.user_age,
            "user_gender": request_data.user_gender,
            "user_location": request_data.user_location,
            "order_value": request_data.order_value
        }

        # 2. Convert to Pandas DataFrame
        df = pd.DataFrame([input_dict])

        # 3. Apply label encoding dynamically based on what's configured in loaded encoders
        try:
            encoders = model_loader.label_encoders
            for col in encoders.keys():
                if col in df.columns:
                    # Apply categorical helper that handles unknown values safely
                    df[col] = df[col].apply(lambda val: model_loader.encode_categorical(col, val))
        except Exception as e:
            logger.error(f"Error encoding categorical columns: {str(e)}")
            raise e

        # 4. Reorder columns to match features list from return_model_features.pkl
        features_order = model_loader.return_model_features
        try:
            df = df[features_order]
        except KeyError as e:
            missing_cols = set(features_order) - set(df.columns)
            logger.error(f"Features mismatch. Missing columns in input data: {missing_cols}")
            # If missing columns, initialize them with default 0/neutral values to avoid crashing
            for m_col in missing_cols:
                df[m_col] = 0
            df = df[features_order]

        # 5. Predict probability
        try:
            model = model_loader.return_risk_model
            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(df)[0]
                # In binary classification, class 1 is return probability
                probability = float(probs[1]) if len(probs) > 1 else float(probs[0])
            else:
                # Regressor fallback
                preds = model.predict(df)
                probability = float(preds[0])
                
            # Clamp between 0.0 and 1.0 to handle standard out-of-bound predictions in some regressors
            probability = max(0.0, min(1.0, probability))
            return probability
        except Exception as e:
            logger.error(f"Error running return risk model: {str(e)}")
            raise e

    def calculate_risk_level(self, probability: float) -> str:
        """
        Calculates categorical risk level:
        - probability >= 0.70: High
        - probability >= 0.40: Medium
        - else: Low
        """
        if probability >= 0.70:
            return "High"
        elif probability >= 0.40:
            return "Medium"
        else:
            return "Low"

    def calculate_trust_score(self, rating: float, review_count: int, seller_rating: float, return_probability: float, return_reason: str) -> float:
        """
        Calculates the trust score based on weighted factors:
        - rating_score = rating / 5 * 100 (30%)
        - review_score = min(review_count / 1000, 1) * 100 (20%)
        - seller_score = seller_rating / 5 * 100 (20%)
        - return_score = (1 - return_probability) * 100 (20%)
        - complaint_score = 100 if return_reason == "No Issue" else 50 (10%)
        """
        rating_score = (rating / 5.0) * 100.0
        review_score = min(review_count / 1000.0, 1.0) * 100.0
        seller_score = (seller_rating / 5.0) * 100.0
        return_score = (1.0 - return_probability) * 100.0
        complaint_score = 100.0 if return_reason == "No Issue" else 50.0

        trust_score = (
            rating_score * 0.30 +
            review_score * 0.20 +
            seller_score * 0.20 +
            return_score * 0.20 +
            complaint_score * 0.10
        )
        return float(trust_score)

    def full_prediction(self, request_data: PredictRequest) -> Dict[str, Any]:
        """
        Runs full predictive analytics workflow:
        1. Predict return reason from text review.
        2. Predict tabular return probability.
        3. Determine risk level categorization.
        4. Calculate Trust Score.
        5. Map recommendations.
        """
        # Step 1: Detect return reason
        return_reason = self.analyze_review_reason(request_data.review_text)

        # Step 2: Predict return probability
        return_probability = self.predict_return_probability(request_data)

        # Step 3: Risk level logic
        risk_level = self.calculate_risk_level(return_probability)

        # Step 4: Trust score calculation
        trust_score = self.calculate_trust_score(
            rating=request_data.rating,
            review_count=request_data.review_count,
            seller_rating=request_data.seller_rating,
            return_probability=return_probability,
            return_reason=return_reason
        )

        # Step 5: Recommendations
        recommendation = recommendation_service.get_recommendation(return_reason)

        return {
            "return_probability": round(return_probability, 4),
            "risk_level": risk_level,
            "return_reason": return_reason,
            "trust_score": round(trust_score, 2),
            "recommendation": recommendation
        }

# Global instance
prediction_service = PredictionService()
