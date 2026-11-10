'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, authApi } from '@/app/lib/api';
import { useSignupDraft } from '@/app/lib/signup-context';

export default function Verify() {

    const router = useRouter();
    const { draft, setDraft } = useSignupDraft();

    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!draft) router.replace('/sign');
    }, [draft, router]);

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
    const handleResend = async () => {
        if (!draft) return;
        setError('');
        try {
            const result = await authApi.sendVerification(draft.email);
            setDraft({ ...draft, verificationId: result.verificationId });
            setTimeLeft(result.expiresInSeconds);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : '인증 코드를 다시 보낼 수 없습니다.');
        }
    };

    const confirm = async () => {
        if (!draft || code.length !== 6 || isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        try {
            const verification = await authApi.verifyEmail(draft.verificationId, code);
            await authApi.signup({
                signupToken: verification.signupToken,
                email: draft.email,
                password: draft.password,
                nickname: draft.nickname,
                studentId: draft.studentId,
                name: draft.name,
                gender: draft.gender,
                bio: draft.bio,
                majors: draft.majors,
                techStacks: draft.techStacks,
                avatarFileId: null,
            });
            setDraft(null);
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            router.push('/login');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : '인증을 완료할 수 없습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }

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
                    <span className="Verify-email">{draft?.email ?? ''}</span> 로 6자리 코드를 보냈어요.
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
                        inputMode="numeric"
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                </div>

                {error && <p role="alert" style={{ color: '#c2413b' }}>{error}</p>}
                {/* 인증 완료 버튼 */}
                <button type="button" className="Verify-submitBtn" disabled={isSubmitting || code.length !== 6} onClick={confirm}>
                    {isSubmitting ? '확인 중...' : '인증 완료'}
                </button>

                {/* 재전송 링크 */}
                <div className="Verify-resendBox">
                    코드를 못 받았나요? <button type="button" onClick={handleResend} className="Verify-resendBtn">재전송</button>
                </div>
            </div>
        </main>
    );
}