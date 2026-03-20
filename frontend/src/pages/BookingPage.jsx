import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import '../styles/BookingPage.css'
import '../styles/global.css'
import arrowIcon from '../../public/images/arrow-down.svg'
import arrowLeft from '../../public/images/arrow-left.svg'   
import arrowRight from '../../public/images/arrow-right.svg'

function BookingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [isStartSelectOpen, setIsStartSelectOpen] = useState(false);
  const [isEndSelectOpen, setIsEndSelectOpen] = useState(false);
  
  const startSelectRef = useRef(null);
  const endSelectRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startSelectRef.current && !startSelectRef.current.contains(event.target)) {
        setIsStartSelectOpen(false);
      }
      if (endSelectRef.current && !endSelectRef.current.contains(event.target)) {
        setIsEndSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay() || 7; 
    
    const days = [];
    
    for (let i = 1; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date(year, month, d);
      
      const isAvailable = currentDate >= today;
      
      const handleDateClick = () => {
        if (!isAvailable) return;
        
        if (selectedDate === dateString) {
          setSelectedDate('');
        } else {
          setSelectedDate(dateString); 
        }
      };
      
      days.push(
        <div 
          key={d}
          className={`calendar-day ${selectedDate === dateString ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
          onClick={handleDateClick}
        >
          {d}
        </div>
      );
    }
    
    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const timeString = `${String(hour).padStart(2, '0')}:${minute}`;
        times.push(
          <option key={timeString} value={timeString}>{timeString}</option>
        );
      }
    }
    return times;
  };

  const allTimes = generateTimeOptions();

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setEndTime(''); 
    setIsStartSelectOpen(false);
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    setIsEndSelectOpen(false);
  };

  const getAvailableEndTimes = () => {
    if (!startTime) return allTimes; 
    
    const startMinutes = timeToMinutes(startTime);
    return allTimes.filter(time => {
      const timeMinutes = timeToMinutes(time.props.value);
      return timeMinutes > startMinutes;
    });
  };

  const handleNextClick = () => {
    if (selectedDate && startTime && endTime) {
      navigate('/seats', { 
        state: { 
          date: selectedDate, 
          startTime, 
          endTime 
        } 
      });
    }
  };


  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="booking-main">
          <div className="booking-container">
            <p className="auth-message sansation-regular">
              Для бронирования необходимо авторизоваться
            </p>
          </div>
        </main>
        <Footer />
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => {
            setIsLoginModalOpen(false);
            navigate('/');
          }}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="booking-main">
        <div className="booking-container">
          <h1 className="booking-title sansation-bold">Бронирование</h1>
          
          <div className="booking-content">
            <div className="date-section">
              <h2 className="section-title sansation-bold">Выберите дату</h2>
              
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={prevMonth}>
                  <img src={arrowLeft} alt="Предыдущий месяц" className="nav-icon" />
                </button>
                <span className="calendar-month sansation-bold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button className="calendar-nav-btn" onClick={nextMonth}>
                  <img src={arrowRight} alt="Следующий месяц" className="nav-icon" />
                </button>
              </div>
              
              <div className="calendar-weekdays">
                <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
              </div>
              
              <div className="calendar-grid">
                {generateCalendar()}
              </div>
              
              {selectedDate && (
                <div className="selected-date sansation-regular">
                  Выбрана дата: {selectedDate}
                </div>
              )}
            </div>
            
            <div className="time-section">
              <h2 className="section-title sansation-bold">Выберите время</h2>
              
              <div className="time-selectors">
                <div className="time-selector" ref={startSelectRef}>
                  <label className="time-label sansation-regular">Начало</label>
                  <div 
                    className={`custom-select ${isStartSelectOpen ? 'open' : ''}`}
                    onClick={() => setIsStartSelectOpen(!isStartSelectOpen)}
                  >
                    <div className="select-display sansation-regular">
                      {startTime || '--:--'}
                    </div>
                    <img 
                      src={arrowIcon} 
                      alt=""
                      className={`select-arrow ${isStartSelectOpen ? 'rotated' : ''}`}
                    />
                    
                    {isStartSelectOpen && (
                      <div className="select-dropdown">
                        {allTimes.map(time => (
                          <div
                            key={time.props.value}
                            className={`select-option sansation-regular ${startTime === time.props.value ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTimeChange(time.props.value);
                            }}
                          >
                            {time.props.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="time-selector" ref={endSelectRef}>
                  <label className="time-label sansation-regular">Конец</label>
                  <div 
                    className={`custom-select ${isEndSelectOpen ? 'open' : ''}`}
                    onClick={() => setIsEndSelectOpen(!isEndSelectOpen)}
                  >
                    <div className="select-display sansation-regular">
                      {endTime || '--:--'}
                    </div>
                    <img 
                      src={arrowIcon} 
                      alt=""
                      className={`select-arrow ${isEndSelectOpen ? 'rotated' : ''}`}
                    />
                    
                    {isEndSelectOpen && (
                      <div className="select-dropdown">
                        {getAvailableEndTimes().map(time => (
                          <div
                            key={time.props.value}
                            className={`select-option sansation-regular ${endTime === time.props.value ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEndTimeChange(time.props.value);
                            }}
                          >
                            {time.props.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {startTime && endTime && (
                <div className="selected-time sansation-regular">
                  Выбрано: с {startTime} до {endTime}
                </div>
              )}
            </div>
          </div>
          
          <div className="next-button-container">
            <button 
              className={`next-button sansation-bold ${(!selectedDate || !startTime || !endTime) ? 'disabled' : ''}`}
              onClick={handleNextClick}
              disabled={!selectedDate || !startTime || !endTime}
            >
              ДАЛЕЕ
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BookingPage