'use client';
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {

    const router = useRouter();

    const login = () => {
        router.push('/search');
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
                        <input id="emailInput" type="email"/>
                    </div>

                    <div className="Login-inputBox">
                        <label htmlFor="pwInput">비밀번호</label>
                        <input id="pwInput" type="password"/>
                    </div>

                    <button className="Login-submit" onClick={()=>{
                        login();
                    }}>로그인</button>

                    <span className="Login-signBox">계정이 없으신가요? <Link href="/sign">회원가입</Link></span>
                </div>
            </section>
        </div>
    );
}
