// frontend/src/utils/api.js
const API_BASE = 'http://localhost:8000';

export const api = {
    // Проверка связи с бэкендом
    async checkConnection() {
        const res = await fetch(`${API_BASE}/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    },

    // Получить всех пользователей
    async getUsers() {
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // Сервер может вернуть { users: [...] } или просто [...]
        return data.users || data;
    },

    // Получить пользователя по email
    async getUserByEmail(email) {
        if (!email) throw new Error('Email не указан');
        
        const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`);
        
        if (res.status === 404) {
            return { notFound: true };
        }
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        // Сервер может вернуть { user: {...} } или просто {...}
        return data.user || data;
    }
};