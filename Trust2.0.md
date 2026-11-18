# TrustCart AI 2.0
### Marketplace Trust Intelligence & Predictive Analytics Platform

TrustCart AI 2.0 is an end-to-end marketplace intelligence platform built on the complete Olist Brazilian E-Commerce Dataset (all 9 CSV tables).

It analyzes marketplace transactions, delivery performance, customer reviews, sellers, and products to identify potential return risks, understand customer complaints, detect suspicious review patterns, evaluate marketplace trust, and recommend evidence-backed business improvements.

Unlike a standalone prediction model, TrustCart combines **Machine Learning, NLP, Explainable AI, Statistical Trust Scoring, Recommendation Systems, and Retrieval-Augmented Generation (RAG)** into one integrated platform.

## Core Capabilities

- **Return Risk Prediction:** Estimates potential return-related risk at checkout using historical and transactional features.
- **Fake Review Detection:** Identifies suspicious review patterns using transparent rules and Isolation Forest.
- **Review Intelligence:** Analyzes customer sentiment and classifies complaints into 13 categories.
- **Trust Scoring:** Evaluates seller and product reliability using delivery, return-risk, customer feedback, and authenticity signals.
- **Explainable AI:** Uses SHAP TreeExplainer to identify factors influencing predictions.
- **Recommendation Engine:** Converts statistically significant problems into practical business actions.
- **AI Copilot:** Answers marketplace questions using context-aware retrieval and grounded responses.

## System Architecture

```text
             OLIST DATASET
             All 9 CSV Tables
                    |
                    v
        +-------------------------+
        |   INTELLIGENCE ENGINES  |
        |                         |
        | Return Risk Prediction  |
        | Fake Review Detection   |
        | Review Reason Analysis  |
        +------------+------------+
                     |
                     v
        +-------------------------+
        |    TRUST SCORE ENGINE   |
        |                         |
        | Delivery       30%      |
        | Returns        25%      |
        | Customer Voice 35%      |
        | Authenticity   10%      |
        +------------+------------+
                     |
                     v
        +-------------------------+
        |   SHAP EXPLAINABILITY   |
        +------------+------------+
                     |
                     v
        +-------------------------+
        | RECOMMENDATION ENGINE   |
        | Evidence -> Root Cause  |
        | -> Business Action      |
        +------------+------------+
                     |
                     v
        +-------------------------+
        |      AI COPILOT / RAG   |
        | Contextual Retrieval    |
        | Grounded Responses      |
        +------------+------------+
                     |
                     v
        +-------------------------+
        |      APPLICATION       |
        |                         |
        | FastAPI Backend         |
        | PostgreSQL Database     |
        | React Dashboard         |
        +-------------------------+
```

## What Is Real vs. Estimated

<img width="965" height="626" alt="image" src="https://github.com/user-attachments/assets/258a2f8c-cfe7-46cb-bc73-37a58d6b0e27" />


| Component | Implementation | Data Limitation |
|---|---|---|
| Return Risk | Proxy prediction | No actual return labels |
| Fake Review | Rules + Isolation Forest | No verified fake labels |
| Review Reasons | Portuguese lexicon + TF-IDF Logistic Regression | Weak labels only |
| Trust Score | Empirical-Bayes-shrunk scorecard | Validated against later outcomes |

### Return Risk Prediction

Predicts a proxy for potential return-related issues using checkout-time information.

The proxy is derived from delivered and reviewed orders with low ratings and product-related complaint signals, including damaged products, defective items, incorrect or missing items, misleading images, size issues, and refund friction.

### Fake Review Detection

Generates a suspiciousness score from 0–100 using:
- Duplicate or repetitive review text.
- Review text reused across a seller's products.
- Reviews submitted before delivery.
- Star-rating and text inconsistencies.
- Unusual five-star review bursts.
- Isolation Forest anomaly detection.

This is a review-triage system, not a verified fraud classifier.

### Review Intelligence

Uses Portuguese-language patterns and machine learning to classify customer complaints into 13 categories.

For reviews without text, available order and delivery evidence is used where possible.

### Trust Score Engine

| Dimension | Weight |
|---|---:|
| Delivery Performance | 30% |
| Return Risk | 25% |
| Customer Voice | 35% |
| Review Authenticity | 10% |

Uses empirical Bayes shrinkage to reduce instability when evaluating sellers with limited order histories.

## Model Evaluation

Strict out-of-time test: March 1 – August 31, 2018.

- Test orders: 38,942
- Proxy-positive rate: 8.6%
- Training period: 2017
- Early stopping: December 2017 – January 2018

| Model | ROC-AUC (95% CI) | PR-AUC | Top-Decile Lift | Fit Time |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.667 (0.658–0.677) | 0.188 | 2.65x | 2 sec |
| XGBoost (Production) | 0.659 (0.648–0.669) | 0.189 | 2.62x | 3 sec |
| CatBoost | 0.667 (0.657–0.675) | 0.189 | 2.69x | 12 sec |

XGBoost is retained for production integration and SHAP explainability, not because it achieved the highest benchmark score.

### Trust Score Validation

| Trust Quintile | Later Return-Proxy Rate | Later Bad-Review Rate |
|---|---:|---:|
| Lowest Trust (Q1) | 12.2% | 18.0% |
| Highest Trust (Q5) | 5.8% | 10.3% |

Evaluation covered 332 sellers and 29,607 orders, using pre-February 2018 data for scoring.

### NLP & Fake Review Results

- Sentiment model AUC: 0.978 (out-of-fold).
- Reason-model agreement with lexicon: 0.99+ AUC (consistency, not independently verified accuracy).
- Reviews flagged: 245 of 98,673 (0.25%).
- Injected copy-paste campaigns detected: 100%.
- Unique-text five-star bursts detected: 33%.

## Recommendation Engine

TrustCart translates identified marketplace problems into actionable business recommendations.

| Complaint | Recommended Action |
|---|---|
| Size Issue | Improve product size charts |
| Damaged Product | Improve packaging |
| Late Delivery | Improve shipping SLAs |
| Misleading Image | Use accurate product photography |
| Wrong Item | Improve warehouse picking accuracy |
| Defective Product | Strengthen supplier quality control |
| Missing Parts | Verify product kits before dispatch |
| Refund Friction | Simplify refund processes |
| Out of Stock | Improve inventory synchronization |
| Counterfeit | Strengthen authenticity verification |

Recommendations require statistical evidence, minimum observation thresholds, and category-adjusted baselines.

**Current results: 455 recommendations, including 48 P1 priority recommendations.**

## Technology Stack

| Layer | Technologies |
|---|---|
| Programming | Python, SQL, JavaScript |
| Machine Learning | XGBoost, CatBoost, Scikit-learn |
| NLP | TF-IDF, Logistic Regression, Portuguese Lexicon |
| Anomaly Detection | Isolation Forest |
| Explainable AI | SHAP, TreeSHAP |
| Statistical Modeling | Bayesian Shrinkage, Beta Posterior |
| Backend | FastAPI, REST APIs |
| Database | PostgreSQL, SQLite, SQLAlchemy |
| Frontend | React, Vite |
| AI / RAG | TF-IDF Retrieval, Contextual Generation |
| Testing | Pytest, Headless Chromium |
| Deployment | Docker Compose |

## Getting Started

### Docker Setup

```bash
docker compose up --build
```

- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Local Setup

```bash
pip install -r requirements.txt

cd frontend && npm install && cd ..

createdb trustcart
```

Configure PostgreSQL:

```bash
export DATABASE_URL=postgresql+psycopg://trustcart:trustcart@localhost:5432/trustcart
```

Place all 9 Olist CSV files inside `./data`, then run:

```bash
python scripts/run_pipeline.py

uvicorn trustcart.api.main:app --port 8000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173

Run tests:

```bash
python -m pytest -q tests
```

The pipeline takes approximately 100 seconds in the tested environment.

## API Endpoints

All endpoints are available under `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | System health |
| GET | `/kpis` | Marketplace KPIs |
| GET | `/model-card` | Model evaluation |
| GET | `/reasons` | Review categories |
| GET | `/sellers` | Seller overview |
| GET | `/sellers/{id}` | Seller intelligence |
| GET | `/products` | Product overview |
| GET | `/products/{id}` | Product intelligence |
| GET | `/categories` | Category analysis |
| GET | `/recommendations` | Recommendations |
| GET | `/orders/high-risk` | High-risk orders |
| GET | `/orders/{id}` | Order analysis |
| POST | `/score/order` | Risk prediction and SHAP factors |
| POST | `/analyze/review` | Review analysis |
| POST | `/copilot/ask` | AI Copilot |

## Project Structure

```text
TrustCart-AI/
├── trustcart/
│   ├── data/
│   ├── nlp/
│   ├── ml/
│   ├── trust/
│   ├── reco/
│   ├── rag/
│   ├── db/
│   ├── api/
│   ├── pipeline.py
│   └── config.py
├── frontend/
├── scripts/
├── tests/
├── data/
├── artifacts/
├── docs/screenshots/
├── db/
├── docker-compose.yml
└── requirements.txt
```

## Verification & Testing

### Verified

- Full pipeline executed on the real Olist dataset.
- 99,441 orders processed.
- 98,673 reviews processed, approximately 41,000 with text.
- API tested against PostgreSQL 16 and SQLite.
- 36 automated tests pass in the tested environment.
- Dashboard tested end-to-end using headless Chromium.
- SHAP values match the SHAP library's TreeExplainer outputs.

### Not Yet Verified

- Docker build and Compose execution.
- Live external language-model integration.
- Performance on datasets outside Olist.

## Limitations & Future Improvements

- Olist contains observational data from 2016–2018.
- Actual return and fake-review labels are unavailable.
- Review reasons use weak labels.
- Trust-score weights are expert-defined.
- Customer-level fraud scoring is not implemented.
- Production API authentication and security hardening are required.

### Future Roadmap

1. Build a human-labelled review dataset.
2. Integrate actual return and refund records.
3. Introduce buyer-history features.
4. Add fashion-specific size and fit intelligence.
5. Improve seller and product trust calibration.
6. Implement production authentication and API security.
7. Validate the platform on additional marketplace datasets.

## Dashboard Screenshots

### Platform Overview

![Overview](./trustcart_overview.png)

### Order Risk Analysis

![Order Risk](./trustcart_order_risk.png)

### Recommendation Drawer

![Recommendation Drawer](./trustcart_seller_detail.png)

---

## Project Summary

TrustCart AI 3.0 combines predictive analytics, NLP, explainable machine learning, statistical scoring, and evidence-based recommendations to help e-commerce businesses understand marketplace risk and improve customer trust.

**The goal is not just to predict problems, but to explain why they happen and recommend what the business should do next.**
