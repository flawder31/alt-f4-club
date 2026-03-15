// frontend/src/components/UserList.js
import React from 'react';
import StatusBadge from './StatusBadge';
import styles from './UserList.module.css';

function UserList({ users, loading }) {
    if (loading) {
        return <p className={styles.message}>Загрузка...</p>;
    }

    if (!users || users.length === 0) {
        return <p className={styles.message}>Нет пользователей</p>;
    }

    return (
        <ul className={styles.list}>
            {users.map(user => (
                <li key={user.email} className={styles.item}>
                    <span className={styles.icon}>📧</span>
                    <div className={styles.info}>
                        <div className={styles.email}>{user.email}</div>
                        {user.full_name && (
                            <div className={styles.name}>{user.full_name}</div>
                        )}
                    </div>
                    <StatusBadge isActive={user.is_active} />
                </li>
            ))}
        </ul>
    );
}

export default UserList;