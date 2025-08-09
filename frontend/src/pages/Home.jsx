import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Clock, Trophy, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Entrenadores Certificados",
      description: "Profesionales experimentados te guiarán en cada paso"
    },
    {
      icon: Clock,
      title: "Horario Flexible",
      description: "Abierto 24/7 para adaptarse a tu estilo de vida"
    },
    {
      icon: Trophy,
      title: "Equipamiento Premium",
      description: "La mejor tecnología y equipos de última generación"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      text: "El mejor gimnasio de la ciudad. Los entrenadores son increíbles.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      text: "Excelentes instalaciones y ambiente muy motivador.",
      rating: 5
    },
    {
      name: "Ana López",
      text: "He logrado todos mis objetivos fitness aquí. 100% recomendado.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforma Tu Vida
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Únete al gimnasio más moderno de la ciudad y alcanza tus objetivos de fitness
              con nuestro equipo de expertos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/membership"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Ver Membresías</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/payment"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Inscríbete Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir GymPro?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia fitness con instalaciones de primera clase
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Planes de Membresía
            </h2>
            <p className="text-lg text-gray-600">
              Encuentra el plan perfecto para ti
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Básico</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                $29<span className="text-lg text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Acceso al gimnasio</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Vestuarios y duchas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Área de cardio</span>
                </li>
              </ul>
              <Link
                to="/payment"
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 block text-center"
              >
                Seleccionar Plan
              </Link>
            </div>

            {/* Plan Premium */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-blue-500 relative hover:shadow-lg transition-shadow duration-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                $49<span className="text-lg text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Todo del plan Básico</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Clases grupales</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Entrenador personal (2 sesiones)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Área de piscina</span>
                </li>
              </ul>
              <Link
                to="/payment"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 block text-center"
              >
                Seleccionar Plan
              </Link>
            </div>

            {/* Plan Elite */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Elite</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                $79<span className="text-lg text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Todo del plan Premium</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Entrenamiento personalizado ilimitado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Nutricionista incluido</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Acceso VIP</span>
                </li>
              </ul>
              <Link
                to="/payment"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 block text-center"
              >
                Seleccionar Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Lo que dicen nuestros miembros
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-800">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para comenzar tu transformación?
          </h2>
          <p className="text-xl mb-8">
            Únete a miles de personas que ya están alcanzando sus objetivos
          </p>
          <Link
            to="/payment"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Comenzar Ahora</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;