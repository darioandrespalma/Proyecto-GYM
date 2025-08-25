from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- Importaciones clave para la solución ---
from app.db import session, base

# Importa TODOS tus modelos aquí para que SQLAlchemy los "descubra" al iniciar
from app.models import user, payment, membership, class_schedule, class_booking

# Importa TODOS tus archivos de endpoints
from app.api.v1.endpoints import auth, members, trainers, classes, trainer_endpoints, dashboard, payments

# -----------------------------------------

# Esta línea AHORA funcionará porque todos los modelos ya fueron importados
base.Base.metadata.create_all(bind=session.engine)

app = FastAPI(title="GymPower API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUIR TODOS LOS ROUTERS ---

# Rutas de Autenticación (Públicas)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])

# Rutas de Administrador (Protegidas para Admins)
app.include_router(members.router, prefix="/api/v1/admin/members", tags=["Admin"])
app.include_router(trainers.router, prefix="/api/v1/admin/trainers", tags=["Admin"])
app.include_router(classes.router, prefix="/api/v1/admin/classes", tags=["Admin"])
app.include_router(payments.router, prefix="/api/v1/admin/payments", tags=["Admin"])
app.include_router(dashboard.router, prefix="/api/v1/admin/dashboard", tags=["Admin"])

# Nota: Aquí también deberías incluir el router de 'payments' cuando lo crees.

# Rutas de Entrenador (Protegidas para Entrenadores)
app.include_router(trainer_endpoints.router, prefix="/api/v1/trainer", tags=["Trainer"])

# ------------------------------------

@app.get("/")
def root():
    return {"message": "Bienvenido a la API de GymPower"}
