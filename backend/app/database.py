import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Setup logger
logger = logging.getLogger("trustcart_database")
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Retrieve database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is missing or empty, fall back to SQLite to avoid crashing the app.
if not DATABASE_URL:
    logger.warning(
        "DATABASE_URL not found in environment. "
        "Falling back to local SQLite database (sqlite:///./trustcart.db) for testing."
    )
    DATABASE_URL = "sqlite:///./trustcart.db"

# Create SQLAlchemy connection engine
# For SQLite, we add connect_args to avoid multi-thread errors
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800
    )

# Create session generator factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base model class
Base = declarative_base()

def init_db():
    """
    Initializes database tables.
    Runs Base.metadata.create_all to create tables if they do not exist.
    Catches errors gracefully to prevent backend server from crashing on startup
    if the database server is offline.
    """
    try:
        logger.info("Initializing database schemas...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database schemas initialized successfully.")
        return True
    except Exception as e:
        logger.error(
            f"Failed to initialize database tables: {str(e)}. "
            f"Ensure PostgreSQL is running and your connection details in .env are correct. "
            f"The application will run, but prediction persistence may be skipped."
        )
        return False

def get_db():
    """
    FastAPI Dependency to yield a database session per request.
    Closes the session when the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
