import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SeatMap from '../components/SeatMap'
import BookingConfirmModal from '../components/BookingConfirmModal'
import api from '../api/auth'
import '../styles/SeatsPage.css'

function SeatsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, updateUser } = useAuth() // добавляем updateUser
  const { date, startTime, endTime } = location.state || {}
  
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [selectedSeatType, setSelectedSeatType] = useState(null)
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seatPricePerHour, setSeatPricePerHour] = useState(0)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  // Если нет данных о бронировании, возвращаем на страницу выбора времени
  if (!date || !startTime || !endTime) {
    navigate('/booking')
    return null
  }
  
  // Обновляем информацию о выбранном месте
  useEffect(() => {
    if (selectedSeat && selectedSeatType) {
      // Получаем цену за час в зависимости от типа
      switch(selectedSeatType) {
        case 'Pro':
          setSeatPricePerHour(300)
          break
        case 'Vip':
          setSeatPricePerHour(200)
          break
        default:
          setSeatPricePerHour(100)
      }
    }
  }, [selectedSeat, selectedSeatType])
  
  // Расчет количества часов и стоимости
  const calculateTotalPrice = () => {
  if (!startTime || !endTime) return 0
  
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const totalMinutes = endMinutes - startMinutes
  const totalHours = totalMinutes / 60
  
  console.log('Расчет стоимости:', {
    startTime,
    endTime,
    startMinutes,
    endMinutes,
    totalMinutes,
    totalHours,
    seatPricePerHour,
    totalPrice: totalHours * seatPricePerHour
  })
  
  return totalHours * seatPricePerHour
}
  
  const timeToMinutes = (time) => {
    if (!time) return 0
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  const handleSelectSeat = (seatId, seatType, seatNumber) => {
    setSelectedSeat(seatId)
    setSelectedSeatType(seatType)
    setSelectedSeatNumber(seatNumber)
  }
  
  const handleConfirmClick = () => {
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  
  const handleBookingConfirm = async () => {
    setBookingLoading(true)
    try {
      const response = await api.post('/bookings', {
        seat_id: selectedSeat,
        start_time: `${date} ${startTime}`,
        end_time: `${date} ${endTime}`
      })
      
      if (response.data) {
        // Обновляем данные пользователя после успешного бронирования
        await updateUser()
        
        setIsModalOpen(false)
        alert(`Бронирование успешно создано!`)
        navigate('/')
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Ошибка при бронировании')
    } finally {
      setBookingLoading(false)
    }
  }
  
  const handleGoBack = () => {
    navigate('/booking', { 
      state: { 
        date, 
        startTime, 
        endTime 
      } 
    })
  }
  
  const totalPrice = calculateTotalPrice()
  const isBalanceSufficient = user?.balance >= totalPrice
  
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
            onSelectSeat={handleSelectSeat}
          />
          
          <div className="booking-actions">
            <button className="back-btn" onClick={handleGoBack}>
              НАЗАД
            </button>
            <button 
              className={`confirm-booking-btn ${!selectedSeat ? 'disabled' : ''}`}
              onClick={handleConfirmClick}
              disabled={!selectedSeat}
            >
              ЗАБРОНИРОВАТЬ
            </button>
          </div>
        </div>
      </main>
      <Footer />
      
      <BookingConfirmModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleBookingConfirm}
        seatNumber={selectedSeatNumber}
        seatType={selectedSeatType}
        date={date}
        startTime={startTime}
        endTime={endTime}
        totalPrice={totalPrice}
        balance={user?.balance || 0}
        pricePerHour={seatPricePerHour}
        isBalanceSufficient={isBalanceSufficient}
      />
    </>
  )
}

export default SeatsPage