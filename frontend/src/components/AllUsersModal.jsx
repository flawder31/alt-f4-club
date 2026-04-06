import { useEffect, useState } from 'react'
import api from '../api/auth'
import AdminDepositModal from './AdminDepositModal'
import '../styles/AllUsersModal.css'

function AllUsersModal({ isOpen, onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!isOpen) return
      
      setLoading(true)
      setError('')
      
      try {
        const response = await api.get('/users')
        const sortedUsers = [...response.data.users].sort((a, b) => {
          if (a.role_id !== b.role_id) {
            return a.role_id - b.role_id
          }
          return a.name.localeCompare(b.name)
        })
        setUsers(sortedUsers)
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err)
        setError('Не удалось загрузить список пользователей')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllUsers()
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, onClose])

  const getRoleName = (roleId) => {
    return roleId === 1 ? 'Администратор' : 'Пользователь'
  }

  const getRoleColor = (roleId) => {
    return roleId === 1 ? '#ff4d4d' : '#1DACFF'
  }

  const handleDepositClick = (user) => {
    setSelectedUser(user)
    setIsDepositModalOpen(true)
  }

  const handleDepositSuccess = async () => {
    try {
      const response = await api.get('/users')
      const sortedUsers = [...response.data.users].sort((a, b) => {
        if (a.role_id !== b.role_id) {
          return a.role_id - b.role_id
        }
        return a.name.localeCompare(b.name)
      })
      setUsers(sortedUsers)
    } catch (err) {
      console.error('Ошибка обновления пользователей:', err)
    }
    setIsDepositModalOpen(false)
    setSelectedUser(null)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="users-modal-overlay" onClick={onClose}>
        <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="users-modal-close" onClick={onClose}>×</button>
          
          <h2 className="users-modal-title sansation-bold">Все пользователи</h2>
          
          {loading ? (
            <div className="users-loading">Загрузка пользователей...</div>
          ) : error ? (
            <div className="users-error">{error}</div>
          ) : users.length === 0 ? (
            <div className="users-empty">
              <p>Пользователи не найдены</p>
            </div>
          ) : (
            <div className="users-list">
              <div className="users-header">
                <span className="header-name">Имя</span>
                <span className="header-phone">Телефон</span>
                <span className="header-role">Роль</span>
                <span className="header-balance">Баланс</span>
              </div>
              {users.map((user, index) => (
                <div key={index} className="user-item">
                  <span className="user-name">{user.name}</span>
                  <span className="user-phone">{user.phone}</span>
                  <span 
                    className="user-role"
                    style={{ color: getRoleColor(user.role_id) }}
                  >
                    {getRoleName(user.role_id)}
                  </span>
                  <div className="user-balance-wrapper">
                    <span className="user-balance">{user.balance} ₽</span>
                    <button 
                      className="deposit-user-btn"
                      onClick={() => handleDepositClick(user)}
                      title="Пополнить баланс"
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="users-modal-buttons">
            <button className="users-close-btn sansation-bold" onClick={onClose}>
              ЗАКРЫТЬ
            </button>
          </div>
        </div>
      </div>

      <AdminDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSuccess={handleDepositSuccess}
      />
    </>
  )
}

export default AllUsersModal