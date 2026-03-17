import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../../public/images/logo.png'
import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal'
import '../styles/Header.css'
import '../styles/global.css'

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <a href="/" onClick={handleLogoClick} className="group">
            <img className="logo-img" alt="Логотип" src={logo} />
            <div className="logo-text sansation-bold">
              КОМПЬЮТЕРНЫЙ
              <br />
              КЛУБ
            </div>
          </a>

          {isHomePage && (
            <nav className="navigation">
              <a 
                href="/" 
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('hero');
                }} 
                className="nav-link homepage sansation-bold"
              >
                Главная
              </a>
              
              <a 
                href="/#price" 
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('price');
                }} 
                className="nav-link price sansation-bold"
              >
                Прайс
              </a>
              
              <a 
                href="/#gallery" 
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('gallery');
                }} 
                className="nav-link gallery sansation-bold"
              >
                Галерея
              </a>
            </nav>
          )}

          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-name-btn sansation-bold"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {user?.name || user?.username || 'Пользователь'}
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    Профиль
                  </Link>
                  <Link to="/my-bookings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    Мои брони
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" onClick={handleLoginClick} className="login-btn sansation-bold">
              ВОЙТИ
            </a>
          )}
        </div>
      </header>

      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={switchToLogin}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={switchToRegister}
      />
    </>
  )
}

export default Header