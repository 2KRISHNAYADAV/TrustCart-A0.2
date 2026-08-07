<div align="center">
  <img src="https://img.shields.io/badge/TrustCart-AI_Analytics-6366F1?style=for-the-badge" alt="TrustCart Badge" />
  <br/>
  <h1>🛒 TrustCart AI 2.0 🚀</h1>
  <p><strong>Enterprise SaaS Dashboard for E-Commerce Predictive Analytics & Fraud Detection</strong></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  <p><i>A comprehensive platform to detect fraud, analyze customer reviews for fake activity, predict return risks, and score product/seller trust.</i></p>
</div>

---

> ⚠️ **IMPORTANT DISCLAIMER**  
> **This repository represents a Work-In-Progress (WIP) version of the platform.** It is continuously being updated and improved. **This is NOT the final product.** The final, production-ready enterprise version is kept strictly private/hidden. What you see here is a demonstration of the UI/UX capabilities and architectural foundation.

---

## ✨ Key Features

- 📊 **Enterprise Dashboard & Analytics**: Dynamic, animated charts using Recharts for Revenue, Return Rates, and Fraud attempts.
- 🤖 **AI Copilot (Global Dock)**: Integrated contextual chat interface powered by LLMs to answer queries on your marketplace data.
- 🛡️ **Fraud & Risk Detection**: Machine learning pipelines designed to highlight high-risk sellers and anomalous orders.
- 🌟 **Review Intelligence**: Sentiment analysis capabilities to calculate "Fake Probability" scores on customer reviews.
- 💼 **Premium UI/UX**: Built with a custom, sleek design system featuring smooth transitions, micro-animations, and glass-like components.

---

## 🏗️ System Architecture

The application is structured into a modern decoupled architecture. Below is a macro-level diagram of the system flow:

```mermaid
graph TD
    %% Styling
    classDef client fill:#38B2AC,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef backend fill:#009688,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef database fill:#316192,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef ai fill:#6366F1,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold

    %% Nodes
    User([👨‍💻 End User / Admin])
    
    subgraph Frontend [React Client]
        UI[Vite + React SPA]:::client
        Tailwind[Tailwind CSS]:::client
        Charts[Recharts Visualization]:::client
    end

    subgraph Backend [FastAPI Server]
        API[FastAPI Router]:::backend
        Auth[Authentication & Authz]:::backend
        Celery[Celery Task Queue]:::backend
    end

    subgraph Intelligence [AI & ML Layer]
        Copilot[LangChain + Gemini Copilot]:::ai
        XGBoost[XGBoost Risk Models]:::ai
        NLP[TF-IDF Sentiment Models]:::ai
    end

    subgraph Data Layer
        PG[(PostgreSQL DB)]:::database
        Redis[(Redis Cache/Broker)]:::database
    end

    %% Connections
    User -->|Interacts| UI
    UI --- Tailwind
    UI --- Charts
    UI <-->|REST API| API
    
    API <--> Auth
    API -->|Async Tasks| Celery
    
    API <-->|SQLAlchemy| PG
    Celery <-->|Message Broker| Redis
    
    API <-->|Inference| XGBoost
    API <-->|Inference| NLP
    API <-->|RAG| Copilot
```

---

## 🚀 Getting Started

Follow these instructions to clone the repository and run the project on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TrustCart-AI.git
cd TrustCart-AI
```

### 2. Running with Docker (Recommended)

The easiest way to run the entire stack (Frontend, Backend, Database, Redis, Celery) is using Docker Compose.

```bash
# Build and start all services in detached mode
docker-compose up -d --build
```
- **Frontend Dashboard**: `http://localhost:3000` (or `5173` for dev)
- **FastAPI Swagger Docs**: `http://localhost:8000/docs`

---

### 3. Manual Local Setup

If you prefer to run the services individually without Docker:

#### ⚡ Start the Backend (FastAPI)
Requires Python 3.10+
```bash
cd backend
# Install dependencies
pip install -r requirements.txt
# Start the API server
uvicorn app.main:app --reload
```
*The backend will be available at `http://localhost:8000`*

#### 🎨 Start the Frontend (React + Vite)
Requires Node.js 18+
```bash
cd frontend
# Install dependencies
npm install
# Start the development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

---

## 🔮 Future Roadmap

As noted in the disclaimer, this project is actively receiving updates. Upcoming features include:
- [ ] Full backend integration wiring for live chart data replacing current placeholders.
- [ ] Complete implementation of the RAG (Retrieval-Augmented Generation) pipeline for the AI Copilot.
- [ ] Advanced User Roles and Permissions (RBAC).
- [ ] Exportable PDF & CSV Analytics Reports.

<div align="center">
  <p>Built with ❤️ by the TrustCart AI Team.</p>
</div>
