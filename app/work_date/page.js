// 'use client' 디렉티브를 파일의 맨 위에 위치시키기
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './work_date.module.css';
import './custom-datepicker.css';
import styles from './work_date.module.css';
import ko from 'date-fns/locale/ko';

// 로케일 등록
registerLocale('ko', ko);

export default function WorkDate() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // 로컬 스토리지에서 토큰 값 가져오기
        const storedToken = window.localStorage.getItem('AccessToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.log('No token found in localStorage');
            // 필요 시 여기에서 사용자에게 로그인 화면으로 리디렉션하는 등의 처리 추가 가능
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
        console.log(`Formatted Date: ${formattedDate}`); // Debugging line

        // 여기에 API 호출 등을 추가하여 토큰을 사용하는 방법을 구현할 수 있습니다.

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
