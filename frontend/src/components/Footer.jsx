import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import logo from '../../public/images/logo.png'
import '../styles/Footer.css'
import '../styles/global.css'

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLeftAreaClick = (e) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left clickable" onClick={handleLeftAreaClick}>
          <img className="footer-logo" src={logo} alt="Логотип" />
          <div className="footer-copyright sansation-regular">
            © 2026 ALT+F4<br />
            Все права защищены
          </div>
        </div>

        <div className="footer-contacts sansation-regular">
          +7 (900) 123-45-67<br />
          pochta@mail.ru
        </div>

        <div className="footer-right">
          <div className="footer-link sansation-regular">Политика конфиденциальности</div>
          <div className="footer-link sansation-regular">Реквизиты</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer