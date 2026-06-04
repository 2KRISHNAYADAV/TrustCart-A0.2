# TrustCart AI — Return Risk & Product Trust Scoring Backend

This is the complete, high-performance FastAPI backend for TrustCart AI. It processes product order parameters and customer review text to return return probabilities, trust scores, risk classifications, and automated recommendations.

---

## 📂 Project Structure

```
backend/
├── main.py                    # FastAPI application entry point, routing, and CORS middleware
├── requirements.txt           # Python dependency file
├── README.md                  # Instructions and project documentation
├── saved_models/              # Directory for model files (copy Kaggle pkl files here)
│   ├── return_risk_model.pkl
│   ├── review_reason_model.pkl
│   ├── tfidf_vectorizer.pkl
│   ├── label_encoders.pkl
│   └── return_model_features.pkl
└── app/
    ├── __init__.py            # Module initialization
    ├── schemas.py             # Pydantic validation models (inputs and outputs)
    ├── model_loader.py        # Safe model loading, fallback logic, and encoder transformers
    ├── prediction_service.py  # Coordinates ML inferences, pandas preprocessing, and score calculation
    └── recommendation_service.py # Recommendation mapping service
```

---

## 🛠️ Installation & Setup

Follow these simple steps to run the backend on your machine:

### 1. Copy ML Model Files
Ensure the following Kaggle-trained model files are placed inside the `backend/saved_models/` directory:
1. `return_risk_model.pkl`
2. `review_reason_model.pkl`
3. `tfidf_vectorizer.pkl`
4. `label_encoders.pkl`
5. `return_model_features.pkl`

*(Note: If files are missing, the server will start up in a **degraded** state so you can still access the documentation and health status, but inference endpoints will return a clean message indicating which files are missing.)*

### 2. Install Dependencies
Open your terminal inside the `backend/` directory and run:
```bash
pip install -r requirements.txt
```

### 3. Run the Backend
Launch the development server using `uvicorn`:
```bash
uvicorn main:app --reload
```

The application will start, and the interactive API documentation will be available at:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## 🔌 API Endpoints

### 🩺 Health & Utility Endpoints
* **`GET /`**
  Checks backend status and verifies which model pickle files are loaded correctly.
* **`GET /model-features`**
  Returns the exact list of feature names (and sequence) required for the return risk model.

### 🔮 Inference Endpoints
* **`POST /analyze-review`**
  Categorizes a review text to identify the return reason.
  * *Request Body:*
    ```json
    {
      "review_text": "The size runs small and does not fit well."
    }
    ```
  * *Response:*
    ```json
    {
      "return_reason": "Size Issue"
    }
    ```

* **`POST /predict`**
  Performs complete analysis: tabular risk prediction, NLP review classification, trust score evaluation, and actionable recommendations.
  * *Request Body:*
    ```json
    {
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
      "review_text": "The box was slightly crushed during shipment.",
      "rating": 4.0,
      "review_count": 150,
      "seller_rating": 4.5
    }
    ```
  * *Response:*
    ```json
    {
      "return_probability": 0.2345,
      "risk_level": "Low",
      "return_reason": "Damaged Product",
      "trust_score": 83.15,
      "recommendation": "Improve packaging and add pre-shipping quality inspection."
    }
    ```

---

## 🧠 Application Logic & Formulas

### 1. Robust Categorical Encoding
During predictions, structured categorical inputs are mapped using label encoders loaded from `label_encoders.pkl`.
If an unknown category value is received, the backend gracefully avoids crashing by using the first class learned by the label encoder as a fallback.

### 2. Risk Level Assignment
The risk category is determined directly from the predicted return probability:
* **High**: `probability >= 0.70`
* **Medium**: `0.40 <= probability < 0.70`
* **Low**: `probability < 0.40`

### 3. Trust Score Formula
The Trust Score combines product, review, seller, return, and text indicators into a weighted 100-point scale:
$$Trust\ Score = S_{rating} \times 0.30 + S_{reviews} \times 0.20 + S_{seller} \times 0.20 + S_{return} \times 0.20 + S_{complaint} \times 0.10$$

Where:
* $S_{rating} = \frac{rating}{5} \times 100$
* $S_{reviews} = \min\left(\frac{review\_count}{1000}, 1.0\right) \times 100$
* $S_{seller} = \frac{seller\_rating}{5} \times 100$
* $S_{return} = (1.0 - return\_probability) \times 100$
* $S_{complaint} = 100.0$ if return reason is "No Issue", else $50.0$

### 4. Recommendation Mapping
* **Size Issue** ➡️ "Improve size chart, add model height/weight reference, and collect size feedback."
* **Quality Issue** ➡️ "Improve supplier quality checks and add clear product material details."
* **Damaged Product** ➡️ "Improve packaging and add pre-shipping quality inspection."
* **Wrong Product** ➡️ "Improve warehouse scanning and product verification before dispatch."
* **Late Delivery** ➡️ "Use faster delivery partners and show realistic delivery dates."
* **Misleading Image** ➡️ "Upload real product photos and mention exact color, size, and material."
* **No Issue** ➡️ "Product looks stable. Continue monitoring reviews and return rate."
