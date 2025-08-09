import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, X, Star, Users, Clock, Trophy } from 'lucide-react';

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 29,
      color: 'gray',
      features: [
        'Acceso al gimnasio 24/7',
        'Vestuarios y duchas',
        'Área de cardio',
        'Área de pesas',
        'Wi-Fi gratuito',
        'Estacionamiento'
      ],
      notIncluded: [
        'Clases grupales',
        'Entrenador personal',
        'Área de piscina',
        'Sauna y spa'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      color: 'blue',
      popular: true,
      features: [
        'Todo del plan Básico',
        'Clases grupales ilimitadas',
        '2 sesiones con entrenador personal',
        'Área de piscina',
        'Clases de yoga y pilates',
        'Programas nutricionales básicos'
      ],
      notIncluded: [
        'Entrenamiento personalizado ilimitado',
        'Nutricionista personal',
        'Acceso VIP',
        'Masajes terapéuticos'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 79,
      color: 'purple',
      features: [
        'Todo del plan Premium',
        'Entrenamiento personalizado ilimitado',
        'Nutricionista personal incluido',
        'Acceso VIP a todas las áreas',
        'Sauna y spa incluido',
        'Masajes terapéuticos (2/mes)',
        'Plan de alimentación personalizado',
        'Acceso prioritario a clases',
      ],
      notIncluded: []
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Comunidad Activa",
      description: "Únete a una comunidad de más de 2,000 miembros activos"
    },
    {
      icon: Clock,
      title: "Flexibilidad Total",
      description: "Entrena cuando quieras con acceso 24/7 los 365 días del año"
    },
    {
      icon: Trophy,
      title: "Resultados Garantizados",
      description: "95% de nuestros miembros logran sus objetivos en 6 meses"
    }
  ];

  const getColorClasses = (color, selected = false) => {
    const colors = {
      gray: {
        bg: selected ? 'bg-gray-100' : 'bg-white',
        border: selected ? 'border-gray-400' : 'border-gray-200',
        button: 'bg-gray-600 hover:bg-gray-700',
        accent: 'text-gray-600'
      },
      blue: {
        bg: selected ? 'bg-blue-50' : 'bg-white',
        border: selected ? 'border-blue-500' : 'border-gray-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        accent: 'text-blue-600'
      },
      purple: {
        bg: selected ? 'bg-purple-50' : 'bg-white',
        border: selected ? 'border-purple-500' : 'border-gray-200',
        button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        accent: 'text-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Elige tu Membresía
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tus necesidades y objetivos fitness
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Plans Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const colors = getColorClasses(plan.color, selectedPlan === plan.id);
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div 
                key={plan.id}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-8 relative transition-all duration-200 hover:shadow-lg cursor-pointer`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                  <div className={`text-5xl font-bold ${colors.accent} mb-2`}>
                    ${plan.price}
                  </div>
                  <p className="text-gray-500">por mes</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                    Incluye:
                  </h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded.length > 0 && (
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wide mb-4">
                        No incluye:
                      </h4>
                      {plan.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3 mb-2">
                          <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                  className={`w-full ${colors.button} text-white py-3 rounded-lg font-semibold transition-colors duration-200 text-center`}
                >
                  {isSelected ? 'Seleccionado' : 'Seleccionar Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link
            to={`/payment?plan=${selectedPlan}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Continuar con {plans.find(p => p.id === selectedPlan)?.name} - ${plans.find(p => p.id === selectedPlan)?.price}/mes
          </Link>
          
          <div className="text-sm text-gray-600">
            <p>✓ Prueba gratuita de 7 días</p>
            <p>✓ Cancela cuando quieras</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;