'use client';
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    async function login() {
        try {
            const res = await fetch('http://localhost:8080/api/login', { // 👉 실제 백엔드 API 엔드포인트로 변경하세요
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            // HTTP 상태와 상관없이 백엔드가 보낸 JSON 응답 파싱
            const result = await res.json();

            // 실패 응답인 경우 (400, 401, 403 등)
            if (!res.ok || !result.success) {
                // 명세의 error.message를 그대로 띄워줍니다 (예: "이메일 인증이 완료되지 않았습니다.")
                throw new Error(result.error?.message || '로그인에 실패했습니다.');
            }

            // 로그인 성공 시 (200 OK)
            console.log('로그인 성공 데이터:', result.data);

            // 1. 발급받은 AccessToken을 localStorage 등에 저장 (필요한 경우)
            localStorage.setItem('accessToken', result.data.accessToken);

            // 2. 로그인 성공 알림 및 홈('/')으로 이동
            alert(`${result.data.user.nickname}님 환영합니다!`);
            router.push('/search');

        } catch (err: any) {
            console.error("로그인 에러:", err);
            // 백엔드에서 전달된 에러 메시지 혹은 기본 에러 메시지 출력
            alert(err.message || '서버 통신 중 오류가 발생했습니다.');
        }
    }

    return (
        <div className="Login-container">
            <section className="Login-leftSide">
                <h1>F.A.T.</h1>

                <div className="Login-desBox">
                    <h2>전공과 기술 스택으로<br/>팀을 찾는 곳</h2>
                    <span>아이디어부터 완성까지, 프로젝트를 함께할 사람을 만<br/>나보세요.</span>
                </div>

                <span style={{
                    color:"#167958"
                }}>© 2026 DSM · F.A.T</span>
            </section>

            <section className="Login-rightSide">
                <div className="Login-box">
                    <h3>로그인</h3>
                    <span style={{
                        color:"rgb(154, 154, 154)",
                        fontSize:"16px",
                        fontWeight:"500",
                        marginBottom:"1rem"
                    }}>학교 이메일 계정으로 시작하세요</span>
                    
                    <div className="Login-inputBox">
                        <label htmlFor="emailInput">학교 이메일</label>
                        <input 
                            id="emailInput" 
                            type="email" 
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}
                            placeholder="20261107@dsm.hs.kr"
                        />
                    </div>

                    <div className="Login-inputBox">
                        <label htmlFor="pwInput">비밀번호</label>
                        <input 
                            id="pwInput" 
                            type="password" 
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password}
                        />
                    </div>

                    <button className="Login-submit" onClick={login}>
                        로그인
                    </button>

                    <span className="Login-signBox">계정이 없으신가요? <Link href="/sign">회원가입</Link></span>
                </div>
            </section>
        </div>
    );
}