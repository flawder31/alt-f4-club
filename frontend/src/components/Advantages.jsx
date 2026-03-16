import '../styles/Advantages.css'
import '../styles/global.css'

import coinsIcon from '../../public/images/icon1.svg'     
import hardwareIcon from '../../public/images/icon2.svg' 
import smileIcon from '../../public/images/icon3.svg' 

function Advantages() {
  return (
    <section className="advantages-section">
      <div className="container">
        <h2 className="advantages-title">
          <span className="title-white sansation-bold">Преимущества</span>{' '}
          <span className="title-blue sansation-bold">ALT+F4</span>
        </h2>

        <div className="advantages-grid">
          <div className="advantage-card">
            <div className="advantage-content">
              <div className="advantage-icon">
                <img src={coinsIcon} alt="Иконка монет" />
              </div>
              <h3 className="advantage-name sansation-bold">Выгодные цены</h3>
              <p className="advantage-description sansation-regular">
                Играйте с комфортом, не переплачивая
              </p>
            </div>
          </div>

          <div className="advantage-card">
            <div className="advantage-content">
              <div className="advantage-icon">
                <img src={hardwareIcon} alt="Иконка процессора" />
              </div>
              <h3 className="advantage-name sansation-bold">Мощное железо</h3>
              <p className="advantage-description sansation-regular">
                Intel Core i9, RTX 4080, 32GB RAM
              </p>
            </div>
          </div>

          <div className="advantage-card">
            <div className="advantage-content">
              <div className="advantage-icon">
                <img src={smileIcon} alt="Иконка смайлика" />
              </div>
              <h3 className="advantage-name sansation-bold">Уютная атмосфера</h3>
              <p className="advantage-description sansation-regular">
                Удобные кресла, кондиционеры, просторный зал
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Advantages