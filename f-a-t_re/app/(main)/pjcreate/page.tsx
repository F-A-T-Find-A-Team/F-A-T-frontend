'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pjcreate() {
    const router = useRouter();

    // 입력 상태 관리
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // 필요 전공 (복수 선택)
    const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
    const majorList = ['FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'];

    const toggleMajor = (major: string) => {
        if (selectedMajors.includes(major)) {
            setSelectedMajors(selectedMajors.filter(m => m !== major));
        } else {
            setSelectedMajors([...selectedMajors, major]);
        }
    };

    // 기술 스택 관련 상태
    const [techInput, setTechInput] = useState('');
    const [techStacks, setTechStacks] = useState<string[]>([]);

    const addTechStack = () => {
        if (techInput.trim() && !techStacks.includes(techInput.trim())) {
            setTechStacks([...techStacks, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTechStack = (tech: string) => {
        setTechStacks(techStacks.filter(t => t !== tech));
    };

    // 프로젝트 기한 및 모집 인원 상태
    const [deadline, setDeadline] = useState('2026-12-22');
    const [memberCount, setMemberCount] = useState(5);

    const handleCreate = () => {
        alert('프로젝트가 생성되었습니다!');

        // 👉 생성 완료 후 모든 입력값 및 상태 초기화
        setTitle('');
        setDescription('');
        setSelectedMajors([]);
        setTechInput('');
        setTechStacks([]);
        setDeadline('2026-12-22');
        setMemberCount(5);

        // 페이지 이동
        router.push('/search');
    };

    return (
        <div className='Pjcreate-container'>
            <div className='Pjcreate-box'>
                <h2>새 프로젝트 만들기</h2>
                <span style={{
                    color: "#98a3b2",
                    marginTop: "0.4rem",
                    marginBottom: "2rem",
                    display: "block"
                }}>
                    필요한 전공과 기술 스택을 정해 팀원을 모아보세요
                </span>

                {/* 프로젝트 제목 */}
                <label htmlFor='Pjcreate-titleInput'>프로젝트 제목</label>
                <input 
                    id='Pjcreate-titleInput' 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='예: 교내 급식 예약 & 잔반 관리 앱'
                />

                {/* 상세 내용 */}
                <label htmlFor='Pjcreate-desInput' style={{ marginTop: "2rem" }}>상세 내용</label>
                <textarea 
                    id='Pjcreate-desInput' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='어떤 프로젝트인지, 어떤 기술로 만들 예정인지 적어주세요.'
                    rows={4}
                />

                {/* 필요 전공 (복수 선택 버튼) */}
                <label style={{ marginTop: "2rem", display: "block" }}>필요 전공</label>
                <div className="Sign-tagsBox" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
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

                {/* 기술 스택 자유 입력 */}
                <label style={{ marginTop: "2rem", display: "block" }}>
                    기술 스택 <span style={{ fontSize: "0.85rem", color: "#98a3b2" }}>· 자유 입력</span>
                </label>
                <div className="Sign-techInputBox" style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
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
                        placeholder="기술을 입력하고 Enter (예: Next.js, PostgreSQL)"
                        style={{ flex: 1 }}
                    />
                    <button type="button" className="Sign-addBtn" onClick={addTechStack}>추가</button>
                </div>
                
                <div className="Sign-selectedTechs" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {techStacks.map((tech) => (
                        <span key={tech} className="Sign-techChip">
                            {tech}
                            <button type="button" onClick={() => removeTechStack(tech)}>×</button>
                        </span>
                    ))}
                </div>

                {/* 프로젝트 기한 */}
                <label style={{ marginTop: "2rem", display: "block" }}>프로젝트 기한</label>
                <div style={{ marginTop: "8px" }}>
                    <input 
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                </div>

                {/* 예상 모집 인원 조절 */}
                <label style={{ marginTop: "2rem", display: "block" }}>예상 모집 인원</label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px", maxWidth: "200px" }} className='Pjcreate-peopleBox'>
                    <button 
                        type="button" 
                        onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                        style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontWeight: "bold" }}
                    >
                        -
                    </button>
                    <span style={{ fontWeight: "600", flex: 1, textAlign: "center", fontSize: "1.1rem" }}>
                        {memberCount}명
                    </span>
                    <button 
                        type="button" 
                        onClick={() => setMemberCount(memberCount + 1)}
                        style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#21f0a8", cursor: "pointer", fontWeight: "bold" }}
                    >
                        +
                    </button>
                </div>

                {/* 하단 취소 / 생성 버튼 영역 */}
                <div style={{ display: "flex", gap: "12px", marginTop: "3rem" }}>
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        style={{ 
                            flex: 1, 
                            padding: "14px", 
                            cursor: "pointer", 
                            background: "#f1f5f9", 
                            color: "#475569", 
                            border: "none", 
                            borderRadius: "12px", 
                            fontWeight: "600" 
                        }}
                    >
                        취소
                    </button>
                    <button 
                        type="button" 
                        onClick={handleCreate}
                        style={{ 
                            flex: 2, 
                            padding: "14px", 
                            cursor: "pointer", 
                            background: "#21f0a8",
                            border: "none", 
                            borderRadius: "12px", 
                        }}
                    >
                        프로젝트 생성하기
                    </button>
                </div>
            </div>
        </div>
    );
}