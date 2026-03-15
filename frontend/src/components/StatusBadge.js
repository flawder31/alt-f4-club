// frontend/src/components/StatusBadge.js
import React from 'react';
import styles from './StatusBadge.module.css';

function StatusBadge({ isActive }) {
    return (
        <span className={isActive ? styles.active : styles.inactive}>
            {isActive ? 'Активен' : 'Неактивен'}
        </span>
    );
}

export default StatusBadge;