from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router
from app.core.database import Base, engine
from app.models.user import User
from app.models.session import UserSession
from starlette.middleware.sessions import SessionMiddleware



# Create tables (only for development - use Alembic in production)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Contractor Quotation Portal API",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(SessionMiddleware, secret_key="YOUR_RANDOM_SECRET")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # This ensures your SQLAlchemy before_flush event hook is registered
    import app.models.events

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "ContractorHub API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)