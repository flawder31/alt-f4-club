import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' 
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import SeatsPage from './pages/SeatsPage'
import AdminChangeSeatPage from './pages/AdminChangeSeatPage'
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
          <Route path="/admin/change-seat" element={<AdminChangeSeatPage />} />
        </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App