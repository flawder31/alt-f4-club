import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../public/images/logo.png'
import '../styles/RegisterModal.css'
import '../styles/global.css'

function RegisterModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' 
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-logo-container">
          <img className="modal-logo" src={logo} alt="Логотип" />
        </div>

        <h2 className="modal-title sansation-bold">Регистрация</h2>

        <form className="modal-form">

          <div className="input-field">
            <input 
              type="tel" 
              id="phone" 
              className="modal-input sansation-regular" 
              placeholder=" "
            />
            <label htmlFor="phone" className="input-label sansation-regular">Телефон</label>
          </div>

          <div className="input-field">
            <input 
              type="text" 
              id="name" 
              className="modal-input sansation-regular" 
              placeholder=" "
            />
            <label htmlFor="name" className="input-label sansation-regular">Имя</label>
          </div>

          <div className="input-field">
            <input 
              type="password" 
              id="password" 
              className="modal-input sansation-regular" 
              placeholder=" "
            />
            <label htmlFor="password" className="input-label sansation-regular">Пароль</label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="register-btn sansation-bold">
              Зарегистрироваться
            </button>
            
            <Link to="/login" className="login-link sansation-regular" onClick={onClose}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal