import Header from '../components/Header'
import Footer from '../components/Footer'

function BookingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="section-title">Прайс-лист</h1>
            <p className="text-center">Подробная информация о тарифах</p>
          </div>
        </section>
        <Zones />
      </main>
      <Footer />
    </>
  )
}

export default BookingPage