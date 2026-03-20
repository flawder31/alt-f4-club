import { useState, useEffect } from 'react'
import api from '../api/auth'
import '../styles/SeatMap.css'

function SeatMap({ selectedDate, startTime, endTime, selectedSeat, onSelectSeat }) {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busySeatIds, setBusySeatIds] = useState([])

  // Загрузка мест и занятых броней
  useEffect(() => {
    const fetchSeatsAndBookings = async () => {
      try {
        setLoading(true)
        
        // Получаем список всех мест
        const seatsResponse = await api.get('/seats')
        setSeats(seatsResponse.data)
        
        // Получаем занятые места на выбранное время
        if (selectedDate && startTime && endTime) {
          const bookingsResponse = await api.get('/seats/available', {
            params: {
              start_time: `${selectedDate} ${startTime}`,
              end_time: `${selectedDate} ${endTime}`
            }
          })
          
          // Находим занятые места (все места минус доступные)
          const availableSeatIds = bookingsResponse.data.map(s => s.id)
          const allSeatIds = seatsResponse.data.map(s => s.id)
          const busyIds = allSeatIds.filter(id => !availableSeatIds.includes(id))
          setBusySeatIds(busyIds)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Ошибка загрузки мест:', err)
        setError('Не удалось загрузить карту мест')
        setLoading(false)
      }
    }
    
    if (selectedDate && startTime && endTime) {
      fetchSeatsAndBookings()
    }
  }, [selectedDate, startTime, endTime])

  // Получение стилей для места
  const getSeatStyle = (seatId, seatType) => {
    const isBusy = busySeatIds.includes(seatId)
    const isSelected = selectedSeat === seatId
    
    let strokeColor
    let fillColor
    let opacity
    
    switch(seatType) {
      case 'Vip':
        strokeColor = '#3E3BEE'
        break
      case 'Pro':
        strokeColor = '#BC2AED'
        break
      default:
        strokeColor = '#1DACFF'
    }
    
    if (isBusy) {
      fillColor = '#02020C'
      opacity = 0.4 // Занятые места более прозрачные
    } else if (isSelected) {
      fillColor = strokeColor // Полностью заливается цветом контура
      opacity = 1
    } else {
      fillColor = '#02020C' // Темный фон
      opacity = 0.8 // Свободные места чуть прозрачные
    }
    
    return { fillColor, strokeColor, opacity, isBusy }
  }

  // SVG карта с цифрами на местах
  const getSvgMap = () => {
    // Маппинг мест с их ID, типом и позицией
    const seatPositions = [
      // Ряд 1 (верхний) - Standart места 1-5
      { id: 1, x: 358, y: 514, type: 'Standart', number: 1, textX: 358, textY: 517 },
      { id: 2, x: 427, y: 514, type: 'Standart', number: 2, textX: 427, textY: 517 },
      { id: 3, x: 496, y: 514, type: 'Standart', number: 3, textX: 496, textY: 517 },
      { id: 4, x: 565, y: 514, type: 'Standart', number: 4, textX: 565, textY: 517 },
      { id: 5, x: 634, y: 514, type: 'Standart', number: 5, textX: 634, textY: 517 },
      // Ряд 2 - Standart места 6-10
      { id: 6, x: 358, y: 449, type: 'Standart', number: 6, textX: 358, textY: 452 },
      { id: 7, x: 427, y: 449, type: 'Standart', number: 7, textX: 427, textY: 452 },
      { id: 8, x: 496, y: 449, type: 'Standart', number: 8, textX: 496, textY: 452 },
      { id: 9, x: 565, y: 449, type: 'Standart', number: 9, textX: 565, textY: 452 },
      { id: 10, x: 634, y: 449, type: 'Standart', number: 10, textX: 634, textY: 452 },
      // Ряд 3 - Standart места 11-15
      { id: 11, x: 358, y: 354, type: 'Standart', number: 11, textX: 358, textY: 357 },
      { id: 12, x: 427, y: 354, type: 'Standart', number: 12, textX: 427, textY: 357 },
      { id: 13, x: 496, y: 354, type: 'Standart', number: 13, textX: 496, textY: 357 },
      { id: 14, x: 565, y: 354, type: 'Standart', number: 14, textX: 565, textY: 357 },
      { id: 15, x: 634, y: 354, type: 'Standart', number: 15, textX: 634, textY: 357 },
      // Ряд 4 - Standart места 16-20
      { id: 16, x: 358, y: 290, type: 'Standart', number: 16, textX: 358, textY: 293 },
      { id: 17, x: 427, y: 290, type: 'Standart', number: 17, textX: 427, textY: 293 },
      { id: 18, x: 496, y: 290, type: 'Standart', number: 18, textX: 496, textY: 293 },
      { id: 19, x: 565, y: 290, type: 'Standart', number: 19, textX: 565, textY: 293 },
      { id: 20, x: 634, y: 290, type: 'Standart', number: 20, textX: 634, textY: 293 },
      // Ряд 5 - VIP места 21-25
      { id: 21, x: 373, y: 153, type: 'Vip', number: 1, textX: 373, textY: 157 },
      { id: 22, x: 442, y: 153, type: 'Vip', number: 2, textX: 442, textY: 157 },
      { id: 23, x: 511, y: 153, type: 'Vip', number: 3, textX: 511, textY: 157 },
      { id: 24, x: 580, y: 153, type: 'Vip', number: 4, textX: 580, textY: 157 },
      { id: 25, x: 649, y: 153, type: 'Vip', number: 5, textX: 649, textY: 157 },
      // Ряд 6 - VIP места 26-30
      { id: 26, x: 373, y: 62, type: 'Vip', number: 6, textX: 373, textY: 66 },
      { id: 27, x: 442, y: 62, type: 'Vip', number: 7, textX: 442, textY: 66 },
      { id: 28, x: 511, y: 62, type: 'Vip', number: 8, textX: 511, textY: 66 },
      { id: 29, x: 580, y: 62, type: 'Vip', number: 9, textX: 580, textY: 66 },
      { id: 30, x: 649, y: 62, type: 'Vip', number: 10, textX: 649, textY: 66 },
      // Левая колонка PRO
      { id: 31, x: 66, y: 202, type: 'Pro', number: 1, textX: 66, textY: 205 },
      { id: 32, x: 66, y: 133, type: 'Pro', number: 2, textX: 66, textY: 136 },
      { id: 33, x: 66, y: 64, type: 'Pro', number: 3, textX: 66, textY: 67 },
      // Правая колонка PRO
      { id: 34, x: 185, y: 202, type: 'Pro', number: 4, textX: 185, textY: 205 },
      { id: 35, x: 185, y: 133, type: 'Pro', number: 5, textX: 185, textY: 136 },
      { id: 36, x: 185, y: 64, type: 'Pro', number: 6, textX: 185, textY: 67 }
    ]

    // Строим SVG динамически
    let svgContent = `
      <svg width="100%" height="auto" viewBox="0 0 713 590" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor: default">
        <rect width="713" height="590" rx="1" fill="#02020C"/>
        <rect width="713" height="590" rx="1" stroke="#1DACFF" stroke-width="6"/>
    `

    // Добавляем все прямоугольники мест
    seatPositions.forEach(seat => {
      const { fillColor, strokeColor, opacity, isBusy } = getSeatStyle(seat.id, seat.type)
      
      svgContent += `
        <rect 
          x="${seat.x - 25}" 
          y="${seat.y - 25}" 
          width="50.3858" 
          height="50.3858" 
          fill="${fillColor}" 
          stroke="${strokeColor}" 
          stroke-width="2"
          data-seat-id="${seat.id}"
          data-seat-type="${seat.type}"
          data-is-busy="${isBusy}"
          style="opacity: ${opacity}; transition: opacity 0.2s ease, filter 0.2s ease; cursor: ${isBusy ? 'not-allowed' : 'pointer'}"
          class="seat-rect ${isBusy ? 'seat-busy' : ''}"
        />
      `
    })

    // Добавляем линии
    svgContent += `
      <line x1="309.5" y1="215" x2="309.5" y2="145" stroke="#1DACFF" stroke-width="3"/>
      <line x1="309.5" y1="77" x2="309.5" y2="0" stroke="#1DACFF" stroke-width="3"/>
      <line x1="713" y1="213.5" x2="309" y2="213.5" stroke="#1DACFF" stroke-width="3"/>
      <line x1="251.5" y1="0" x2="251.5" y2="270" stroke="#1DACFF" stroke-width="3"/>
      <line y1="269.5" x2="92" y2="269.5" stroke="#1DACFF" stroke-width="3"/>
      <line x1="159" y1="268.5" x2="250" y2="268.5" stroke="#1DACFF" stroke-width="3"/>
      <line x1="1.5" y1="485" x2="1.5" y2="380" stroke="#02020C" stroke-width="5"/>
    `

    // Добавляем цифры на места
    seatPositions.forEach(seat => {
      const isBusy = busySeatIds.includes(seat.id)
      const isSelected = selectedSeat === seat.id
      
      let textColor
      if (isBusy) {
        textColor = '#4a4a4a'
      } else if (isSelected) {
        textColor = '#01010B'
      } else {
        textColor = '#FFFFFF'
      }
      
      svgContent += `
        <text 
          x="${seat.textX}" 
          y="${seat.textY}" 
          text-anchor="middle" 
          dominant-baseline="middle"
          fill="${textColor}"
          font-family="Sansation-Bold, Arial"
          font-size="20"
          font-weight="bold"
          pointer-events="none"
          data-seat-id="${seat.id}"
        >${seat.number}</text>
      `
    })

    svgContent += `</svg>`
    return svgContent
  }

  const handleSeatClick = (seatId, isBusy) => {
    if (isBusy) return // Занятые места не выбираем
    
    if (selectedSeat === seatId) {
      onSelectSeat(null) // Снимаем выбор
    } else {
      onSelectSeat(seatId) // Выбираем место
    }
  }

  if (loading) {
    return <div className="seatmap-loading">Загрузка карты зала...</div>
  }
  
  if (error) {
    return <div className="seatmap-error">{error}</div>
  }

  return (
    <div className="seatmap-container">
      <div className="seatmap-header">
        <div className="seatmap-legend">
          <div className="legend-item"><span className="legend-color free"></span> Standart</div>
          <div className="legend-item vip"><span className="legend-color vip-color"></span> VIP</div>
          <div className="legend-item pro"><span className="legend-color pro-color"></span> PRO</div>
        </div>
      </div>
      
      <div 
        className="seatmap-svg-wrapper"
        dangerouslySetInnerHTML={{ __html: getSvgMap() }}
        onClick={(e) => {
          const rect = e.target.closest('.seat-rect')
          if (rect) {
            const seatId = parseInt(rect.getAttribute('data-seat-id'))
            const isBusy = rect.getAttribute('data-is-busy') === 'true'
            handleSeatClick(seatId, isBusy)
          }
        }}
      />
    </div>
  )
}

export default SeatMap