# backend/app/schemas/membership.py (NUEVO ARCHIVO O REEMPLAZAR)

from pydantic import BaseModel
from typing import Optional

class Membership(BaseModel):
    """
    Schema para devolver la información de un plan de membresía.
    """
    id: int
    name: str
    price: float
    duration_days: int
    description: Optional[str] = None

    # Configuración para Pydantic V2, permite mapear desde el modelo de la DB
    # y corrige el warning de 'orm_mode'.
    class Config:
        from_attributes = True