'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Sign() {

    const router = useRouter();

    // 상태 관리 (이미지 UI와 동일하게 초기값 설정)
    const [nickname, setNickname] = useState('hwjeong');
    const [idNum, setIdNum] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('남');
    const [selectedMajors, setSelectedMajors] = useState<string[]>(['FE']);
    
    // 관심 기술 스택 관련 상태
    const [techInput, setTechInput] = useState('');
    const [techStacks, setTechStacks] = useState<string[]>(['Flutter', 'Spring Boot', 'Django']);

    // 전공 리스트
    const majorList = ['FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'];

    // 전공 토글 함수 (복수 선택)
    const toggleMajor = (major: string) => {
        if (selectedMajors.includes(major)) {
            setSelectedMajors(selectedMajors.filter(m => m !== major));
        } else {
            setSelectedMajors([...selectedMajors, major]);
        }
    };

    // 기술 스택 추가 함수
    const addTechStack = () => {
        if (techInput.trim() && !techStacks.includes(techInput.trim())) {
            setTechStacks([...techStacks, techInput.trim()]);
            setTechInput('');
        }
    };

    // 기술 스택 삭제 함수
    const removeTechStack = (tech: string) => {
        setTechStacks(techStacks.filter(t => t !== tech));
    };

    const login = () => {
        router.push('/verify');
    }

    return (
        <main className="Sign-container">
            <div className="Sign-box">
                <Link href="/login" className="Sign-backLink">
                    <h2>&lt; 회원가입</h2>
                </Link>
                <span className="Sign-subtitle">프로필을 설정하고 팀을 찾아보세요</span>

                <div className="Sign-profileSection">
                    <div className="Sign-profileImage">사진</div>
                    <div className="Sign-profileInputs">
                        <input 
                            type="text" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)} 
                            placeholder="닉네임"
                        />
                        <div className="Sign-rowInputs">
                            <input 
                                type="text" 
                                value={idNum} 
                                onChange={(e) => setIdNum(e.target.value)} 
                                placeholder="학번"
                            />
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="이름"
                            />
                        </div>
                    </div>
                </div>

                <div className="Sign-inputGroup">
                    <div className="Sign-labelWrapper">
                        <label>자기소개</label>
                        <span className="Sign-charCount">{bio.length}/100</span>
                    </div>
                    <textarea 
                        value={bio} 
                        onChange={(e) => {
                            if (e.target.value.length <= 100) setBio(e.target.value);
                        }}
                        placeholder="자기소개를 입력해주세요."
                        rows={3}
                    />
                </div>

                <div className="Sign-inputGroup">
                    <label>성별</label>
                    <div className="Sign-genderBox">
                        {['남', '여', '기타'].map((g) => (
                            <button
                                key={g}
                                type="button"
                                className={`Sign-genderBtn ${gender === g ? 'active' : ''}`}
                                onClick={() => setGender(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="Sign-inputGroup">
                    <label>내 전공 <span className="Sign-subLabel">(복수 선택 가능)</span></label>
                    <div className="Sign-tagsBox">
                        {majorList.map((major) => (
                            <button
                                key={major}
                                type="button"
                                className={`Sign-tag ${selectedMajors.includes(major) ? 'active' : ''}`}
                                onClick={() => toggleMajor(major)}
                            >
                                {major}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="Sign-inputGroup">
                    <label>관심 기술 스택 <span className="Sign-subLabel">· 자유 입력</span></label>
                    <div className="Sign-techInputBox">
                        <input 
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter') { 
                                    e.preventDefault(); 
                                    addTechStack(); 
                                } 
                            }}
                            placeholder="기술을 입력하고 Enter (예: Next.js)"
                        />
                        <button type="button" className="Sign-addBtn" onClick={addTechStack}>추가</button>
                    </div>
                    
                    <div className="Sign-selectedTechs">
                        {techStacks.map((tech) => (
                            <span key={tech} className="Sign-techChip">
                                {tech}
                                <button type="button" onClick={() => removeTechStack(tech)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button type="button" className="Sign-submitBtn" onClick={() => {
                    login();
                }}>
                    이메일 인증하고 계속하기
                </button>
            </div>
        </main>
    );
}