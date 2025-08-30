// Frontend/src/pages/member/RenewMembershipPage.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';
import { getMembershipPlans } from '../../api/memberApi';
import { createPayment, getPaymentMethods } from '../../api/paymentsApi';
import { useAuthStore } from '../../store/useAuthStore';

const RenewMembershipPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [comprobante, setComprobante] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                // Obtener planes de membresía
                const plansResponse = await getMembershipPlans();
                setPlans(plansResponse.data || []);

                // Obtener métodos de pago
                const methodsResponse = await getPaymentMethods();
                setPaymentMethods(methodsResponse.data || []);
            } catch (err) {
                setError('Error al cargar los datos');
                console.error('Error fetching data:', err);
                // Establecer arrays vacíos para evitar el error de map
                setPlans([]);
                setPaymentMethods([]);
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setSelectedPaymentMethod('');
        setCardData({ number: '', expiry: '', cvv: '', name: '' });
        setComprobante(null);
        setError('');
        setSuccess('');
        setIsModalOpen(true);
    };

    const handlePaymentSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validaciones según el método de pago
            if (selectedPaymentMethod === 'credit_card') {
                if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
                    throw new Error('Por favor completa todos los campos de la tarjeta');
                }
            } else if (selectedPaymentMethod === 'bank_transfer' && !comprobante) {
                throw new Error('Por favor sube el comprobante de transferencia');
            }

            // Preparar datos para el pago
            const paymentData = {
                membership_type: selectedPlan.name,
                amount: selectedPlan.price,
                payment_method: selectedPaymentMethod,
                comprobante: comprobante
            };

            // Enviar pago
            await createPayment(paymentData);

            // Mensaje de éxito según el método de pago
            if (selectedPaymentMethod === 'credit_card') {
                setSuccess('¡Pago procesado con éxito! Tu membresía ha sido activada.');
            } else if (selectedPaymentMethod === 'bank_transfer') {
                setSuccess('Comprobante enviado. Tu membresía se activará una vez verificado el pago.');
            } else if (selectedPaymentMethod === 'cash') {
                setSuccess('Por favor acércate a recepción para completar tu pago en efectivo.');
            }

            // Cerrar modal después de 3 segundos
            setTimeout(() => {
                setIsModalOpen(false);
                setSelectedPlan(null);
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentForm = () => {
        switch (selectedPaymentMethod) {
            case 'credit_card':
                return (
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la Tarjeta</label>
                            <input
                                type="text"
                                placeholder="Juan Pérez"
                                className="w-full p-2 border rounded-md"
                                value={cardData.name}
                                onChange={(e) => setCardData({...cardData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-2 border rounded-md"
                                value={cardData.number}
                                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expiración</label>
                                <input
                                    type="text"
                                    placeholder="MM/AA"
                                    className="w-full p-2 border rounded-md"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full p-2 border rounded-md"
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                );
            
            case 'bank_transfer':
                return (
                    <div className="space-y-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                            <h3 className="font-semibold text-blue-800">Instrucciones para Transferencia:</h3>
                            <p className="text-blue-700 mt-2">Banco: Banco Nacional</p>
                            <p className="text-blue-700">Cuenta: 123-456789-01</p>
                            <p className="text-blue-700">Titular: Gimnasio Power S.A.</p>
                            <p className="text-blue-700">Monto: ${selectedPlan?.price}</p>
                            <p className="text-blue-700 mt-2">Referencia: Pago de {selectedPlan?.name} - {user?.full_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subir Comprobante (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setComprobante(e.target.files[0])}
                                className="w-full p-2 border rounded-md"
                            />
                            {comprobante && (
                                <p className="text-green-600 text-sm mt-1">Archivo seleccionado: {comprobante.name}</p>
                            )}
                        </div>
                    </div>
                );
            
            case 'cash':
                return (
                    <div className="bg-yellow-50 p-4 rounded-md mt-4">
                        <h3 className="font-semibold text-yellow-800">Instrucciones para Pago en Efectivo:</h3>
                        <p className="text-yellow-700 mt-2">1. Acércate a nuestra recepción</p>
                        <p className="text-yellow-700">2. Menciona que deseas renovar tu membresía {selectedPlan?.name}</p>
                        <p className="text-yellow-700">3. Paga el monto de ${selectedPlan?.price}</p>
                        <p className="text-yellow-700 mt-2">Tu membresía se activará inmediatamente después del pago.</p>
                    </div>
                );
            
            default:
                return <p className="text-gray-500 mt-4">Selecciona un método de pago para continuar</p>;
        }
    };

    // Estados de carga y error
    if (dataLoading) {
        return <div className="flex justify-center items-center h-64">Cargando planes...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
    }

    if (plans.length === 0) {
        return <div className="flex justify-center items-center h-64">No hay planes disponibles.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Renovar Membresía</h1>
            <p className="text-lg text-gray-600 mb-8">Elige el plan que mejor se adapte a tus metas fitness.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className={`bg-white rounded-lg shadow-lg p-6 flex flex-col relative ${plan.name === 'Premium' ? 'border-2 border-blue-500 transform scale-105' : 'border border-gray-200'}`}>
                        {plan.name === 'Premium' && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-full flex items-center">
                                <StarIcon className="h-4 w-4 mr-1"/>
                                Más Popular
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-center text-gray-800">{plan.name}</h2>
                        <p className="text-center my-4">
                            <span className="text-4xl font-extrabold">${plan.price}</span>
                            <span className="text-gray-500">/mes</span>
                        </p>
                        <ul className="space-y-3 mb-6 flex-grow">
                            {plan.description.split(', ').map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button 
                            color={plan.name === 'Premium' ? 'primary' : 'secondary'} 
                            className="w-full mt-auto" 
                            onClick={() => handleSelectPlan(plan)}
                        >
                            Seleccionar Plan
                        </Button>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Confirmar Plan: ${selectedPlan?.name}`}>
                <div>
                    <p className="text-gray-700 mb-2">Estás a punto de suscribirte al plan <strong>{selectedPlan?.name}</strong> por un total de <strong>${selectedPlan?.price}/mes</strong>.</p>
                    
                    <div className="my-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                        <select 
                            className="w-full p-2 border rounded-md"
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        >
                            <option value="">Selecciona un método de pago</option>
                            {paymentMethods.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {renderPaymentForm()}

                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md mt-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-md mt-4">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button 
                            color="secondary" 
                            onClick={() => setIsModalOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onClick={handlePaymentSubmit}
                            disabled={loading || !selectedPaymentMethod}
                            loading={loading}
                        >
                            {loading ? 'Procesando...' : 'Confirmar Pago'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RenewMembershipPage;