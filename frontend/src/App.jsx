import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' 
import HomePage from './pages/HomePage'
import BookingPage from './pages/BookingPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App