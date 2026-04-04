import { useEffect, useState } from 'react'
import api from '../api/auth'
import { useAuth } from '../context/AuthContext'
import '../styles/MyBookingsModal.css'

function MyBookingsModal({ isOpen, onClose, onBookingChange }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null) 

  const { updateUser } = useAuth()

  const fetchBookings = async () => {
    if (!isOpen) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await api.get('/my-bookings')
      let activeBookings = response.data.bookings.filter(booking => {
        return booking.status === 'Активно'
      })
      
      activeBookings.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time)
      })
      
      setBookings(activeBookings)
    } catch (err) {
      console.error('Ошибка загрузки броней:', err)
      setError('Не удалось загрузить список броней')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [isOpen])

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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const [date, time] = dateTimeString.split(' ')
    const [year, month, day] = date.split('-')
    return `${day}.${month}.${year} ${time}`
  }

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const [, time] = dateTimeString.split(' ')
    return time
  }

  const getSeatTypeColor = (seatType) => {
    switch(seatType) {
      case 'Vip':
        return '#3E3BEE'
      case 'Pro':
        return '#BC2AED'
      default:
        return '#1DACFF'
    }
  }

  const getSeatTypeName = (seatType) => {
    switch(seatType) {
      case 'Vip':
        return 'VIP'
      case 'Pro':
        return 'PRO'
      default:
        return 'Standart'
    }
  }

  const handleCancelBooking = async (bookingId, bookingNumber) => {
    if (!window.confirm(`Вы уверены, что хотите отменить бронь ${bookingNumber}?`)) return
    
    setCancellingId(bookingId)
    try {
      await api.post(`/bookings/${bookingId}/cancel`)     
      await updateUser()
      await fetchBookings()
      
      if (onBookingChange) {
        onBookingChange()
      }
      
    } catch (err) {
      console.error('Ошибка при отмене брони:', err)
      alert(err.response?.data?.detail || 'Ошибка при отмене бронирования')
    } finally {
      setCancellingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="bookings-modal-overlay" onClick={onClose}>
      <div className="bookings-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="bookings-modal-close" onClick={onClose}>×</button>
        
        <h2 className="bookings-modal-title sansation-bold">Активные брони</h2>
        
        {loading ? (
          <div className="bookings-loading">Загрузка броней...</div>
        ) : error ? (
          <div className="bookings-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty">
            <p>У вас нет активных броней</p>
            <p className="bookings-empty-subtitle">Забронируйте место, чтобы оно появилось здесь</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => {
              const displayNumber = index + 1
              const seatTypeColor = getSeatTypeColor(booking.seat_type)
              const seatTypeName = getSeatTypeName(booking.seat_type)
              const isCancelling = cancellingId === booking.id
              
              return (
                <div key={booking.id} className="booking-item">
                  <div className="booking-header">
                    <span className="booking-number">Бронь {displayNumber}</span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-detail-row">
                      <span className="detail-label">Место:</span>
                      <span className="detail-value">
                        №{booking.seat_number}
                        <span 
                          className="seat-type-badge"
                          style={{ backgroundColor: seatTypeColor }}
                        >
                          {seatTypeName}
                        </span>
                      </span>
                    </div>
                    <div className="booking-detail-row">
                      <span className="detail-label">Дата и время:</span>
                      <span className="detail-value">
                        {formatDateTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <div className="booking-detail-row">
                      <span className="detail-label">Стоимость:</span>
                      <span className="detail-value price">{Math.round(booking.price)} ₽</span>
                    </div>
                    
                    <div className="cancel-booking-row">
                      <button 
                        className="cancel-booking-btn sansation-regular"
                        onClick={() => handleCancelBooking(booking.id, displayNumber)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Отмена...' : 'Отменить'}
                      </button>
                    </div>
                  </div>
                  {index < bookings.length - 1 && <div className="booking-divider"></div>}
                </div>
              )
            })}
          </div>
        )}
        
        <div className="bookings-modal-buttons">
          <button className="bookings-close-btn sansation-bold" onClick={onClose}>
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyBookingsModal