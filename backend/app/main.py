from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configura CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/payment")
async def process_payment(data: dict):
    # Simulación de pago (en producción usa Stripe/PayPal)
    amount = 30 if data["plan"] == "basic" else 50
    return {"message": "Pago procesado", "amount": amount}