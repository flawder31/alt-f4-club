import Header from '../components/Header'
import Hero from '../components/Hero'
import Advantages from '../components/Advantages'
import Zones from '../components/Zones'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Advantages />
        <Zones />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}

export default HomePage