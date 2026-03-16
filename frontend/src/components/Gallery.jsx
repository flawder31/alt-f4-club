import '../styles/Gallery.css'
import '../styles/global.css'

import photo1 from '../../public/images/gallery-1.jpg'
import photo2 from '../../public/images/gallery-2.avif'
import photo3 from '../../public/images/gallery-3.webp'
import photo4 from '../../public/images/gallery-4.webp'
import photo5 from '../../public/images/gallery-5.jpg'
import photo6 from '../../public/images/gallery-6.avif'

function Gallery() {
  return (
    <section className="gallery-section">
      <div className="container">
        <h2 className="gallery-title sansation-bold">Атмосфера</h2>
        
        <div className="gallery-grid">
          <div className="gallery-row">
            <div className="gallery-item">
              <img src={photo1} alt="Интерьер клуба 1" className="gallery-image" />
            </div>
            <div className="gallery-item">
              <img src={photo2} alt="Интерьер клуба 2" className="gallery-image" />
            </div>
          </div>
          
          <div className="gallery-row">
            <div className="gallery-item">
              <img src={photo3} alt="Интерьер клуба 3" className="gallery-image" />
            </div>
            <div className="gallery-item">
              <img src={photo4} alt="Интерьер клуба 4" className="gallery-image" />
            </div>
          </div>
          
          <div className="gallery-row">
            <div className="gallery-item">
              <img src={photo5} alt="Интерьер клуба 5" className="gallery-image" />
            </div>
            <div className="gallery-item">
              <img src={photo6} alt="Интерьер клуба 6" className="gallery-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery