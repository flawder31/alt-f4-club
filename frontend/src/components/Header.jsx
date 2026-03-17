import { Link } from 'react-router-dom'
import logo from '../../public/images/logo.png'
import '../styles/Header.css'
import '../styles/global.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="group">
          <img className="logo-img" alt="Логотип" src={logo} />
          <div className="logo-text sansation-bold">
            КОМПЬЮТЕРНЫЙ
            <br />
            КЛУБ
          </div>
        </Link>

        <nav className="navigation">
          <Link to="/" className="nav-link homepage sansation-bold">Главная</Link>
          <Link to="/price" className="nav-link price sansation-bold">Прайс</Link>
          <Link to="/gallery" className="nav-link gallery sansation-bold">Галерея</Link>
        </nav>

        <Link to="/login" className="login-btn sansation-bold">ВОЙТИ</Link>
      </div>
    </header>
  )
}

export default Header