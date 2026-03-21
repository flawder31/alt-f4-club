// src/components/DepositModal.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { depositBalance } from '../api/auth'
import '../styles/DepositModal.css'
import '../styles/global.css'

function DepositModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, updateUser } = useAuth(); // добавляем updateUser

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setAmount('');
      setError('');
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const incrementAmount = () => {
    setAmount(prev => {
      const newAmount = (parseInt(prev) || 0) + 100;
      return newAmount.toString();
    });
  };

  const decrementAmount = () => {
    setAmount(prev => {
      const newAmount = Math.max(0, (parseInt(prev) || 0) - 100);
      return newAmount.toString();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await depositBalance(parseInt(amount));
      // Обновляем данные пользователя после пополнения
      await updateUser();
      onClose();
    } catch (err) {
      setError(err || 'Ошибка при пополнении');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="deposit-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="deposit-modal-title sansation-bold">Пополнение баланса</h2>
        
        {error && <div className="modal-error sansation-regular">{error}</div>}
        
        <form className="deposit-form" onSubmit={handleSubmit}>
          <div className="custom-number-input">
            <input 
              type="text" 
              id="amount" 
              className="modal-input sansation-regular" 
              placeholder=" "
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />
            <label htmlFor="amount" className="input-label sansation-regular">Сумма (₽)</label>
            
            <div className="number-controls">
              <button 
                type="button"
                className="number-control increment"
                onClick={incrementAmount}
                aria-label="Увеличить на 100"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button 
                type="button"
                className="number-control decrement"
                onClick={decrementAmount}
                aria-label="Уменьшить на 100"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 6H12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="deposit-buttons">
            <button 
              type="submit" 
              className="deposit-btn sansation-bold"
              disabled={loading || !amount || parseInt(amount) <= 0}
            >
              {loading ? 'Пополнение...' : 'ПОПОЛНИТЬ'}
            </button>
            
            <button 
              type="button" 
              className="deposit-btn sansation-bold"
              onClick={onClose}
            >
              ОТМЕНА
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DepositModal