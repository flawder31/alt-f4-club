import { useEffect, useState } from 'react'
import api from '../api/auth'
import '../styles/AdminDepositModal.css'

function AdminDepositModal({ isOpen, onClose, user, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setAmount('')
      setError('')
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
  }

  const incrementAmount = () => {
    setAmount(prev => {
      const newAmount = (parseInt(prev) || 0) + 100
      return newAmount.toString()
    })
  }

  const decrementAmount = () => {
    setAmount(prev => {
      const newAmount = Math.max(0, (parseInt(prev) || 0) - 100)
      return newAmount.toString()
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || parseInt(amount) <= 0) {
      setError('Введите корректную сумму')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await api.post('/admin/balance/deposit', {
        user_phone: user.phone,
        amount: parseInt(amount)
      })
      
      if (onSuccess) {
        await onSuccess()
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при пополнении баланса')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="admin-deposit-modal-overlay" onClick={onClose}>
      <div className="admin-deposit-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-deposit-modal-close" onClick={onClose}>×</button>
        
        <h2 className="admin-deposit-modal-title sansation-bold">Пополнение баланса</h2>
        
        <div className="admin-deposit-user-info">
          <div className="user-info-row">
            <span className="info-label">Пользователь:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="user-info-row">
            <span className="info-label">Телефон:</span>
            <span className="info-value">{user.phone}</span>
          </div>
          <div className="user-info-row">
            <span className="info-label">Текущий баланс:</span>
            <span className="info-value current-balance">{user.balance} ₽</span>
          </div>
        </div>
        
        {error && <div className="admin-deposit-error sansation-regular">{error}</div>}
        
        <form className="admin-deposit-form" onSubmit={handleSubmit}>
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
          
          <div className="admin-deposit-buttons">
            <button 
              type="submit" 
              className="admin-deposit-btn sansation-bold"
              disabled={loading || !amount || parseInt(amount) <= 0}
            >
              {loading ? 'Пополнение...' : 'ПОПОЛНИТЬ'}
            </button>
            
            <button 
              type="button" 
              className="admin-deposit-btn sansation-bold"
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

export default AdminDepositModal