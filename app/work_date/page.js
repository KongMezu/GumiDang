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
    const router = useRouter();

    useEffect(() => {
        window.localStorage.setItem('AccessToken', 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN0MSIsImF1dGgiOiJNRU1CRVIiLCJpZCI6MSwiZXhwIjoxNzIyOTI0OTI4fQ.tJJOq-YZU7z-ZLEfZMwy-G1tI-OB2pKxrXgEGGEqspmvCfYydtL0O7Kwl8iASLA9');
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = () => {
        if (!selectedDate) return;

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log(`Formatted Date: ${formattedDate}`); // Debugging line
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
                disabled={!selectedDate}
            >
                거리 측정하기
            </button>
        </div>
    );
}
