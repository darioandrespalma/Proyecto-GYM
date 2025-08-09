const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PowerGym</h3>
            <p className="text-gray-400">
              Transformando vidas a través del fitness desde 2010.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Horario</h4>
            <p className="text-gray-400">Lunes-Viernes: 5am - 11pm</p>
            <p className="text-gray-400">Sábado-Domingo: 7am - 9pm</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <p className="text-gray-400">info@powergym.com</p>
            <p className="text-gray-400">+1 234 567 890</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PowerGym. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;