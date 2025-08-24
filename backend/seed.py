# Importa la sesión de la base de datos
from app.db.session import SessionLocal
from sqlalchemy.orm import Session  # <--- ¡ESTA ES LA LÍNEA QUE FALTABA!

# Importa TODOS tus modelos para que SQLAlchemy los reconozca
from app.models.user import User, UserRole
from app.models.payment import Payment
from app.models.membership import Membership
from app.models.class_schedule import ClassSchedule
from app.models.class_booking import ClassBooking

# Importa la función para hashear la contraseña
from app.core.security import get_password_hash

def create_user(db: Session, full_name: str, email: str, password: str, role: UserRole):
    """Función auxiliar para crear un usuario si no existe."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        hashed_password = get_password_hash(password)
        new_user = User(
            full_name=full_name,
            email=email,
            hashed_password=hashed_password,
            role=role
        )
        db.add(new_user)
        print(f"Usuario '{full_name}' ({role.value}) creado.")
        return True
    return False

def seed_db():
    db = SessionLocal()

    # --- 1. Crear Administrador ---
    create_user(db, "Admin Principal", "admin@gym.com", "adminpass", UserRole.admin)

    # --- 2. Crear Entrenadores ---
    trainers_data = [
        {"name": "Ana Fuentes", "email": "ana.trainer@gym.com"},
        {"name": "Carlos Roca", "email": "carlos.trainer@gym.com"},
        {"name": "Sofia Solis", "email": "sofia.trainer@gym.com"},
        {"name": "David Ortiz", "email": "david.trainer@gym.com"},
        {"name": "Laura Paz", "email": "laura.trainer@gym.com"},
    ]
    for trainer in trainers_data:
        create_user(db, trainer["name"], trainer["email"], "trainerpass", UserRole.trainer)

    # --- 3. Crear Clientes/Miembros ---
    members_data = [
        {"name": "Juan Pérez", "email": "juan.perez@email.com"},
        {"name": "Maria Garcia", "email": "maria.garcia@email.com"},
        {"name": "Pedro Rodriguez", "email": "pedro.r@email.com"},
        {"name": "Luisa Martinez", "email": "luisa.m@email.com"},
        {"name": "Andres Lopez", "email": "andres.l@email.com"},
        {"name": "Carmen Hernandez", "email": "carmen.h@email.com"},
        {"name": "Jose Gonzalez", "email": "jose.g@email.com"},
        {"name": "Isabel Diaz", "email": "isabel.d@email.com"},
        {"name": "Miguel Sanchez", "email": "miguel.s@email.com"},
        {"name": "Elena Ramirez", "email": "elena.r@email.com"},
    ]
    for member in members_data:
        create_user(db, member["name"], member["email"], "memberpass", UserRole.member)

    # Guardar todos los cambios en la base de datos
    db.commit()
    db.close()

if __name__ == "__main__":
    print("Iniciando el proceso de sembrado (seeding)...")
    seed_db()
    print("Proceso de sembrado finalizado.")
# Se recomienda ejecutar este script en un entorno de desarrollo local para asegurar
# que la base de datos esté vacía antes de realizar el sembrado.