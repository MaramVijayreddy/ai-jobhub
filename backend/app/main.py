from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import jobs, admin

app = FastAPI(title="AI JobHub API", version="0.1.0")

# CORS – allow frontend origin (replace with actual URL in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
