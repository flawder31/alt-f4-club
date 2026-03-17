import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/auth'
import logo from '../../public/images/logo.png'
import eye from '../../public/images/eye.svg'
import closed_eye from '../../public/images/closed_eye.svg'
import '../styles/LoginModal.css'
import '../styles/global.css'

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // Сбрасываем ошибки при открытии
      setError('');
      setFormData({ phone: '', password: '' });
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('login-', '')]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      authLogin(response.user, response.access_token);
      onClose();
    } catch (err) {
      setError(err || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = (e) => {
    e.preventDefault()
    onClose()
    onSwitchToRegister()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-logo-container">
          <img className="modal-logo" src={logo} alt="Логотип" />
        </div>

        <h2 className="modal-title sansation-bold">Авторизация</h2>

        {error && <div className="modal-error sansation-regular">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input 
              type="tel" 
              id="login-phone" 
              className="modal-input sansation-regular" 
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="login-phone" className="input-label sansation-regular">Телефон</label>
          </div>

          <div className="input-field password-field">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="login-password" 
              className="modal-input sansation-regular" 
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="login-password" className="input-label sansation-regular">Пароль</label>
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img 
                src={showPassword ? closed_eye : eye} 
                alt=""
                className="password-icon"
              />
            </button>
          </div>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="login-btn-modal sansation-bold"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'ВОЙТИ'}
            </button>
            
            <a href="/register" onClick={handleSwitchToRegister} className="register-link sansation-regular">
              Нет аккаунта?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal