// frontend/src/components/UserSearch.js
import React from 'react';
import StatusBadge from './StatusBadge';
import styles from './UserSearch.module.css';

function UserSearch({ onSearch, loading }) {
    const [email, setEmail] = React.useState('');
    const [result, setResult] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            alert('Введите email');
            return;
        }

        const user = await onSearch(email);
        setResult(user);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>🔍 Поиск пользователя</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    placeholder="Введите email (например: user1@example.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className={styles.button}
                >
                    {loading ? 'Поиск...' : 'Найти'}
                </button>
            </form>

            {result && (
                <div className={styles.result}>
                    {result.notFound ? (
                        <p className={styles.notFound}>
                            ❌ Пользователь с таким email не найден
                        </p>
                    ) : (
                        <div>
                            <h3 className={styles.resultTitle}>Результат:</h3>
                            <p><strong>Email:</strong> {result.email}</p>
                            {result.full_name && (
                                <p><strong>Имя:</strong> {result.full_name}</p>
                            )}
                            <p>
                                <strong>Статус:</strong>{' '}
                                <StatusBadge isActive={result.is_active} />
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserSearch;