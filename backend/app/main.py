from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Importaciones de base de datos
from app.db import session, base
from app.models import user, payment, membership, class_schedule, class_booking

# Importaciones de endpoints
from app.api.v1.endpoints import (
    auth, members, trainers, classes, 
    trainer_endpoints, dashboard, payments, 
    member_endpoints, member_payments, assets, profile
)

# Crear tablas
base.Base.metadata.create_all(bind=session.engine)

app = FastAPI(title="GymPower API")

# Configuración de CORS MEJORADA
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Servir archivos estáticos (comprobantes)
os.makedirs("uploads/comprobantes", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Incluir routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(members.router, prefix="/api/v1/admin/members", tags=["Admin"])
app.include_router(trainers.router, prefix="/api/v1/admin/trainers", tags=["Admin"])
app.include_router(classes.router, prefix="/api/v1/admin/classes", tags=["Admin"])
app.include_router(payments.router, prefix="/api/v1/admin/payments", tags=["Admin"])
app.include_router(dashboard.router, prefix="/api/v1/admin/dashboard", tags=["Admin"])
app.include_router(trainer_endpoints.router, prefix="/api/v1/trainer", tags=["Trainer"])
app.include_router(member_endpoints.router, prefix="/api/v1/member", tags=["Member"])
app.include_router(member_payments.router, prefix="/api/v1/member/payments", tags=["Member Payments"])

app.include_router(assets.router, prefix="/assets", tags=["Assets"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Profile"])
@app.get("/")
def root():
    return {"message": "Bienvenido a la API de GymPower"}

# Middleware adicional para logs de CORS (para debugging)
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response