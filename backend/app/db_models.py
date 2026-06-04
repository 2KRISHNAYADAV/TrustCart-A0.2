import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ProductModel(Base):
    """
    SQLAlchemy model representing the 'products' table.
    Stores structural transaction specs and order details.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_category = Column(String, nullable=False)
    product_price = Column(Float, nullable=False)
    order_quantity = Column(Integer, nullable=False)
    discount_applied = Column(Float, nullable=False)
    shipping_method = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    user_age = Column(Integer, nullable=False)
    user_gender = Column(String, nullable=False)
    user_location = Column(String, nullable=False)
    order_value = Column(Float, nullable=False)
    rating = Column(Float, nullable=False)
    review_count = Column(Integer, nullable=False)
    seller_rating = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships to child tables
    reviews = relationship("ReviewModel", back_populates="product", cascade="all, delete-orphan")
    predictions = relationship("PredictionModel", back_populates="product", cascade="all, delete-orphan")


class ReviewModel(Base):
    """
    SQLAlchemy model representing the 'reviews' table.
    Stores the review text and NLP-analyzed return reason categories.
    """
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    review_text = Column(String, nullable=False)
    return_reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationship to parent Product
    product = relationship("ProductModel", back_populates="reviews")


class PredictionModel(Base):
    """
    SQLAlchemy model representing the 'predictions' table.
    Stores ML prediction results, trust scores, and operational guidelines.
    """
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    return_probability = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    trust_score = Column(Float, nullable=False)
    recommendation = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationship to parent Product
    product = relationship("ProductModel", back_populates="predictions")
