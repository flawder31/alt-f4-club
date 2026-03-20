import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' 
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import SeatsPage from './pages/SeatsPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/seats" element={<SeatsPage />} />
        </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App