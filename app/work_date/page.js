/* 날짜 입력 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './work_date.module.css';
import './custom-datepicker.css';
import styles from './work_date.module.css';
import ko from 'date-fns/locale/ko';


registerLocale('ko', ko);

export default function WorkDate() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = window.localStorage.getItem('AccessToken');
            if (storedToken) {
                setToken(storedToken);
            } else {
                console.log('No token found in localStorage');
            }
        }
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = () => {
        if (!selectedDate || !token) return;

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log(`Formatted Date: ${formattedDate}`);

        router.push(`/work_input?recordDate=${formattedDate}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책기록 입력하기</h1>
            <div className={styles.datePickerWrapper}>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy년 MM월 dd일"
                    locale="ko"
                    className={`${styles.datePicker} datepicker`}
                    placeholderText="날짜를 선택하세요"
                />
            </div>
            <button
                className={`${styles.submitButton} ${selectedDate ? styles.active : ''}`}
                onClick={handleSubmit}
                disabled={!selectedDate || !token}
            >
                거리 측정하기
            </button>
        </div>
    );
}
