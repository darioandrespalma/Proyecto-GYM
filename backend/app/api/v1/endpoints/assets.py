# backend/app/api/v1/endpoints/assets.py

from fastapi import APIRouter
from fastapi.responses import Response
from app.utils.svg_generator import create_gym_icon_svg # Asegúrate de que la ruta sea correcta
from app.utils.svg_background_generator import create_login_background

router = APIRouter()

@router.get("/gym-icon.svg")
def get_gym_icon():
    """
    Endpoint para servir el icono del gimnasio en formato SVG.
    """
    svg_content = create_gym_icon_svg()
    return Response(content=svg_content, media_type="image/svg+xml", headers={
        "Cache-Control": "max-age=3600" # Cachear por 1 hora
    })


# --- 2. NUEVO ENDPOINT AÑADIDO ---
@router.get("/login-background.svg")
def get_login_background_asset():
    """
    Endpoint para servir el fondo SVG dinámico para la página de login.
    """
    svg_content = create_login_background()
    return Response(content=svg_content, media_type="image/svg+xml", headers={
        "Cache-Control": "max-age=86400" # Cachear por un día para eficiencia
    })