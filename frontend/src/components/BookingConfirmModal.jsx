import { useEffect } from 'react'
import logo from '../../public/images/logo.png'
import '../styles/BookingConfirmModal.css'
import '../styles/global.css'

function BookingConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  seatNumber,
  seatType,
  date,
  startTime,
  endTime,
  totalPrice,
  balance,
  pricePerHour,
  isBalanceSufficient
}) {
  
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
  
  // Форматирование даты из YYYY-MM-DD в DD.MM.YYYY
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
  }
  
  // Получение названия типа места на русском
  const getSeatTypeName = (type) => {
    switch(type) {
      case 'Vip': return 'VIP'
      case 'Pro': return 'PRO'
      default: return 'Standart'
    }
  }
  
  // Получение цвета типа места
  const getSeatTypeColor = (type) => {
    switch(type) {
      case 'Vip': return '#3E3BEE'
      case 'Pro': return '#BC2AED'
      default: return '#1DACFF'
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Крестик закрытия */}
        <button className="confirm-modal-close" onClick={onClose}>×</button>
        
        {/* Логотип */}
        <div className="confirm-modal-logo-container">
          <img className="confirm-modal-logo" src={logo} alt="Логотип" />
        </div>
        
        <h2 className="confirm-modal-title sansation-bold">Подтверждение бронирования</h2>
        
        <div className="confirm-modal-info">
          {/* Информация о месте */}
          <div className="confirm-info-row">
            <span className="info-label">Место:</span>
            <span className="info-value">
              №{seatNumber} 
              <span 
                className="seat-type-badge" 
                style={{ backgroundColor: getSeatTypeColor(seatType), color: '#FFFFFF' }}
              >
                {getSeatTypeName(seatType)}
              </span>
            </span>
          </div>
          
          {/* Дата */}
          <div className="confirm-info-row">
            <span className="info-label">Дата:</span>
            <span className="info-value">{formatDate(date)}</span>
          </div>
          
          {/* Время */}
          <div className="confirm-info-row">
            <span className="info-label">Время:</span>
            <span className="info-value">с {startTime} до {endTime}</span>
          </div>
          
          {/* Цена за час */}
          <div className="confirm-info-row">
            <span className="info-label">Стоимость часа:</span>
            <span className="info-value">{pricePerHour} ₽</span>
          </div>
          
          {/* Итоговая стоимость */}
          <div className="confirm-info-row total-row">
            <span className="info-label">Итого:</span>
            <span className="info-value total-price">{Math.round(totalPrice)} ₽</span>
          </div>
          
          {/* Текущий баланс */}
          <div className="confirm-info-row">
            <span className="info-label">Ваш баланс:</span>
            <span className={`info-value balance ${!isBalanceSufficient ? 'insufficient' : ''}`}>
              {balance} ₽
            </span>
          </div>
        </div>
        
        {/* Ошибка при недостатке средств */}
        {!isBalanceSufficient && (
          <div className="confirm-error-message">
            Недостаточно средств для бронирования. Требуется: {Math.round(totalPrice)} ₽, доступно: {balance} ₽.
          </div>
        )}
        
        {/* Кнопки */}
        <div className="confirm-modal-buttons">
          <button 
            className="confirm-cancel-btn sansation-bold"
            onClick={onClose}
          >
            ОТМЕНА
          </button>
          <button 
            className={`confirm-submit-btn sansation-bold ${!isBalanceSufficient ? 'disabled' : ''}`}
            onClick={onConfirm}
            disabled={!isBalanceSufficient}
          >
            ПОДТВЕРДИТЬ
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmModal