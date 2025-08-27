# backend/app/db/session.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import DATABASE_URL

# El engine es la conexión de bajo nivel a la base de datos
engine = create_engine(str(DATABASE_URL))

# SessionLocal es una "fábrica" que crea nuevas sesiones cuando se le pide
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- ESTA ES LA FUNCIÓN CLAVE ---
def get_db():
    """
    Dependency function (generador) para obtener una sesión de la base de datos.
    Garantiza que la sesión se cierre después de cada petición.
    """
    db = SessionLocal()
    try:
        yield db  # Proporciona la sesión a la petición
    finally:
        db.close() # Cierra la sesión cuando la petición termina