'use client';

import React, { useEffect, useState } from 'react';
import './MyPage.css';
import { ApiError, applicationsApi, integrationsApi, projectsApi, usersApi, type UserProfile } from '@/app/lib/api';

interface Feedback {
  id: number;
  authorName: string;
  authorInitial: string;
  rating: number;
  comment: string;
  projectTitle: string;
}

const ALL_MAJORS = [
  'FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'
];

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('남');
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [projects, setProjects] = useState<Array<{ id: number; title: string; stage: string; role: string; memberCount: number; capacity: number }>>([]);
  const [applications, setApplications] = useState<Array<{ id: number; project: { id: number; title: string }; position: string; status: string; createdAt: string }>>([]);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [github, setGithub] = useState<{ connected: boolean; username?: string; repositoryCount?: number } | null>(null);
  const [applicants, setApplicants] = useState<Array<{ id: number; applicant: { id: number; nickname: string; majors?: string[] }; position: string; reason: string; status: string }>>([]);
  const [applicantProjectId, setApplicantProjectId] = useState<number | null>(null);
  const [feedbackProjectId, setFeedbackProjectId] = useState<number | null>(null);
  const [pendingReviewIds, setPendingReviewIds] = useState<number[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<Record<number, { rating: number; comment: string }>>({});
  const [editingProject, setEditingProject] = useState<{ id: number; description: string; deadline: string; capacity: number } | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    usersApi.me().then((result) => {
      if (cancelled) return;
      setProfile(result);
      setNickname(result.nickname);
      setName(result.name);
      setStudentId(result.studentId);
      setBio(result.bio);
      setGender(result.gender === 'MALE' ? '남' : result.gender === 'FEMALE' ? '여' : '기타');
      setSelectedMajors(result.majors);
      setTechStacks(result.techStacks);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof ApiError ? err.message : '프로필을 불러오지 못했습니다.');
    });
    usersApi.projects({ page: 0, size: 20 }).then((result) => { if (!cancelled) setProjects(result.items); }).catch(() => undefined);
    usersApi.applications({ page: 0, size: 20 }).then((result) => { if (!cancelled) setApplications(result.items); }).catch(() => undefined);
    usersApi.feedback({ page: 0, size: 20 }).then((result) => {
      if (cancelled) return;
      setFeedbackRating(result.averageRating);
      setFeedbackCount(result.totalReviews);
      setFeedbacks(result.items.map((item) => ({
        id: item.id,
        authorName: item.reviewer.nickname,
        authorInitial: item.reviewer.nickname.slice(0, 1),
        rating: item.rating,
        comment: item.comment,
        projectTitle: item.project.title,
      })));
    }).catch(() => undefined);
    integrationsApi.github().then((result) => { if (!cancelled) setGithub(result); }).catch(() => undefined);
    const oauthParams = new URLSearchParams(window.location.search);
    const oauthCode = oauthParams.get('code');
    if (oauthCode) {
      const returnedState = oauthParams.get('state');
      const expectedState = window.sessionStorage.getItem('githubOAuthState');
      window.sessionStorage.removeItem('githubOAuthState');
      window.history.replaceState(null, '', window.location.pathname);
      if (!expectedState || returnedState !== expectedState) {
        Promise.resolve().then(() => { if (!cancelled) setError('GitHub 인증 상태를 확인할 수 없습니다. 다시 시도해주세요.'); });
      } else {
        integrationsApi.connectGithub(oauthCode).then(() => integrationsApi.github()).then((result) => {
          if (!cancelled) setGithub(result);
        }).catch((err) => {
          if (!cancelled) setError(err instanceof ApiError ? err.message : 'GitHub 계정을 연결하지 못했습니다.');
        });
      }
    }
    return () => { cancelled = true; };
  }, []);

  const toggleMajor = (major: string) => {
    if (selectedMajors.includes(major)) {
      setSelectedMajors(selectedMajors.filter((m) => m !== major));
    } else {
      setSelectedMajors([...selectedMajors, major]);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techStacks.includes(techInput.trim())) {
      setTechStacks([...techStacks, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechStacks(techStacks.filter((t) => t !== techToRemove));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setError('');
    try {
      const updated = await usersApi.updateMe({
        nickname,
        gender: gender === '남' ? 'MALE' : gender === '여' ? 'FEMALE' : 'OTHER',
        bio,
        majors: selectedMajors,
        techStacks,
      });
      setProfile((current) => current ? { ...current, ...updated } : current);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로필을 저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelApplication = async (applicationId: number) => {
    try {
      await applicationsApi.cancel(applicationId);
      setApplications((current) => current.filter((application) => application.id !== applicationId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '지원을 취소하지 못했습니다.');
    }
  };

  const openApplicants = async (projectId: number) => {
    setError('');
    try {
      const result = await projectsApi.applicants(projectId, { page: 0, size: 20 });
      setApplicants(result.items);
      setApplicantProjectId(projectId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '지원자 목록을 불러오지 못했습니다.');
    }
  };

  const reviewApplicant = async (applicationId: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await applicationsApi.review(applicationId, status);
      setApplicants((current) => current.map((item) => item.id === applicationId ? { ...item, status } : item));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '지원서를 처리하지 못했습니다.');
    }
  };

  const changeStage = async (projectId: number, stage: 'IN_PROGRESS' | 'COMPLETED') => {
    try {
      await projectsApi.changeStage(projectId, stage);
      setProjects((current) => current.map((project) => project.id === projectId ? { ...project, stage } : project));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로젝트 단계를 변경하지 못했습니다.');
    }
  };

  const openFeedbackForm = async (projectId: number) => {
    setError('');
    try {
      const result = await projectsApi.feedbackStatus(projectId);
      setPendingReviewIds(result.pendingUserIds);
      setReviewDrafts(Object.fromEntries(result.pendingUserIds.map((id) => [id, { rating: 5, comment: '' }])));
      setFeedbackProjectId(projectId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '피드백 상태를 불러오지 못했습니다.');
    }
  };

  const submitProjectFeedback = async () => {
    if (feedbackProjectId === null || pendingReviewIds.some((id) => !reviewDrafts[id]?.comment.trim())) return;
    try {
      await projectsApi.submitFeedback(feedbackProjectId, pendingReviewIds.map((revieweeId) => ({
        revieweeId,
        rating: reviewDrafts[revieweeId].rating,
        comment: reviewDrafts[revieweeId].comment.trim(),
      })));
      setFeedbackProjectId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '피드백을 제출하지 못했습니다.');
    }
  };

  const disconnectGithub = async () => {
    try {
      await integrationsApi.disconnectGithub();
      setGithub({ connected: false });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'GitHub 연결을 해제하지 못했습니다.');
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const result = await usersApi.uploadAvatar(file);
      setProfile((current) => current ? { ...current, avatarUrl: result.avatarUrl } : current);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로필 사진을 등록하지 못했습니다.');
    } finally {
      event.target.value = '';
    }
  };

  const startProjectEdit = async (projectId: number) => {
    try {
      const result = await projectsApi.detail(projectId);
      setEditingProject({ id: projectId, description: result.description, deadline: result.deadline, capacity: result.capacity });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로젝트 정보를 불러오지 못했습니다.');
    }
  };

  const saveProjectEdit = async () => {
    if (!editingProject) return;
    try {
      await projectsApi.update(editingProject.id, {
        description: editingProject.description,
        deadline: editingProject.deadline,
        capacity: editingProject.capacity,
      });
      setProjects((current) => current.map((project) => project.id === editingProject.id ? { ...project, capacity: editingProject.capacity } : project));
      setEditingProject(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '프로젝트를 수정하지 못했습니다.');
    }
  };

  const connectGithub = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      setError('GitHub OAuth를 사용하려면 NEXT_PUBLIC_GITHUB_CLIENT_ID를 설정해주세요.');
      return;
    }
    const state = crypto.randomUUID();
    window.sessionStorage.setItem('githubOAuthState', state);
    const redirectUri = `${window.location.origin}/mypage`;
    const query = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, scope: 'read:user repo', state });
    window.location.assign(`https://github.com/login/oauth/authorize?${query}`);
  };

  return (
    <div className="Mypage-container">
      {error && <p role="alert" className="Mypage-error">{error}</p>}
      {/* 프로필 카드 */}
      <div className="Mypage-profileCard">
        <div className="Mypage-profileHeader">
          <div className="Mypage-avatarGroup">
            <div className="Mypage-avatar" style={profile?.avatarUrl ? { backgroundImage: `url(${profile.avatarUrl})`, backgroundSize: 'cover' } : undefined}>
              {!profile?.avatarUrl && nickname.slice(0, 1)}
            </div>
            <label className="Mypage-avatarUpload">
              사진 변경
              <input type="file" accept="image/*" onChange={uploadAvatar} />
            </label>
            <div className="Mypage-userInfo">
              <div className="Mypage-nameRow">
                <span className="Mypage-userName">{nickname || '프로필 불러오는 중'}</span>
                <span className="Mypage-genderBadge">{gender}</span>
              </div>
              <p className="Mypage-userSubText">{studentId} · {name}</p>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {selectedMajors.map((m) => (
                  <span key={m} className="Mypage-roleBadge">{m}</span>
                ))}
              </div>
            </div>
          </div>
          {isEditing ? (
            <button className="Mypage-completeButton" onClick={saveProfile} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </button>
          ) : (
            <button className="Mypage-editButton" onClick={() => setIsEditing(true)}>
              프로필 수정
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="Mypage-editFormCard">
          <div className="Mypage-formSection">
            <span className="Mypage-formLabelRow">닉네임</span>
            <input type="text" className="Mypage-bioInput" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={30} />
          </div>
          <div className="Mypage-formSection">
            <div className="Mypage-formLabelRow">
              <span>한 줄 소개</span>
              <span className="Mypage-textCount">{bio.length}/100</span>
            </div>
            <input
              type="text"
              className="Mypage-bioInput"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={100}
              placeholder="자기소개를 입력하세요 (100자)"
            />
          </div>

          <div className="Mypage-formSection">
            <span className="Mypage-formLabelRow">성별</span>
            <div className="Mypage-genderGroup">
              {['남', '여', '기타'].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`Mypage-genderOptionButton ${gender === g ? 'Mypage-active' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="Mypage-formSection">
            <span className="Mypage-formLabelRow">전공 · 복수 선택 가능</span>
            <div className="Mypage-majorGrid">
              {ALL_MAJORS.map((major) => {
                const isSelected = selectedMajors.includes(major);
                return (
                  <button
                    key={major}
                    type="button"
                    className={`Mypage-tagButton ${isSelected ? 'Mypage-active' : ''}`}
                    onClick={() => toggleMajor(major)}
                  >
                    {major}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="Mypage-formSection">
            <span className="Mypage-formLabelRow">관심 기술 스택 · 자유 입력</span>
            <div className="Mypage-techInputRow">
              <input
                type="text"
                className="Mypage-techInput"
                placeholder="기술을 입력하고 Enter (예: Next.js)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
              />
              <button type="button" className="Mypage-addButton" onClick={handleAddTech}>
                추가
              </button>
            </div>
            <div className="Mypage-techTagsList">
              {techStacks.map((tech) => (
                <div key={tech} className="Mypage-techChip">
                  <span>{tech}</span>
                  <button
                    type="button"
                    className="Mypage-chipDelete"
                    onClick={() => removeTech(tech)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="Mypage-bioText">{bio}</p>
      )}

      {/* 프로젝트 통계 */}
      <div className="Mypage-statsCard">
        <div className="Mypage-statItem">
          <span className="Mypage-statNumber">{profile?.projectStats.inProgress ?? 0}</span>
          <span className="Mypage-statLabel">진행중</span>
        </div>
        <div className="Mypage-statDivider" />
        <div className="Mypage-statItem">
          <span className="Mypage-statNumber">{profile?.projectStats.completed ?? 0}</span>
          <span className="Mypage-statLabel">완료</span>
        </div>
      </div>

      {/* 받은 피드백 요약 카드 */}
      <div className="Mypage-feedbackSummaryCard" onClick={() => setIsModalOpen(true)}>
        <div className="Mypage-feedbackSummaryHeader">
          <div className="Mypage-feedbackTitleGroup">
            <span className="Mypage-feedbackTitle">받은 피드백 보기</span>
            <span className="Mypage-ratingText">★ {feedbackRating.toFixed(1)}</span>
          </div>
          <span className="Mypage-arrowIcon">&gt;</span>
        </div>
        <p className="Mypage-feedbackSubText">완료 프로젝트에서 {feedbackCount}개</p>
      </div>

      <section className="Mypage-dataSection">
        <h2>내 프로젝트</h2>
        {projects.map((project) => (
          <div className="Mypage-dataRow" key={project.id}>
            <div>
              <strong>{project.title}</strong>
              <span>{project.role} · {project.memberCount}/{project.capacity}명 · {project.stage}</span>
            </div>
            {project.role === 'PM' && (
              <div className="Mypage-rowActions">
                <button type="button" onClick={() => startProjectEdit(project.id)}>내용 수정</button>
                <button type="button" onClick={() => openApplicants(project.id)}>지원자</button>
                {project.stage === 'IDEA' && <button type="button" onClick={() => changeStage(project.id, 'IN_PROGRESS')}>진행 시작</button>}
                {project.stage === 'IN_PROGRESS' && <button type="button" onClick={() => changeStage(project.id, 'COMPLETED')}>완료 처리</button>}
                {project.stage === 'COMPLETED' && <button type="button" onClick={() => openFeedbackForm(project.id)}>팀원 평가</button>}
              </div>
            )}
            {editingProject?.id === project.id && (
              <div className="Mypage-projectEditor">
                <label>상세 내용<textarea value={editingProject.description} onChange={(event) => setEditingProject({ ...editingProject, description: event.target.value })} /></label>
                <label>마감일<input type="date" value={editingProject.deadline} onChange={(event) => setEditingProject({ ...editingProject, deadline: event.target.value })} /></label>
                <label>정원<input type="number" min={project.memberCount} max={12} value={editingProject.capacity} onChange={(event) => setEditingProject({ ...editingProject, capacity: Number(event.target.value) })} /></label>
                <div className="Mypage-rowActions"><button type="button" onClick={saveProjectEdit}>저장</button><button type="button" onClick={() => setEditingProject(null)}>취소</button></div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && <p>참여 중인 프로젝트가 없습니다.</p>}
      </section>

      <section className="Mypage-dataSection">
        <h2>내 지원 현황</h2>
        {applications.map((application) => (
          <div className="Mypage-dataRow" key={application.id}>
            <div>
              <strong>{application.project.title}</strong>
              <span>{application.position} · {application.status}</span>
            </div>
            {application.status === 'PENDING' && <button type="button" onClick={() => cancelApplication(application.id)}>지원 취소</button>}
          </div>
        ))}
        {applications.length === 0 && <p>지원 내역이 없습니다.</p>}
      </section>

      <section className="Mypage-dataSection">
        <h2>GitHub</h2>
        <div className="Mypage-dataRow">
          <span>{github?.connected ? `${github.username ?? '연결됨'} · 저장소 ${github.repositoryCount ?? 0}개` : '연결되지 않음'}</span>
          {github?.connected ? <button type="button" onClick={disconnectGithub}>연결 해제</button> : <button type="button" onClick={connectGithub}>GitHub 연결</button>}
        </div>
      </section>

      {/* 피드백 모달 */}
      {isModalOpen && (
        <div className="Mypage-modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="Mypage-modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="Mypage-closeButton" onClick={() => setIsModalOpen(false)}>
              ✕
            </button>

            <h2 className="Mypage-modalTitle">받은 피드백</h2>
            <div className="Mypage-modalRatingRow">
              <span className="Mypage-modalRatingBig">{feedbackRating.toFixed(1)}</span>
              <span className="Mypage-modalRatingSub">함께한 팀원 {feedbackCount}명 평가</span>
            </div>

            <div className="Mypage-feedbackList">
              {feedbacks.map((item) => (
                <div key={item.id} className="Mypage-feedbackItemCard">
                  <div className="Mypage-itemHeader">
                    <div className="Mypage-itemAuthorInfo">
                      <div className="Mypage-itemAvatar">{item.authorInitial}</div>
                      <span className="Mypage-itemAuthorName">{item.authorName}</span>
                    </div>
                    <span className="Mypage-itemRating">★ {item.rating.toFixed(1)}</span>
                  </div>
                  <p className="Mypage-itemComment">{item.comment}</p>
                  <p className="Mypage-itemProjectTitle">{item.projectTitle}</p>
                </div>
              ))}
              {feedbacks.length === 0 && <p>받은 피드백이 없습니다.</p>}
            </div>
          </div>
        </div>
      )}

      {applicantProjectId !== null && (
        <div className="Mypage-modalOverlay" onClick={() => setApplicantProjectId(null)}>
          <div className="Mypage-modalContent" onClick={(event) => event.stopPropagation()}>
            <button className="Mypage-closeButton" onClick={() => setApplicantProjectId(null)}>✕</button>
            <h2 className="Mypage-modalTitle">프로젝트 지원자</h2>
            {applicants.map((application) => (
              <div className="Mypage-dataRow" key={application.id}>
                <div><strong>{application.applicant.nickname} · {application.position}</strong><span>{application.reason}</span></div>
                {application.status === 'PENDING' && <div className="Mypage-rowActions"><button onClick={() => reviewApplicant(application.id, 'ACCEPTED')}>수락</button><button onClick={() => reviewApplicant(application.id, 'REJECTED')}>거절</button></div>}
                {application.status !== 'PENDING' && <span>{application.status}</span>}
              </div>
            ))}
            {applicants.length === 0 && <p>지원자가 없습니다.</p>}
          </div>
        </div>
      )}

      {feedbackProjectId !== null && (
        <div className="Mypage-modalOverlay" onClick={() => setFeedbackProjectId(null)}>
          <div className="Mypage-modalContent" onClick={(event) => event.stopPropagation()}>
            <button className="Mypage-closeButton" onClick={() => setFeedbackProjectId(null)}>✕</button>
            <h2 className="Mypage-modalTitle">팀원 피드백</h2>
            {pendingReviewIds.map((userId) => (
              <div className="Mypage-formSection" key={userId}>
                <strong>팀원 ID {userId}</strong>
                <label>별점
                  <select value={reviewDrafts[userId]?.rating ?? 5} onChange={(event) => setReviewDrafts((current) => ({ ...current, [userId]: { ...current[userId], rating: Number(event.target.value) } }))}>
                    {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}점</option>)}
                  </select>
                </label>
                <textarea value={reviewDrafts[userId]?.comment ?? ''} onChange={(event) => setReviewDrafts((current) => ({ ...current, [userId]: { ...current[userId], comment: event.target.value } }))} placeholder="함께한 경험을 남겨주세요." />
              </div>
            ))}
            {pendingReviewIds.length === 0 && <p>평가할 팀원이 없습니다.</p>}
            {pendingReviewIds.length > 0 && <button className="Mypage-completeButton" onClick={submitProjectFeedback}>피드백 제출</button>}
          </div>
        </div>
      )}
    </div>
  );
}