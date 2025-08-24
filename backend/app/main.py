from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import session, base
# Elimina las importaciones de modelos individuales si las tenías aquí

from app.api.v1.endpoints import auth, members, trainers # Agregamos los nuevos

# Esta línea es importante, pero necesita estar después de que los modelos se definan
# Es mejor llamarla después de que todo se haya importado.
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

# Incluir todos los routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(members.router, prefix="/api/v1/admin/members", tags=["Admin"])
app.include_router(trainers.router, prefix="/api/v1/admin/trainers", tags=["Admin"])


@app.get("/")
def root():
    return {"message": "Bienvenido a la API de GymPower"}