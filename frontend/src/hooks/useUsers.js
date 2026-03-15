// frontend/src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загружаем пользователей при первом рендере
    useEffect(() => {
        loadUsers();
    }, []);

    // Функция загрузки всех пользователей
    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка загрузки пользователей:', err);
        } finally {
            setLoading(false);
        }
    };

    // Функция поиска пользователя по email
    const searchUser = async (email) => {
        setLoading(true);
        setError(null);
        
        try {
            const user = await api.getUserByEmail(email);
            return user;
        } catch (err) {
            setError(err.message);
            console.error('Ошибка поиска:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        error,
        loadUsers,
        searchUser
    };
}