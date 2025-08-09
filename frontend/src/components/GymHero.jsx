const GymHero = () => {
  return (
    <section className="relative bg-blue-700 text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Transforma tu cuerpo</h2>
        <p className="text-xl md:text-2xl mb-8">Únete al mejor gimnasio de la ciudad</p>
        <div className="flex justify-center space-x-4">
          <a 
            href="#formulario" 
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-bold transition duration-300"
          >
            Inscríbete Ahora
          </a>
          <a 
            href="/clases" 
            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-6 py-3 rounded-lg font-bold transition duration-300"
          >
            Ver Clases
          </a>
        </div>
      </div>
    </section>
  );
};

export default GymHero;