import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { register } from '../api/auth'
import logo from '../../public/images/logo.png'
import eye from '../../public/images/eye.svg'
import closed_eye from '../../public/images/closed_eye.svg'
import '../styles/RegisterModal.css'
import '../styles/global.css'

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setError('');
      setFieldErrors({});
      setFormData({ phone: '', name: '', password: '' });
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'phone') {
      const phoneValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [id]: phoneValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
    
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await register(formData);
      if (response.token && response.user) {
        authLogin(response.user, response.token);
      }
      onClose();
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      
      if (typeof err === 'object') {
        if (err.detail) {
          if (Array.isArray(err.detail)) {
            const fieldErrorMessages = {};
            err.detail.forEach(item => {
              if (item.loc && item.loc.length > 1) {
                const field = item.loc[1]; 
                fieldErrorMessages[field] = item.msg;
              }
            });
            setFieldErrors(fieldErrorMessages);
            setError('Пожалуйста, исправьте ошибки в форме');
          } else {
            setError(err.detail);
          }
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Ошибка при регистрации');
        }
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

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

        {error && <div className="modal-error sansation-regular">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input 
              type="tel" 
              id="phone" 
              className={`modal-input sansation-regular ${fieldErrors.phone ? 'input-error' : ''}`} 
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
              maxLength="11"
              required
            />
            <label htmlFor="phone" className="input-label sansation-regular">Телефон</label>
            {fieldErrors.phone && <div className="field-error sansation-regular">{fieldErrors.phone}</div>}
          </div>

          <div className="input-field">
            <input 
              type="text" 
              id="name" 
              className={`modal-input sansation-regular ${fieldErrors.name ? 'input-error' : ''}`} 
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name" className="input-label sansation-regular">Имя</label>
            {fieldErrors.name && <div className="field-error sansation-regular">{fieldErrors.name}</div>}
          </div>

          <div className="input-field password-field">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              className={`modal-input sansation-regular ${fieldErrors.password ? 'input-error' : ''}`} 
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="input-label sansation-regular">Пароль</label>
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
            {fieldErrors.password && <div className="field-error sansation-regular">{fieldErrors.password}</div>}
          </div>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="register-btn-modal sansation-bold"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
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