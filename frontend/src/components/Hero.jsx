import { Link } from 'react-router-dom'
import background from '../../public/images/background.jpg' 
import '../styles/Hero.css'
import '../styles/global.css'

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-background">
        <img className="hero-image" src={background} alt="Фон" />
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-highlight sansation-bold">ALT+F4 </span>
          <span className="hero-subtitle sansation-regular">
            — сеть современных
            <br />
            компьютерных клубов
          </span>
        </h1>
        
        <Link to="/booking" className="hero-button sansation-bold">
          ЗАБРОНИРОВАТЬ
        </Link>
      </div>
    </section>
  )
}

export default Hero