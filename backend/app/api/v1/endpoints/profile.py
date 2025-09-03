# backend/app/api/v1/endpoints/profile.py (ARCHIVO NUEVO)

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import shutil
import os
import uuid

from app.db.session import get_db
from app.models.user import User
from app.api.v1.deps import get_current_user

router = APIRouter()

# Directorio para guardar las fotos de perfil
PROFILE_PICS_DIR = "uploads/profile_pics"
os.makedirs(PROFILE_PICS_DIR, exist_ok=True)

# Schema para la respuesta del perfil
class UserProfile(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    profile_picture_url: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/me", response_model=UserProfile)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Obtiene el perfil del usuario actualmente autenticado.
    """
    return current_user

@router.put("/me")
def update_user_me(
    *,
    db: Session = Depends(get_db),
    full_name: str = Form(...),
    phone: str = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user)
):
    """
    Actualiza el perfil del usuario y, opcionalmente, su foto de perfil.
    """
    # Actualizar datos de texto
    current_user.full_name = full_name
    current_user.phone = phone

    # Manejar la subida de la foto de perfil
    if profile_picture:
        # Generar un nombre de archivo único para evitar colisiones
        file_extension = profile_picture.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(PROFILE_PICS_DIR, unique_filename)

        # Guardar el archivo en el servidor
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_picture.file, buffer)
        
        # Guardar la URL de acceso en el modelo del usuario
        # La URL debe ser accesible por el frontend
        current_user.profile_picture_url = f"/{file_path.replace(os.sep, '/')}"

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Perfil actualizado correctamente"}