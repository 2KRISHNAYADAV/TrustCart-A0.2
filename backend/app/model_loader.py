import os
import logging
import joblib
from typing import Dict, Any, List, Optional

# Set up logger
logger = logging.getLogger("trustcart_model_loader")
logging.basicConfig(level=logging.INFO)

class ModelLoader:
    """
    Service to load and access ML models and encoders safely.
    Handles missing files on startup by tracking status rather than crashing,
    and guides the user on how to populate models.
    """
    def __init__(self):
        # Resolve the saved_models folder relative to this file
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.models_dir = os.path.join(self.base_dir, "saved_models")
        
        # Ensure directory exists
        os.makedirs(self.models_dir, exist_ok=True)

        self.model_files = {
            "return_risk_model": "return_risk_model.pkl",
            "review_reason_model": "review_reason_model.pkl",
            "tfidf_vectorizer": "tfidf_vectorizer.pkl",
            "label_encoders": "label_encoders.pkl",
            "return_model_features": "return_model_features.pkl"
        }

        # In-memory storage for loaded objects
        self.loaded_models: Dict[str, Any] = {}
        self.load_status: Dict[str, bool] = {name: False for name in self.model_files}

    def load_all_models(self) -> Dict[str, bool]:
        """
        Attempts to load all ML model artifacts.
        Logs warnings if files are not found.
        """
        logger.info("Initializing ML model loader...")
        for name, filename in self.model_files.items():
            path = os.path.join(self.models_dir, filename)
            if not os.path.exists(path):
                logger.warning(
                    f"Model file missing: '{filename}' not found at '{path}'. "
                    f"Please place your Kaggle-trained model here."
                )
                self.load_status[name] = False
                continue
            
            try:
                logger.info(f"Loading '{filename}'...")
                self.loaded_models[name] = joblib.load(path)
                self.load_status[name] = True
                logger.info(f"Successfully loaded '{filename}'")
            except Exception as e:
                logger.error(f"Error loading model file '{filename}': {str(e)}")
                self.load_status[name] = False
                
        return self.load_status

    def is_fully_loaded(self) -> bool:
        """Checks if all required models are loaded."""
        return all(self.load_status.values())

    def get_model_status(self) -> Dict[str, bool]:
        """Returns the loading status of each model."""
        return self.load_status

    def check_or_raise(self, model_name: str) -> Any:
        """
        Retrieves a model or raises a clean ValueError if it isn't loaded yet.
        """
        if not self.load_status.get(model_name) or model_name not in self.loaded_models:
            raise ValueError(
                f"Model '{self.model_files[model_name]}' is not loaded. "
                f"Ensure the file exists in 'backend/saved_models/' and restart the server."
            )
        return self.loaded_models[model_name]

    @property
    def return_risk_model(self) -> Any:
        return self.check_or_raise("return_risk_model")

    @property
    def review_reason_model(self) -> Any:
        return self.check_or_raise("review_reason_model")

    @property
    def tfidf_vectorizer(self) -> Any:
        return self.check_or_raise("tfidf_vectorizer")

    @property
    def label_encoders(self) -> Dict[str, Any]:
        return self.check_or_raise("label_encoders")

    @property
    def return_model_features(self) -> List[str]:
        # If return_model_features.pkl is missing, we fall back to a standard default list matching training.
        try:
            return self.check_or_raise("return_model_features")
        except ValueError:
            # Fallback to the specified default features list in user request if not yet uploaded
            logger.warning("Using fallback default return features list.")
            return [
                "product_category", "product_price", "order_quantity", "discount_applied",
                "shipping_method", "payment_method", "user_age", "user_gender", "user_location",
                "order_value"
            ]

    def encode_categorical(self, column_name: str, value: Any) -> Any:
        """
        Encodes a categorical value safely using loaded label encoders.
        If an unknown category is passed, handles it safely by using the first known class
        from that encoder instead of crashing.
        """
        encoders = self.label_encoders
        if column_name not in encoders:
            raise ValueError(f"No label encoder found for column: '{column_name}'")
        
        encoder = encoders[column_name]
        
        # Check if the class is recognized by the encoder
        # LabelEncoder stores classes in numpy array `classes_`
        known_classes = list(encoder.classes_)
        
        target_value = value
        if target_value not in known_classes:
            if not known_classes:
                raise ValueError(f"Label encoder for '{column_name}' is empty.")
            fallback = known_classes[0]
            logger.info(
                f"Unknown value '{value}' encountered for '{column_name}'. "
                f"Falling back to first known class: '{fallback}'."
            )
            target_value = fallback

        # Return the encoded index as a single value
        # we pass target_value in a list since transform expects an array-like
        encoded_arr = encoder.transform([target_value])
        return int(encoded_arr[0])

# Global instance
model_loader = ModelLoader()
