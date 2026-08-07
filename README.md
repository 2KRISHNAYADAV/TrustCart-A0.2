<div align="center">

<img src="https://img.shields.io/badge/TrustCart-AI_Analytics-6366F1?style=for-the-badge" alt="TrustCart Badge" />

# 🛒 TrustCart AI 2.0

### Enterprise SaaS Dashboard for E-Commerce Predictive Analytics & Fraud Detection

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

*A comprehensive platform to detect fraud, analyze customer reviews for fake activity, predict return risks, and score product/seller trust.*

</div>

<br/>

> [!WARNING]
> **Work in Progress.** This repository is a live, continuously evolving build — **not the final product.** The production-ready enterprise version is kept private. What's here demonstrates the UI/UX foundation and system architecture.

<br/>

## 🎯 Why TrustCart AI?

**The problem.** E-commerce platforms lose billions annually to fraud, chargebacks, and inflated return rates — and fake reviews quietly erode the consumer trust that marketplaces depend on.

**The solution.** TrustCart AI is an enterprise dashboard built for marketplace administrators and store managers. It provides the actionable intelligence needed to monitor transaction health, flag fraudulent sellers, catch suspicious orders, and surface fake reviews — all from a single AI-driven command center that catches risk *before* it hits the bottom line.

<br/>

## 🧠 The AI & ML Stack

TrustCart AI layers three distinct intelligence systems to deliver deep, actionable insight:

| Layer | Technology | What It Does |
|---|---|---|
| 🛡️ **Predictive Risk & Fraud** | XGBoost | Analyzes transaction history, order frequency, and behavioral patterns to score fraud and return probability |
| 🌟 **Review Authenticity** | NLP / TF-IDF | Parses review text for sentiment and linguistic fingerprints of bot-generated or fake content |
| 🤖 **Generative AI Copilot** | LangChain + RAG | Lets users "chat with their data" — plain-language insights, zero SQL required |

<br/>

## 🎓 Project Scope & Skills Demonstrated

**Level: Advanced / Enterprise-Grade**

This isn't a CRUD app — it's a production-shaped, AI-integrated SaaS platform demonstrating:

- 🔹 **Full-Stack Development** — React (Vite) + Tailwind CSS frontend, backed by a high-performance FastAPI service
- 🔹 **Machine Learning Engineering** — Integrating and serving predictive models (XGBoost, NLP) inside a live web ecosystem
- 🔹 **Generative AI** — Context-aware assistants built with LangChain
- 🔹 **System Architecture** — Decoupled microservices with async background processing via Celery + Redis
- 🔹 **Data Engineering** — Robust relational schema design in PostgreSQL
- 🔹 **DevOps** — Fully containerized with Docker & Docker Compose

<br/>

## ✨ Key Features

- 📊 **Enterprise Dashboard** — Animated, real-time charts (Recharts) for revenue, return rates, and fraud attempts
- 🤖 **AI Copilot Dock** — Contextual chat interface for querying your marketplace data in natural language
- 🛡️ **Fraud & Risk Detection** — ML pipelines that surface high-risk sellers and anomalous orders
- 🌟 **Review Intelligence** — Automated "Fake Probability" scoring for customer reviews
- 💼 **Premium UI/UX** — Custom design system with glass-morphism, micro-animations, and smooth transitions

<br/>

## 🏗️ System Architecture

```mermaid
graph TD
    classDef client fill:#38B2AC,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef backend fill:#009688,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef database fill:#316192,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold
    classDef ai fill:#6366F1,stroke:#fff,stroke-width:2px,color:#fff,font-weight:bold

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

<br/>

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TrustCart-AI.git
cd TrustCart-AI
```

### 2. Run with Docker (Recommended)

Spins up the entire stack — frontend, backend, database, Redis, and Celery — in one command.

```bash
docker-compose up -d --build
```

| Service | URL |
|---|---|
| 🎨 Frontend Dashboard | `http://localhost:3000` (or `5173` in dev) |
| ⚡ FastAPI Swagger Docs | `http://localhost:8000/docs` |

### 3. Manual Local Setup

<details>
<summary><strong>⚡ Backend (FastAPI)</strong> — requires Python 3.10+</summary>

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Available at `http://localhost:8000`

</details>

<details>
<summary><strong>🎨 Frontend (React + Vite)</strong> — requires Node.js 18+</summary>

```bash
cd frontend
npm install
npm run dev
```

Available at `http://localhost:5173`

</details>
<br/>

## 📸 Screenshots

<div align="center">

| Dashboard Overview | Fraud Detection View |
|:---:|:---:|
| <img width="450" alt="Dashboard overview" src="https://github.com/user-attachments/assets/2efe34dc-8d22-4c19-8013-8e0e1ff59598" /> | <img width="450" alt="Fraud detection view" src="https://github.com/user-attachments/assets/544fea51-ee4d-4b42-ba32-79e410afc77f" /> |

| Analytics Charts | Review Intelligence Panel |
|:---:|:---:|
| <img width="450" alt="Analytics charts" src="https://github.com/user-attachments/assets/4b35d0ad-b730-47df-ae03-635856de30de" /> | <img width="450" alt="Review intelligence panel" src="https://github.com/user-attachments/assets/5677efa1-61a3-4a54-9b2e-54d956914ad5" /> |

| AI Copilot Dock | Seller Risk Scoring |
|:---:|:---:|
| <img width="450" alt="AI Copilot dock" src="https://github.com/user-attachments/assets/76b42a9e-1deb-4b33-83a2-9ef84880efca" /> | <img width="450" alt="Seller risk scoring" src="https://github.com/user-attachments/assets/f8a22cd0-406c-46d3-aaa5-470389b944b7" /> |

| Order Monitoring | Extra View |
|:---:|:---:|
| <img width="450" alt="Order monitoring" src="https://github.com/user-attachments/assets/8ae2c543-d8c5-42e3-aa19-d0227e07913c" /> | <img width="450" alt="Screenshot" src="https://github.com/user-attachments/assets/c99a0127-bc0c-4b74-87c8-a6442c08ec99" /> |

</div>

<br/>

## 🔮 Roadmap

- [ ] Full backend integration — replace placeholder chart data with live feeds
- [ ] Complete RAG pipeline implementation for the AI Copilot
- [ ] Advanced User Roles & Permissions (RBAC)
- [ ] Exportable PDF & CSV analytics reports

<br/>

<div align="center">

**Built with ❤️ by the TrustCart AI Team**

</div>
