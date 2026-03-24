import { useEffect, useState } from 'react'
import api from '../api/auth'
import '../styles/AllBookingsModal.css'

function AllBookingsModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [completingId, setCompletingId] = useState(null) 

  const isBookingCurrentlyActive = (startTime, endTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    return now >= start && now <= end
  }

  const handleCompleteBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите завершить эту бронь?')) return
    
    setCompletingId(bookingId)
    try {
      await api.post(`/admin/bookings/${bookingId}/complete`)
      
      const response = await api.get('/admin/bookings')
      const sortedBookings = [...response.data].sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time)
      })
      setBookings(sortedBookings)
      
    } catch (err) {
      console.error('Ошибка при завершении брони:', err)
      alert(err.response?.data?.detail || 'Ошибка при завершении брони')
    } finally {
      setCompletingId(null)
    }
  }

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (!isOpen) return
      
      setLoading(true)
      setError('')
      
      try {
        const response = await api.get('/admin/bookings')
        const sortedBookings = [...response.data].sort((a, b) => {
          return new Date(a.start_time) - new Date(b.start_time)
        })
        setBookings(sortedBookings)
      } catch (err) {
        console.error('Ошибка загрузки броней:', err)
        setError('Не удалось загрузить список броней')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllBookings()
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

  const getStatusInfo = (status) => {
    switch(status) {
      case 'Активно':
        return { text: 'Активно', color: '#4caf50' }
      case 'Завершено':
        return { text: 'Завершено', color: '#9e9e9e' }
      default:
        return { text: status || 'Неизвестно', color: '#ff9800' }
    }
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

  const getFilteredBookings = () => {
    if (statusFilter === 'all') return bookings
    return bookings.filter(booking => {
      if (statusFilter === 'active') return booking.status === 'Активно'
      if (statusFilter === 'completed') return booking.status === 'Завершено'
      return true
    })
  }

  const filteredBookings = getFilteredBookings()

  if (!isOpen) return null

  return (
    <div className="all-bookings-modal-overlay" onClick={onClose}>
      <div className="all-bookings-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="all-bookings-modal-close" onClick={onClose}>×</button>
        
        <h2 className="all-bookings-modal-title sansation-bold">Все бронирования</h2>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Все
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Активные
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Завершённые
          </button>
        </div>
        
        {loading ? (
          <div className="all-bookings-loading">Загрузка броней...</div>
        ) : error ? (
          <div className="all-bookings-error">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="all-bookings-empty">
            <p>Бронирования не найдены</p>
          </div>
        ) : (
          <div className="all-bookings-list">
            {filteredBookings.map((booking, index) => {
              const statusInfo = getStatusInfo(booking.status)
              const seatTypeColor = getSeatTypeColor(booking.seat_type)
              const seatTypeName = getSeatTypeName(booking.seat_type)
              const displayNumber = index + 1
              const isCurrentlyActive = booking.status === 'Активно' && isBookingCurrentlyActive(booking.start_time, booking.end_time)
              const isCompleting = completingId === booking.id
              
              return (
                <div key={booking.id} className="all-booking-item">
                  <div className="all-booking-header">
                    <span className="all-booking-number">Бронь {displayNumber}</span>
                    <span 
                      className="all-booking-status"
                      style={{ color: statusInfo.color }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                  <div className="all-booking-details">
                    <div className="all-booking-detail-row">
                      <span className="detail-label">Пользователь:</span>
                      <span className="detail-value">{booking.user_name} ({booking.user_phone})</span>
                    </div>
                    <div className="all-booking-detail-row">
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
                    <div className="all-booking-detail-row">
                      <span className="detail-label">Дата и время:</span>
                      <span className="detail-value">
                        {formatDateTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <div className="all-booking-detail-row">
                      <span className="detail-label">Стоимость:</span>
                      <span className="detail-value price">{Math.round(booking.price)} ₽</span>
                    </div>
                    
                    {isCurrentlyActive && (
                      <div className="complete-booking-row">
                        <div className="complete-action">
                            <button 
                            className="complete-booking-btn sansation-bold"
                            onClick={() => handleCompleteBooking(booking.id)}
                            disabled={isCompleting}
                            >
                            {isCompleting ? 'Завершение...' : 'ЗАВЕРШИТЬ'}
                            </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {index < filteredBookings.length - 1 && <div className="all-booking-divider"></div>}
                </div>
              )
            })}
          </div>
        )}
        
        <div className="all-bookings-modal-buttons">
          <button className="all-bookings-close-btn sansation-bold" onClick={onClose}>
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllBookingsModal