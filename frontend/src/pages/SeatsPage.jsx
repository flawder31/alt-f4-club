import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeatMap from '../components/SeatMap'
import api from '../api/auth'
import '../styles/SeatsPage.css'

function SeatsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { date, startTime, endTime } = location.state || {}
  
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  // Если нет данных о бронировании, возвращаем на страницу выбора времени
  if (!date || !startTime || !endTime) {
    navigate('/booking')
    return null
  }
  
  const handleConfirmBooking = async (seatId) => {
    setBookingLoading(true)
    try {
      const response = await api.post('/bookings', {
        seat_id: seatId,
        start_time: `${date} ${startTime}`,
        end_time: `${date} ${endTime}`
      })
      
      if (response.data) {
        alert(`Бронирование успешно создано! Место №${seatId}`)
        navigate('/')
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при бронировании')
    } finally {
      setBookingLoading(false)
    }
  }
  
  const handleGoBack = () => {
    navigate('/booking', { state: { date, startTime, endTime } })
  }
  
  return (
    <>
      <Header />
      <main className="seats-main">
        <div className="seats-container">
          <h1 className="seats-title">Выберите место</h1>
          
          <SeatMap 
            selectedDate={date}
            startTime={startTime}
            endTime={endTime}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
            onConfirm={handleConfirmBooking}
            isAuthenticated={isAuthenticated}
          />
          
          <div className="booking-actions">
            <button className="back-btn" onClick={handleGoBack}>
              НАЗАД
            </button>
            <button 
              className={`confirm-booking-btn ${!selectedSeat ? 'disabled' : ''}`}
              onClick={() => selectedSeat && handleConfirmBooking(selectedSeat)}
              disabled={!selectedSeat || bookingLoading}
            >
              {bookingLoading ? 'Бронирование...' : 'ЗАБРОНИРОВАТЬ'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default SeatsPage