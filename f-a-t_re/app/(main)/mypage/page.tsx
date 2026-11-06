'use client';

import React, { useState } from 'react';
import './MyPage.css';

interface Feedback {
  id: number;
  authorName: string;
  authorInitial: string;
  rating: number;
  comment: string;
  projectTitle: string;
}

const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 1,
    authorName: '김태오',
    authorInitial: '태',
    rating: 5.0,
    comment: 'UI 감각이 뛰어나고 마감을 항상 지켰어요. 다음에도 같이 하고 싶어요.',
    projectTitle: '교내 동아리 소개 랜딩',
  },
  {
    id: 2,
    authorName: '서지안',
    authorInitial: '지',
    rating: 4.5,
    comment: '소통이 정확하고 코드 리뷰를 꼼꼼히 해줬어요.',
    projectTitle: '교내 일정 알리미 봇',
  },
  {
    id: 3,
    authorName: '이도현',
    authorInitial: '현',
    rating: 5.0,
    comment: '문제를 빠르게 파악하고 팀 분위기를 잘 이끌었어요.',
    projectTitle: '교내 동아리 소개 랜딩',
  },
];

const ALL_MAJORS = [
  'FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'
];

export default function MyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState('Flutter랑 디자인을 좋아하는 FE 개발자예요. 완성도 높은 앱을 함께 만들어가요.');
  const [gender, setGender] = useState('남');
  const [selectedMajors, setSelectedMajors] = useState<string[]>(['FE']);
  const [techInput, setTechInput] = useState('');
  const [techStacks, setTechStacks] = useState<string[]>(['Flutter', 'Spring Boot', 'Django']);

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

  return (
    <div className="Mypage-container">
      {/* 프로필 카드 */}
      <div className="Mypage-profileCard">
        <div className="Mypage-profileHeader">
          <div className="Mypage-avatarGroup">
            <div className="Mypage-avatar">현</div>
            <div className="Mypage-userInfo">
              <div className="Mypage-nameRow">
                <span className="Mypage-userName">hwjeong</span>
                <span className="Mypage-genderBadge">{gender}</span>
              </div>
              <p className="Mypage-userSubText">1107 · 정현무</p>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {selectedMajors.map((m) => (
                  <span key={m} className="Mypage-roleBadge">{m}</span>
                ))}
              </div>
            </div>
          </div>
          {isEditing ? (
            <button className="Mypage-completeButton" onClick={() => setIsEditing(false)}>
              완료
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
          <span className="Mypage-statNumber">1</span>
          <span className="Mypage-statLabel">진행중</span>
        </div>
        <div className="Mypage-statDivider" />
        <div className="Mypage-statItem">
          <span className="Mypage-statNumber">2</span>
          <span className="Mypage-statLabel">완료</span>
        </div>
      </div>

      {/* 받은 피드백 요약 카드 */}
      <div className="Mypage-feedbackSummaryCard" onClick={() => setIsModalOpen(true)}>
        <div className="Mypage-feedbackSummaryHeader">
          <div className="Mypage-feedbackTitleGroup">
            <span className="Mypage-feedbackTitle">받은 피드백 보기</span>
            <span className="Mypage-ratingText">★ 4.8</span>
          </div>
          <span className="Mypage-arrowIcon">&gt;</span>
        </div>
        <p className="Mypage-feedbackSubText">완료 프로젝트에서 12개</p>
      </div>

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
              <span className="Mypage-modalRatingBig">4.8</span>
              <span className="Mypage-modalRatingSub">함께한 팀원 12명 평가</span>
            </div>

            <div className="Mypage-feedbackList">
              {MOCK_FEEDBACKS.map((item) => (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}