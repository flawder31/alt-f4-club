import '../styles/Zones.css'
import '../styles/global.css'

import standartImage from '../../public/images/standart-zone.webp'
import vipImage from '../../public/images/vip-zone.webp'
import proImage from '../../public/images/pro-zone.webp'

function Zones() {
  return (
    <section className="zones-section">
      <div className="container">
        <h2 className="zones-title sansation-bold">Зоны</h2>
        
        <div className="zones-grid">
          <div className="zone-card">
            <div className="zone-content">
              <img 
                src={standartImage} 
                alt="Зона Standart" 
                className="zone-image" 
              />
              <h3 className="zone-name sansation-bold">STANDART</h3>
              <div className="zone-price sansation-bold">200 ₽/час</div>
              <p className="zone-description sansation-regular">
                Для любителей поиграть с друзьями без лишних требований
              </p>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-content">
              <img 
                src={vipImage} 
                alt="VIP зона" 
                className="zone-image" 
              />
              <h3 className="zone-name sansation-bold">VIP</h3>
              <div className="zone-price sansation-bold">400 ₽/час</div>
              <p className="zone-description sansation-regular">
                Повышенный комфорт, отдельное помещение
              </p>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-content">
              <img 
                src={proImage} 
                alt="PRO зона" 
                className="zone-image" 
              />
              <h3 className="zone-name sansation-bold">PRO</h3>
              <div className="zone-price sansation-bold">600 ₽/час</div>
              <p className="zone-description sansation-regular">
                Максимальные настройки для киберспорта, топ-железо
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Zones