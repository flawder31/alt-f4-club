import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Регистрация
export const register = async (userData) => {
  try {
    // Эндпоинт: POST /auth/register
    const response = await api.post('/auth/register', userData);
    return response.data; // Возвращает { access_token, token_type, user }
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};

// Авторизация (вход)
export const login = async (credentials) => {
  try {
    // Эндпоинт: POST /auth/login
    const response = await api.post('/auth/login', credentials);
    return response.data; // Возвращает { access_token, token_type, user }
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};

// Получение данных текущего пользователя
export const getCurrentUser = async () => {
  try {
    // Эндпоинт: GET /auth/me
    const response = await api.get('/auth/me');
    return response.data; // Возвращает { phone, name, role_id, balance }
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};

// Выход из системы (на стороне клиента)
export const logout = () => {
  localStorage.removeItem('token');
};

// Получение баланса
export const getBalance = async () => {
  try {
    // Эндпоинт: GET /balance
    const response = await api.get('/balance');
    return response.data; // Возвращает { balance }
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};

// Пополнение баланса
export const depositBalance = async (amount) => {
  try {
    // Эндпоинт: POST /balance/deposit
    const response = await api.post('/balance/deposit', { amount });
    return response.data; // Возвращает { new_balance, message }
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};

export default api;