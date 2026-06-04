from pydantic import BaseModel, Field
from typing import List, Dict, Any

class PredictRequest(BaseModel):
    """
    Input schema for full prediction endpoint.
    Includes both structured order metadata and user review info.
    """
    product_category: str = Field(..., description="Category of the product", example="Electronics")
    product_price: float = Field(..., description="Price of a single unit of the product", example=120.0)
    order_quantity: int = Field(..., description="Quantity of items ordered", example=1)
    discount_applied: float = Field(..., description="Discount percentage applied to the order", example=10.0)
    shipping_method: str = Field(..., description="Method used for shipping the product", example="Express")
    payment_method: str = Field(..., description="Payment channel used", example="Credit Card")
    user_age: int = Field(..., description="Age of the buyer", example=28)
    user_gender: str = Field(..., description="Gender of the buyer", example="Male")
    user_location: str = Field(..., description="Location state/country of the buyer", example="New York")
    order_value: float = Field(..., description="Total value of the transaction", example=108.0)
    review_text: str = Field(..., description="User review text for return reason analysis", example="The product size is a bit small.")
    rating: float = Field(..., description="Product rating score given by the buyer (1-5)", example=4.0)
    review_count: int = Field(..., description="Total reviews this product has received", example=150)
    seller_rating: float = Field(..., description="Overall rating of the seller (1-5)", example=4.5)

    model_config = {
        "json_schema_extra": {
            "example": {
                "product_category": "Electronics",
                "product_price": 120.0,
                "order_quantity": 1,
                "discount_applied": 10.0,
                "shipping_method": "Express",
                "payment_method": "Credit Card",
                "user_age": 28,
                "user_gender": "Male",
                "user_location": "New York",
                "order_value": 108.0,
                "review_text": "The product size is a bit small.",
                "rating": 4.0,
                "review_count": 150,
                "seller_rating": 4.5
            }
        }
    }

class PredictResponse(BaseModel):
    """
    Output schema for the full predict endpoint.
    Provides predicted risk metrics, customer pain points, and action items.
    """
    return_probability: float = Field(..., description="Probability score that the item will be returned")
    risk_level: str = Field(..., description="Risk categorization based on return probability: Low, Medium, High")
    return_reason: str = Field(..., description="Detected reason for return (e.g. Size Issue, Quality Issue)")
    trust_score: float = Field(..., description="Aggregated trust rating for the product/transaction")
    recommendation: str = Field(..., description="Refund reduction and action plan recommendation")

class AnalyzeReviewRequest(BaseModel):
    """
    Input schema for analyzing return reason from text alone.
    """
    review_text: str = Field(..., description="Review text describing user satisfaction", example="The box was damaged when it arrived.")

    model_config = {
        "json_schema_extra": {
            "example": {
                "review_text": "The box was damaged when it arrived."
            }
        }
    }

class AnalyzeReviewResponse(BaseModel):
    """
    Output schema containing the predicted reason from the review text.
    """
    return_reason: str = Field(..., description="Detected reason for return from review text classification")

class ModelFeaturesResponse(BaseModel):
    """
    Output schema showing the ordered list of features required by the tabular risk model.
    """
    features: List[str] = Field(..., description="List of columns in the correct sequence expected by the model")

class HealthStatusResponse(BaseModel):
    """
    Output schema representing API status and loaded models indicator.
    """
    status: str = Field(..., description="Overall backend health status (e.g. 'healthy', 'degraded')")
    message: str = Field(..., description="Detailed text message describing health status")
    models_loaded: Dict[str, bool] = Field(..., description="Status of each ML model file loading")

class PredictionHistoryItem(BaseModel):
    id: int
    created_at: Any = Field(..., description="Date and time of prediction")
    product_category: str
    product_price: float
    order_quantity: int
    discount_applied: float
    shipping_method: str
    payment_method: str
    user_age: int
    user_gender: str
    user_location: str
    order_value: float
    review_text: str
    rating: float
    review_count: int
    seller_rating: float
    return_probability: float
    risk_level: str
    return_reason: str
    trust_score: float
    recommendation: str

    model_config = {
        "from_attributes": True
    }

class DashboardSummaryResponse(BaseModel):
    total_predictions: int
    high_risk_count: int
    average_trust_score: float
    most_common_return_reason: str
