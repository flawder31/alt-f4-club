import { Link } from 'react-router-dom'
import logo from '../../public/images/logo.png'
import '../styles/Footer.css'
import '../styles/global.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/" className="footer-logo-link">
            <img className="footer-logo" src={logo} alt="Логотип" />
          </Link>
        </div>

        <div className="footer-copyright sansation-regular">
          © 2026 ALT+F4<br />
          Все права защищены
        </div>

        <div className="footer-contacts sansation-regular">
          +7 (900) 123-45-67<br />
          pochta@mail.ru
        </div>

        <div className="footer-right">
          <Link to="/privacy" className="footer-link sansation-regular">Политика конфиденциальности</Link>
          <Link to="/legal" className="footer-link sansation-regular">Реквизиты</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer