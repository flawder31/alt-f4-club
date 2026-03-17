import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../public/images/logo.png'
import RegisterModal from './RegisterModal'
import '../styles/Header.css'
import '../styles/global.css'

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
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

          <a href="/login" onClick={handleLoginClick} className="login-btn sansation-bold">
            ВОЙТИ
          </a>
        </div>
      </header>

      <RegisterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

export default Header