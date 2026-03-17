import { useEffect, useState } from 'react'
import logo from '../../public/images/logo.png'
import eye from '../../public/images/eye.svg'
import closed_eye from '../../public/images/closed_eye.svg'
import '../styles/RegisterModal.css'
import '../styles/global.css'

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSwitchToLogin = (e) => {
    e.preventDefault()
    onClose()
    onSwitchToLogin() 
  }

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

          <div className="input-field password-field">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              className="modal-input sansation-regular" 
              placeholder=" "
            />
            <label htmlFor="password" className="input-label sansation-regular">Пароль</label>
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              <img 
                src={showPassword ? closed_eye : eye} 
                alt=""
                className="password-icon"
              />
            </button>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="register-btn-modal sansation-bold">
              ЗАРЕГИСТРИРОВАТЬСЯ
            </button>
            
            <a href="/login" onClick={handleSwitchToLogin} className="login-link sansation-regular">
              Уже есть аккаунт? Войти
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterModal