import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container-custom mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <PawPrint size={24} />
              <span className="text-xl font-bold">PetCare</span>
            </Link>
            <p className="text-sm text-gray-400">
              Cuidando do seu pet com amor e dedicação desde 2025. Nossa missão é proporcionar saúde e bem-estar para seu melhor amigo.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Planos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-teal-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">Av. conselheiro rosa e silva, 1000, Recife - PE</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-teal-400 flex-shrink-0" />
                <span className="text-gray-400">(81) 988115840</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-teal-400 flex-shrink-0" />
                <span className="text-gray-400">Princyrpiress@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">
              Inscreva-se para receber novidades, dicas e promoções especiais.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Seu email"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} PetCare. Todos os direitos reservados. Feito por Priscila Ramonna </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;