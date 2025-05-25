import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, PawPrint } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-teal-600 font-medium' : 'text-gray-700 hover:text-teal-600';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-teal-600">
            <PawPrint size={28} />
            <span className="text-xl font-bold">PetCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors duration-200`}>
              Home
            </Link>
            <Link to="/plans" className={`${isActive('/plans')} transition-colors duration-200`}>
              Planos
            </Link>
            <Link to="/about" className={`${isActive('/about')} transition-colors duration-200`}>
              Sobre
            </Link>
            <Link to="/contact" className={`${isActive('/contact')} transition-colors duration-200`}>
              Contato
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition-colors duration-200"
                >
                  <span>{currentUser.name}</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50 animate-fade-in">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/pet-profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Meus Pets
                    </Link>
                    <Link
                      to="/schedule-appointment"
                      className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Agendar Consulta
                    </Link>
                    <Link
                      to="/subscription"
                      className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Meu Plano
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-teal-600 transition-colors duration-200">
                  Entrar
                </Link>
                <Link to="/signup" className="btn-primary">
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-teal-600 transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="container-custom mx-auto py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/plans"
              className="block py-2 text-gray-700 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Planos
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-teal-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            <hr className="my-2 border-gray-200" />

            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/pet-profile"
                  className="block py-2 text-gray-700 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meus Pets
                </Link>
                <Link
                  to="/schedule-appointment"
                  className="block py-2 text-gray-700 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendar Consulta
                </Link>
                <Link
                  to="/subscription"
                  className="block py-2 text-gray-700 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Plano
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-teal-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block py-2 text-center text-gray-700 hover:text-teal-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-center btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;