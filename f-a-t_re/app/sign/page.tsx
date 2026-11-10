'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, authApi } from '@/app/lib/api';
import { useSignupDraft } from '@/app/lib/signup-context';

export default function Sign() {
    const router = useRouter();
    const { setDraft } = useSignupDraft();

    // 상태 관리 
    const [nickname, setNickname] = useState('');
    const [idNum, setIdNum] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('남');
    
    // 👉 [변경] 전공을 배열이 아닌 단일 문자열로 변경 (기본값 'FE')
    const [selectedMajor, setSelectedMajor] = useState<string>('FE');
    
    // 관심 기술 스택 관련 상태
    const [techInput, setTechInput] = useState('');
    const [techStacks, setTechStacks] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 전공 리스트
    const majorList = ['FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'];

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

    const startVerification = async () => {
        if (!email.trim() || !password || !nickname.trim() || !idNum.trim() || !name.trim()) {
            setError('이메일, 비밀번호, 닉네임, 학번, 이름을 입력해주세요.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const result = await authApi.sendVerification(email.trim());
            setDraft({
                email: email.trim(),
                password,
                nickname: nickname.trim(),
                studentId: idNum.trim(),
                name: name.trim(),
                gender: gender === '남' ? 'MALE' : gender === '여' ? 'FEMALE' : 'OTHER',
                bio,
                majors: [selectedMajor],
                techStacks,
                verificationId: result.verificationId,
            });
            router.push('/verify');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : '인증 메일을 보낼 수 없습니다. API 주소를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
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
                    <label htmlFor="signup-email">학교 이메일</label>
                    <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="20261107@dsm.hs.kr" />
                </div>
                <div className="Sign-inputGroup">
                    <label htmlFor="signup-password">비밀번호</label>
                    <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    <label>내 전공 <span className="Sign-subLabel">(1개 선택)</span></label>
                    <div className="Sign-tagsBox">
                        {majorList.map((major) => (
                            <button
                                key={major}
                                type="button"
                                // 👉 [변경] 선택된 단일 전공과 일치할 때만 active 클래스 부여
                                className={`Sign-tag ${selectedMajor === major ? 'active' : ''}`}
                                // 👉 [변경] 클릭 시 해당 전공으로 값 교체
                                onClick={() => setSelectedMajor(major)}
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

                {error && <p role="alert" style={{ color: '#c2413b' }}>{error}</p>}
                <button type="button" className="Sign-submitBtn" disabled={isSubmitting} onClick={startVerification}>
                    {isSubmitting ? '인증 메일 보내는 중...' : '이메일 인증하고 계속하기'}
                </button>
            </div>
        </main>
    );
}