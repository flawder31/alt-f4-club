import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
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
  
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  const { user, isAuthenticated, logout } = useAuth();

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        !buttonRef.current?.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          {/* Логотип */}
          <a href="/" onClick={handleLogoClick} className="group">
            <img className="logo-img" alt="Логотип" src={logo} />
            <div className="logo-text sansation-bold">
              КОМПЬЮТЕРНЫЙ
              <br />
              КЛУБ
            </div>
          </a>

          {/* Навигация - только на главной странице */}
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

          {/* Блок пользователя */}
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                ref={buttonRef}
                className="user-name-btn sansation-bold"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {user?.name || 'Пользователь'}
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown" ref={menuRef}>
                  {/* Мои брони */}
                  <Link 
                    to="/my-bookings" 
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Мои брони
                  </Link>
                  
                  {/* Разделительная линия (как в макете Anima) */}
                  <div className="dropdown-divider"></div>
                  
                  {/* Баланс */}
                  <div className="dropdown-balance">
                    <span className="balance-label">Баланс:</span>
                    <span className="balance-value">{user?.balance || 0} ₽</span>
                  </div>
                  
                  {/* Разделительная линия */}
                  <div className="dropdown-divider"></div>
                  
                  {/* Выход */}
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
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

      {/* Модальное окно регистрации */}
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={switchToLogin}
      />

      {/* Модальное окно авторизации */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={switchToRegister}
      />
    </>
  )
}

export default Header