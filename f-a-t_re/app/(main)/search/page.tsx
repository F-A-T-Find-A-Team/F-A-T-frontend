'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Search() {

    const [currentType, setCurrentTpye] = useState("전체");

    const type = [
        {name: "전체"},
        {name: "모집중"},
        {name: "내 전공"},
        {name: "관심 스택"}
    ]

    return (
        <div className='Search-container'>
            <div className='Search-top'>
                <div>
                    <h2>프로젝트 탐색</h2>
                    <span>내 전공·관심 스택에 맞는 팀을 찾아보세요</span>
                </div>

                <Link href='/pjcreate'>+ 새 프로젝트</Link>
            </div>

            <div className='Search-typeBox'>
                {type.map((item) => (
                    <div className={currentType === item.name ? "active Search-type" : "Search-type"} onClick={()=>{
                        setCurrentTpye(item.name);
                    }} key={item.name}>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    )
}