'use client';
import { useState, useEffect } from 'react';

export default function Verify() {
    const [code, setCode] = useState('482913'); // 이미지처럼 초기값 세팅 (DEMO)
    const [timeLeft, setTimeLeft] = useState(276); // 4분 36초 (276초)

    // 타이머 기능
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // 초를 MM:SS 형식으로 변환하는 함수
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // 재전송 클릭 이벤트
    const handleResend = () => {
        setTimeLeft(300); // 5분으로 재설정
        alert('인증 코드가 재전송되었습니다.');
    };

    return (
        <main className="Verify-container">
            <div className="Verify-box">
                {/* 상단 메일 아이콘 */}
                <div className="Verify-iconBox">
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>

                {/* 타이틀 및 안내문구 */}
                <h2>2차 인증</h2>
                <p className="Verify-description">
                    <span className="Verify-email">20261107@dsm.hs.kr</span> 로 6자리 코드를 보냈어요.
                </p>

                {/* 인증번호 입력 영역 */}
                <div className="Verify-inputSection">
                    <div className="Verify-labelWrapper">
                        <label>인증번호</label>
                        <span className="Verify-timer">{formatTime(timeLeft)}</span>
                    </div>
                    <input 
                        type="text" 
                        maxLength={6}
                        className="Verify-codeInput"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                {/* 인증 완료 버튼 */}
                <button type="button" className="Verify-submitBtn">
                    인증 완료
                </button>

                {/* 재전송 링크 */}
                <div className="Verify-resendBox">
                    코드를 못 받았나요? <button type="button" onClick={handleResend} className="Verify-resendBtn">재전송</button>
                </div>
            </div>
        </main>
    );
}