from fastapi import FastAPI, Depends, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, database, schemas
import shutil
import os

app = FastAPI()

# CORS (igual que tenías)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/payment", response_model=schemas.PaymentResponse)
async def process_payment(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    plan: str = Form(...),
    payment_method: str = Form(...),
    transfer_proof: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Validar método de pago
    valid_methods = ["credit_card", "debit_card", "transfer"]
    if payment_method not in valid_methods:
        raise HTTPException(status_code=400, detail="Método de pago inválido")

    # Validar archivo solo si método es transferencia
    if payment_method == "transfer":
        if transfer_proof is None:
            raise HTTPException(status_code=400, detail="Comprobante de transferencia requerido")
        if transfer_proof.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="El comprobante debe ser un archivo PDF")

        # Guardar archivo en carpeta uploads
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_location = os.path.join(upload_dir, transfer_proof.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(transfer_proof.file, buffer)
    else:
        # No se espera archivo
        if transfer_proof is not None:
            raise HTTPException(status_code=400, detail="No se debe subir archivo si no es transferencia")

    # Precios
    plan_prices = {
        "basic": 30.0,
        "premium": 50.0,
        "annual": 300.0
    }
    amount = plan_prices.get(plan, 0.0)

    # Crear pago en DB
    db_payment = models.Payment(
        name=name,
        email=email,
        phone=phone,
        plan=plan,
        payment_method=payment_method,
        amount=amount
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return db_payment
