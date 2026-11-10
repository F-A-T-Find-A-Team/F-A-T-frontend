'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, authApi, getAccessToken, setAccessToken } from '@/app/lib/api';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGithubSubmitting, setIsGithubSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) {
            if (getAccessToken()) router.replace('/search');
            return;
        }
        void Promise.resolve().then(async () => {
            const returnedState = params.get('state');
            const expectedState = window.sessionStorage.getItem('githubLoginState');
            window.sessionStorage.removeItem('githubLoginState');
            window.history.replaceState(null, '', window.location.pathname);
            if (!expectedState || returnedState !== expectedState) {
                setError('GitHub 인증 상태를 확인할 수 없습니다. 다시 시도해주세요.');
                return;
            }
            setIsGithubSubmitting(true);
            try {
                const result = await authApi.githubLogin(code);
                setAccessToken(result.accessToken);
                router.replace('/search');
            } catch (err) {
                setError(err instanceof ApiError ? err.message : 'GitHub 로그인에 실패했습니다.');
            } finally {
                setIsGithubSubmitting(false);
            }
        });
    }, [router]);

    async function login() {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        try {
            const result = await authApi.login(email, password);
            setAccessToken(result.accessToken);
            alert(`${result.user.nickname}님 환영합니다!`);
            router.replace('/search');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : '서버에 연결할 수 없습니다. API 주소를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    }

    function loginWithGithub() {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        if (!clientId) {
            setError('GitHub OAuth를 사용하려면 NEXT_PUBLIC_GITHUB_CLIENT_ID를 설정해주세요.');
            return;
        }
        const state = crypto.randomUUID();
        window.sessionStorage.setItem('githubLoginState', state);
        const query = new URLSearchParams({ client_id: clientId, redirect_uri: `${window.location.origin}/login`, scope: 'read:user', state });
        window.location.assign(`https://github.com/login/oauth/authorize?${query}`);
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

                    {error && <p role="alert" style={{ color: '#c2413b' }}>{error}</p>}
                    <button className="Login-submit" onClick={login} disabled={isSubmitting}>
                        {isSubmitting ? '로그인 중...' : '로그인'}
                    </button>

                    <span className="Login-signBox">계정이 없으신가요? <Link href="/sign">회원가입</Link></span>
                </div>
            </section>
        </div>
    );
}
