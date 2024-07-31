'use client';

import { useState } from 'react';
import styles from './work_date.module.css';
import { useRouter } from 'next/navigation';

export default function WorkDate() {
const [selectedDate, setSelectedDate] = useState('');
const router = useRouter();

const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
};

const handleSubmit = async () => {
    if (selectedDate) {
    try {
        const response = await fetch('https://gummy-dang.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: selectedDate }),
        });

        if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다');
        }

        const data = await response.json();
        console.log(data);

        router.push('/work_input');
    } catch (error) {
        console.error('날짜 전송 중 문제가 발생했습니다:', error);
    }
    }
};

return (
    <div className={styles.container}>
    <h1>산책기록 입력하기</h1>
    <div className={styles.datePickerWrapper}>
        <input
        type="date"
        className={styles.datePicker}
        onChange={handleDateChange}
        value={selectedDate}
        />
    </div>
    <button
        className={`${styles.submitButton} ${selectedDate ? styles.active : ''}`}
        onClick={handleSubmit}
        disabled={!selectedDate}
    >
        거리 입력하기
    </button>
    </div>
);
}
