from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# For a POC project, we'll use a simple SQLite database
# stored in the project directory
SQLALCHEMY_DATABASE_URL = "sqlite:///./web_terminal.db"

# Create SQLite engine
# check_same_thread is needed for SQLite to work with FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Create a function to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
