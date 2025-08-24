import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';

const RenewMembershipPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            name: 'Básico',
            price: '29.99',
            features: ['Acceso a todas las máquinas', 'Acceso a vestidores', 'Seguimiento Básico'],
            recommended: false,
        },
        {
            name: 'Premium',
            price: '49.99',
            features: ['Todo lo del plan Básico', 'Acceso a todas las clases grupales', '1 sesión de entrenador personal al mes'],
            recommended: true,
        },
        {
            name: 'VIP',
            price: '79.99',
            features: ['Todo lo del plan Premium', 'Acceso ilimitado a entrenadores', 'Bebidas y snacks gratis'],
            recommended: false,
        },
    ];

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleConfirmPayment = () => {
        // Lógica para procesar el pago (llamada a la API)
        alert(`¡Gracias por renovar tu plan ${selectedPlan.name}! Tu membresía ha sido actualizada.`);
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Renovar Membresía</h1>
            <p className="text-lg text-gray-600 mb-8">Elige el plan que mejor se adapte a tus metas.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.name} className={`bg-white rounded-lg shadow-lg p-6 flex flex-col relative ${plan.recommended ? 'border-2 border-blue-500' : ''}`}>
                        {plan.recommended && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-full flex items-center">
                                <StarIcon className="h-4 w-4 mr-1"/>
                                Recomendado
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-center text-gray-800">{plan.name}</h2>
                        <p className="text-center my-4">
                            <span className="text-4xl font-extrabold">${plan.price}</span>
                            <span className="text-gray-500">/mes</span>
                        </p>
                        <ul className="space-y-3 mb-6 flex-grow">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button color="primary" className="w-full mt-auto" onClick={() => handleSelectPlan(plan)}>
                            Seleccionar Plan
                        </Button>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Confirmar Plan: ${selectedPlan?.name}`}>
                <div>
                    <p className="text-gray-700 mb-2">Estás a punto de suscribirte al plan <strong>{selectedPlan?.name}</strong> por un total de <strong>${selectedPlan?.price}/mes</strong>.</p>
                    <p className="text-gray-600 mb-6">Esta es una simulación de pago. En una aplicación real, aquí seleccionarías tu método de pago.</p>
                    <div className="flex justify-end space-x-3">
                        <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button color="primary" onClick={handleConfirmPayment}>Confirmar Pago</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RenewMembershipPage;