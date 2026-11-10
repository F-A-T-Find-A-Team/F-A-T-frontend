'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, chatApi, projectsApi, usersApi, type ProjectDetail, type ProjectSummary, type UserProfile } from '@/app/lib/api';


interface Project {
  id: number;
  title: string;
  dDay: string;
  pmName: string;
  pmInitial: string;
  tags: string[];
  status: string;
  statusType: 'progress' | 'idea' | 'done';
  recruitment: string;
  description: string;
  requiredMajors: string[];
  techStack: string[];
  currentMembers: string[];
  views: number;
  step: number;
  canApply: boolean;
  canChat: boolean;
  members: Array<{ userId: number; nickname: string; role: 'PM' | 'MEMBER' }>;
}

function toProject(project: ProjectSummary, detail?: ProjectDetail, members = detail?.members): Project {
  const remainingDays = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000);
  const stageLabel = project.stage === 'IDEA' ? '아이디어' : project.stage === 'COMPLETED' ? '완성' : '진행중';
  return {
    id: project.id,
    title: project.title,
    dDay: remainingDays >= 0 ? `D-${remainingDays}` : `D+${Math.abs(remainingDays)}`,
    pmName: project.pm?.nickname ?? '프로젝트 팀',
    pmInitial: (project.pm?.nickname ?? 'PM').slice(0, 1),
    tags: [...project.requiredMajors, ...project.techStacks],
    status: stageLabel,
    statusType: project.stage === 'IDEA' ? 'idea' : project.stage === 'COMPLETED' ? 'done' : 'progress',
    recruitment: `모집 ${project.memberCount}/${project.capacity}`,
    description: detail?.description ?? project.summary ?? '',
    requiredMajors: project.requiredMajors,
    techStack: project.techStacks,
    currentMembers: members?.map((member) => member.nickname.slice(0, 1)) ?? [],
    members: members ?? [],
    views: project.viewCount ?? 0,
    step: project.stage === 'IDEA' ? 1 : project.stage === 'COMPLETED' ? 3 : 2,
    canApply: detail?.myRelation.canApply ?? project.recruitmentStatus === 'OPEN',
    canChat: detail ? !detail.myRelation.isPm : true,
  };
}

export default function Search() {
  const router = useRouter();
  const [currentType, setCurrentType] = useState("전체");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyReason, setApplyReason] = useState("");
  const [selectedPosition, setSelectedPosition] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [publicProfile, setPublicProfile] = useState<{ nickname: string; bio: string; majors: string[]; techStacks: string[] } | null>(null);

  const type = [
    { name: "전체" },
    { name: "모집중" },
    { name: "내 전공" },
    { name: "관심 스택" }
  ];

  useEffect(() => {
    let cancelled = false;
    usersApi.me().then((user) => { if (!cancelled) setProfile(user); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    projectsApi.search({
      query: searchQuery.trim() || undefined,
      recruitmentStatus: currentType === '모집중' ? 'OPEN' : undefined,
      major: currentType === '내 전공' ? profile?.majors[0] : undefined,
      techStack: currentType === '관심 스택' ? profile?.techStacks[0] : undefined,
      page: 0,
      size: 20,
    }).then((result) => {
      if (!cancelled) setProjects(result.items.map((project) => toProject(project)));
    }).catch((err) => {
      if (!cancelled) setError(err instanceof ApiError ? err.message : '프로젝트 목록을 불러오지 못했습니다.');
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [currentType, profile, searchQuery]);

  const openProject = async (project: Project) => {
    setIsDetailLoading(true);
    setError('');
    try {
      const [detail, memberResult] = await Promise.all([
        projectsApi.detail(project.id),
        projectsApi.members(project.id),
      ]);
      const fullProject = toProject(detail, detail, memberResult.items);
      setSelectedProject(fullProject);
      setSelectedPosition(detail.requiredMajors[0] ?? profile?.majors[0] ?? '');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로젝트 상세를 불러오지 못했습니다.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    const projectId = Number(new URLSearchParams(window.location.search).get('project'));
    if (!Number.isSafeInteger(projectId) || projectId < 1) return;
    let cancelled = false;
    Promise.all([projectsApi.detail(projectId), projectsApi.members(projectId)]).then(([detail, memberResult]) => {
      if (cancelled) return;
      setSelectedProject(toProject(detail, detail, memberResult.items));
      setSelectedPosition(detail.requiredMajors[0] ?? '');
    }).catch((err) => {
      if (!cancelled) setError(err instanceof ApiError ? err.message : '프로젝트 상세를 불러오지 못했습니다.');
    }).finally(() => { if (!cancelled) setIsDetailLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const openPublicProfile = async (userId: number) => {
    try {
      const result = await usersApi.publicProfile(userId);
      setPublicProfile(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '사용자 프로필을 불러오지 못했습니다.');
    }
  };

  const handleApplySubmit = async () => {
    if (!selectedProject || !selectedPosition || !applyReason.trim() || isApplying) return;
    setIsApplying(true);
    setError('');
    try {
      await projectsApi.apply(selectedProject.id, selectedPosition, applyReason.trim());
      alert('지원서가 제출되었습니다!');
      setIsApplyModalOpen(false);
      setApplyReason('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '지원서를 제출하지 못했습니다.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleStartChat = async () => {
    if (!selectedProject) return;
    setError('');
    try {
      const room = await chatApi.startDirect(selectedProject.id);
      router.push(`/chat?roomId=${room.roomId}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'PM 채팅방을 열 수 없습니다.');
    }
  };

  // 상세 보기 화면일 때
  if (selectedProject) {
    return (
      <div className="Search-detailContainer">
        <button className="Search-backLink" onClick={() => { setSelectedProject(null); setError(''); }}>
          &lt; 탐색으로
        </button>

        <div className="Search-detailHeader">
          <h2 className="Search-detailTitle">{selectedProject.title}</h2>
          {error && <p role="alert" className="Search-error">{error}</p>}
          <div className="Search-detailPmRow">
            <div className="Search-detailPmAvatar">{selectedProject.pmInitial}</div>
            <span className="Search-detailPmName">{selectedProject.pmName}</span>
            <span className="Search-detailPmBadge">PM</span>
          </div>
        </div>

        <div className="Search-detailContentLayout">
          {/* 좌측 상세 정보 영역 */}
          <div className="Search-detailLeft">
            <div className="Search-stepCard">
              <h4 className="Search-stepTitle">진행 단계</h4>
              <div className="Search-stepTracker">
                <div className="Search-stepItem">
                  <div className={`Search-stepCircle ${selectedProject.step >= 1 ? 'active' : ''}`}>1</div>
                  <span className={`Search-stepLabel ${selectedProject.step >= 1 ? 'active' : ''}`}>아이디어</span>
                </div>
                <div className="Search-stepItem">
                  <div className={`Search-stepCircle ${selectedProject.step >= 2 ? 'active' : ''}`}>2</div>
                  <span className={`Search-stepLabel ${selectedProject.step >= 2 ? 'active' : ''}`}>진행중</span>
                </div>
                <div className="Search-stepItem">
                  <div className={`Search-stepCircle ${selectedProject.step >= 3 ? 'active' : ''}`}>3</div>
                  <span className={`Search-stepLabel ${selectedProject.step >= 3 ? 'active' : ''}`}>완성</span>
                </div>
              </div>
              <p className="Search-stepDesc">PM이 진행 단계를 업데이트해요.</p>
            </div>

            <div className="Search-infoSection">
              <h4 className="Search-infoHeading">상세 내용</h4>
              <p className="Search-infoDesc">{selectedProject.description || '등록된 상세 설명이 없습니다.'}</p>
            </div>

            <div className="Search-infoSection">
              <h4 className="Search-infoHeading">필요 전공</h4>
              <div className="Search-detailTagsList">
                {selectedProject.requiredMajors.map((m, i) => (
                  <span key={i} className="Search-detailTag">{m}</span>
                ))}
              </div>
            </div>

            <div className="Search-infoSection">
              <h4 className="Search-infoHeading">기술 스택</h4>
              <div className="Search-detailTagsList">
                {selectedProject.techStack.map((t, i) => (
                  <span key={i} className="Search-detailTag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 사이드 스탯 및 지원 박스 */}
          <div className="Search-detailRight">
            <div className="Search-sideStatsRow">
              <div className="Search-sideStatItem">
                <span className="Search-sideStatValue green">{selectedProject.dDay}</span>
                <span className="Search-sideStatLabel">마감</span>
              </div>
              <div className="Search-sideStatItem">
                <span className="Search-sideStatValue">{selectedProject.recruitment.replace('모집 ', '')}</span>
                <span className="Search-sideStatLabel">모집</span>
              </div>
              <div className="Search-sideStatItem">
                <span className="Search-sideStatValue">{selectedProject.views}</span>
                <span className="Search-sideStatLabel">조회</span>
              </div>
            </div>

            <div className="Search-teamSection">
              <span className="Search-sideStatLabel">현재 팀원</span>
              <div className="Search-teamAvatarsRow">
                {selectedProject.members.map((member) => (
                  <button key={member.userId} type="button" className="Search-teamMemberAvatar" title={`${member.nickname} 공개 프로필`} onClick={() => openPublicProfile(member.userId)}>
                    {member.nickname.slice(0, 1)}
                  </button>
                ))}
                {Array.from({ length: Math.max(0, Number(selectedProject.recruitment.split('/')[1]) - selectedProject.currentMembers.length) }, (_, index) => (
                  <div key={`empty-${index}`} className="Search-teamMemberAvatar empty">+</div>
                ))}
              </div>
            </div>

            <button className="Search-applyBtn" disabled={!selectedProject.canApply} onClick={() => setIsApplyModalOpen(true)}>
              지원하기
            </button>
            <button className="Search-inquiryBtn" disabled={!selectedProject.canChat} onClick={handleStartChat}>
              PM에게 문의하기
            </button>
          </div>
        </div>

        {/* 프로젝트 지원하기 모달 팝업 */}
        {isApplyModalOpen && (
          <div className="Search-modalOverlay" onClick={() => setIsApplyModalOpen(false)}>
            <div className="Search-modalContent" onClick={(e) => e.stopPropagation()}>
              <button className="Search-modalCloseBtn" onClick={() => setIsApplyModalOpen(false)}>
                ✕
              </button>

              <h3 className="Search-modalTitle">프로젝트 지원하기</h3>
              <p className="Search-modalSubTitle">{selectedProject.title} · {selectedProject.pmName} PM</p>

              <div className="Search-modalFormGroup">
                <label className="Search-modalLabel">지원 포지션</label>
                <div className="Search-positionBox">
                  <select value={selectedPosition} onChange={(event) => setSelectedPosition(event.target.value)}>
                    {selectedProject.requiredMajors.map((major) => <option key={major} value={major}>{major}</option>)}
                  </select>
                  <span className="Search-recruitingBadge">모집 중</span>
                </div>
              </div>

              <div className="Search-modalFormGroup">
                <label className="Search-modalLabel">짧은 지원 사유</label>
                <textarea
                  className="Search-modalTextArea"
                  placeholder="예: Flutter로 사내 앱을 2개 만들어 봤어요. UI 설계도 가능해요."
                  value={applyReason}
                  onChange={(e) => setApplyReason(e.target.value)}
                />
              </div>

              <div className="Search-modalNoticeBox">
                <span>ℹ️</span>
                <span>수락되면 팀 채팅방에 자동으로 초대돼요</span>
              </div>

              <button className="Search-modalSubmitBtn" disabled={isApplying || !applyReason.trim()} onClick={handleApplySubmit}>
                {isApplying ? '제출 중...' : '지원 신청하기'}
              </button>
            </div>
          </div>
        )}

        {publicProfile && (
          <div className="Search-modalOverlay" onClick={() => setPublicProfile(null)}>
            <div className="Search-modalContent" onClick={(event) => event.stopPropagation()}>
              <button className="Search-modalCloseBtn" onClick={() => setPublicProfile(null)}>✕</button>
              <h3 className="Search-modalTitle">{publicProfile.nickname}</h3>
              <p>{publicProfile.bio}</p>
              <h4>전공</h4>
              <p>{publicProfile.majors.join(' · ') || '등록된 전공 없음'}</p>
              <h4>기술 스택</h4>
              <p>{publicProfile.techStacks.join(' · ') || '등록된 기술 스택 없음'}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 목록 화면일 때
  return (
    <div className='Search-container'>
      <div className='Search-top'>
        <div>
          <h2>프로젝트 탐색</h2>
          <span>내 전공·관심 스택에 맞는 팀을 찾아보세요</span>
        </div>

        <div className='Search-topRightButtons'>
          <Link href='/pjcreate'>+ 새 프로젝트</Link>
        </div>
      </div>

      <label className="Search-queryInput">
        <span className="sr-only">프로젝트 검색</span>
        <input value={searchQuery} onChange={(event) => { setError(''); setSearchQuery(event.target.value); }} placeholder="프로젝트 이름으로 검색" />
      </label>

      <div className='Search-typeBox'>
        {type.map((item) => (
          <div
            className={currentType === item.name ? "active Search-type" : "Search-type"}
            role="button"
            tabIndex={0}
            onClick={() => { setError(''); setCurrentType(item.name); }}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { setError(''); setCurrentType(item.name); } }}
            key={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* 프로젝트 카드 그리드 */}
      {error && <p role="alert" className="Search-error">{error}</p>}
      {isLoading && <p className="Search-empty">프로젝트를 불러오는 중...</p>}
      <div className="Search-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="Search-card"
            onClick={() => openProject(project)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="Search-cardTop">
                <h3 className="Search-cardTitle">{project.title}</h3>
                <span className="Search-dDayBadge">{project.dDay}</span>
              </div>

              <div className="Search-pmRow">
                <div className="Search-pmAvatar">{project.pmInitial}</div>
                <span className="Search-pmName">{project.pmName}</span>
                <span className="Search-pmRoleBadge">PM</span>
              </div>

              <div className="Search-tagsList">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="Search-techTag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="Search-cardFooter">
              <div className="Search-statusGroup">
                <span className={`Search-statusDot ${project.statusType}`} />
                <span>{project.status}</span>
              </div>
              <span className="Search-recruitmentCount">{project.recruitment}</span>
            </div>
          </div>
        ))}
      </div>
      {!isLoading && projects.length === 0 && !error && <p className="Search-empty">조건에 맞는 프로젝트가 없습니다.</p>}
      {isDetailLoading && <div className="Search-modalOverlay"><p>상세 정보를 불러오는 중...</p></div>}
    </div>
  );
}