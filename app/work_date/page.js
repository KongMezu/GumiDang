/*
산책기록_입력하기_날짜입력

해야하는거 : 
1) 날짜(work_date) - 시작도착(work_input) - 거리 계산 완료 결과(work_save) : 페이지 컨트롤러로 이동
2) 달력 스크롤형 - 이거 무슨 한달에 138$ 내야 가능( npm install react-datepicker   로 진행 대대적인 CSS 갈아없기)
3) 거리 입력하기 누르면 페이지 넘어감 & 백api 연결해서 날짜 값 전달

*/
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './work_date.module.css';

export default function WorkDate() {
    const [selectedDate, setSelectedDate] = useState(null);
    const router = useRouter();

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async () => {
        if (!selectedDate) return;

        // 히히..백 연결이 안대염..왤까요... ㅋㅋㅋㅋㅋ 아 미치겠네 진짜...
        try {
            const response = await fetch('https://gummy-dang.com/api/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recordTime: selectedDate.toISOString().split('T')[0],
                }),
            });

            if (!response.ok) {
                const errorMessage = `네트워크 응답이 올바르지 않습니다. 상태 코드: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('백엔드 응답 데이터:', data);

            // 응답 데이터 확인 후 다음 페이지로 이동
            if (data.code === 'COM-000') {
                router.push({
                    pathname: '/work_input',
                    query: { recordDate: selectedDate.toISOString().split('T')[0] }
                });
            } else {
                console.error('응답 데이터에 오류가 있습니다:', data);
            }
        } catch (error) {
            console.error('날짜 전송 중 문제가 발생했습니다:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>산책기록 입력하기</h1>
            <div className={styles.datePickerWrapper}>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className={styles.datePicker}
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
