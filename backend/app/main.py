from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import health, terminal
from .utils.cleanup import cleanup_inactive_sessions
import asyncio

app = FastAPI()

# Add CORS middleware to allow connections from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(terminal.router)


@app.get("/")
def read_root():
    return {"message": "Web Terminal API is running"}


# Start a background task to clean up inactive sessions
@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_inactive_sessions())
