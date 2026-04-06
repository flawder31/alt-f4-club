import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeatMap from '../components/SeatMap'
import api from '../api/auth'
import '../styles/SeatsPage.css'

function AdminChangeSeatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { bookingId, currentSeatId, currentSeatType, date, startTime, endTime } = location.state || {}
  
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [selectedSeatType, setSelectedSeatType] = useState(null)
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(null)
  const [changingLoading, setChangingLoading] = useState(false)
  
  if (!bookingId || !date || !startTime || !endTime) {
    navigate('/')
    return null
  }
  
  const handleSelectSeat = (seatId, seatType, seatNumber) => {
    setSelectedSeat(seatId)
    setSelectedSeatType(seatType)
    setSelectedSeatNumber(seatNumber)
  }
  
  const handleChangeSeat = async () => {
    if (!selectedSeat) {
      alert('Выберите новое место')
      return
    }
    
    setChangingLoading(true)
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/change-seat`, null, {
        params: { new_seat_id: selectedSeat }
      })
      
      if (response.data) {
        alert(`Место успешно изменено! Новое место: №${selectedSeatNumber}`)
        navigate('/')
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при смене места')
    } finally {
      setChangingLoading(false)
    }
  }
  
  const handleGoBack = () => {
    navigate(-1)
  }
  
  return (
    <>
      <Header />
      <main className="seats-main">
        <div className="seats-container">
          <h1 className="seats-title">Выберите новое место</h1>
          
          <SeatMap 
            selectedDate={date}
            startTime={startTime}
            endTime={endTime}
            selectedSeat={selectedSeat}
            onSelectSeat={handleSelectSeat}
          />
          
          <div className="booking-actions">
            <button className="back-btn" onClick={handleGoBack}>
              НАЗАД
            </button>
            <button 
              className={`confirm-booking-btn ${!selectedSeat ? 'disabled' : ''}`}
              onClick={handleChangeSeat}
              disabled={!selectedSeat || changingLoading}
            >
              {changingLoading ? 'Смена...' : 'СМЕНИТЬ'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AdminChangeSeatPage