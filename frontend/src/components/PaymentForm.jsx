import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "basic",
    paymentMethod: "credit"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8000/api/payment", formData);
      setSuccess(true);
    } catch (error) {
      alert("Error en el pago: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Inscripción Exitosa!</h3>
        <p className="text-gray-600 mb-6">Hemos enviado los detalles a tu correo electrónico.</p>
        <a 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
        >
          Volver al Inicio
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="formulario">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Nombre Completo</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Correo Electrónico</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Teléfono</label>
          <input
            type="tel"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Plan</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          >
            <option value="basic">Básico ($30/mes)</option>
            <option value="premium">Premium ($50/mes)</option>
            <option value="annual">Anual ($300/año)</option>
          </select>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Método de Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === "credit" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
            <input
              type="radio"
              className="sr-only"
              name="paymentMethod"
              value="credit"
              checked={formData.paymentMethod === "credit"}
              onChange={() => setFormData({ ...formData, paymentMethod: "credit" })}
            />
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${formData.paymentMethod === "credit" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}></div>
              <span>Tarjeta de Crédito</span>
            </div>
          </label>
          
          <label className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === "debit" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
            <input
              type="radio"
              className="sr-only"
              name="paymentMethod"
              value="debit"
              checked={formData.paymentMethod === "debit"}
              onChange={() => setFormData({ ...formData, paymentMethod: "debit" })}
            />
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${formData.paymentMethod === "debit" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}></div>
              <span>Tarjeta de Débito</span>
            </div>
          </label>
          
          <label className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === "transfer" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
            <input
              type="radio"
              className="sr-only"
              name="paymentMethod"
              value="transfer"
              checked={formData.paymentMethod === "transfer"}
              onChange={() => setFormData({ ...formData, paymentMethod: "transfer" })}
            />
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${formData.paymentMethod === "transfer" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}></div>
              <span>Transferencia</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            "Completar Inscripción"
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;