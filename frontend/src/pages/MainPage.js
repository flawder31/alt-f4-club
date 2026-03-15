// frontend/src/pages/MainPage.js
import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { api } from '../utils/api';
import UserList from '../components/UserList';  
import UserSearch from '../components/UserSearch';
import styles from './MainPage.module.css';

function MainPage() {
    const [message, setMessage] = React.useState('Загрузка...');
    const { users, loading, error, searchUser } = useUsers();

    // Проверка связи с бэкендом
    React.useEffect(() => {
        api.checkConnection()
            .then(data => {
                setMessage(data.message || 'Связь с бэкендом есть');
            })
            .catch(err => {
                setMessage('❌ Ошибка связи: ' + err.message);
            });
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Моё React приложение</h1>
            
            {/* Статус бэкенда */}
            <div className={styles.statusCard}>
                <strong>Статус бэкенда:</strong> {message}
            </div>

            {/* Ошибки */}
            {error && (
                <div className={styles.errorCard}>
                    <strong>❌ Ошибка:</strong> {error}
                </div>
            )}

            {/* Список пользователей */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>👥 Все пользователи</h2>
                <UserList users={users} loading={loading} />
            </section>

            {/* Поиск */}
            <section className={styles.section}>
                <UserSearch onSearch={searchUser} loading={loading} />
            </section>

            {/* Информация */}
            <div className={styles.infoCard}>
                <h3>Информация:</h3>
                <ul>
                    <li>Бэкенд: <a href="http://localhost:8000">http://localhost:8000</a></li>
                    <li>Документация: <a href="http://localhost:8000/docs">http://localhost:8000/docs</a></li>
                </ul>
            </div>
        </div>
    );
}

export default MainPage;