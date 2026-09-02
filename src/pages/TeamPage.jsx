import { useState } from 'react'

function TeamRPage() {
  // 예시 데이터 (실제로는 AI 서버에서 받아와야 함)
  const recommendations = [
    {
      id: 1,
      name: '김민준',
      major: 'BE',
      status: '참여 가능',
      skills: ['Spring Boot', 'MySQL', 'JPA'],
      matchRate: 94,
      avatar: '민' // 실제 이미지가 없을 경우 표시할 텍스트
    },
    {
      id: 2,
      name: '이수아',
      major: 'UI/UX',
      status: '참여 가능',
      skills: ['Figma', 'Flutter', 'Framer'],
      matchRate: 89,
      avatar: '수'
    },
    {
      id: 3,
      name: '박재원',
      major: 'FE',
      status: '', // 상태 배지 없음
      skills: ['Flutter', 'Dart', 'Riverpod'],
      matchRate: 85,
      avatar: '재'
    },
    {
      id: 4,
      name: '한예진',
      major: 'BE',
      status: '참여 가능',
      skills: ['Spring Boot', 'Redis', 'Docker'],
      matchRate: 81,
      avatar: '예'
    },
  ];

  return (
    <div className="tr-container">
      <div className="tr-header">
        <h2>
          AI 팀원 추천
          <span className="tr-beta-badge">BETA</span>
        </h2>
        <p>계획서를 분석해 GitHub 기술 스택이 맞고, 현재 참여 프로젝트가 없는 학생을 추천했어요</p>
      </div>

      <div className="tr-list">
        {recommendations.map((item) => (
          <div key={item.id} className="tr-card">
            <div className="tr-card-left">
              <div className="tr-avatar">{item.avatar}</div>
              <div className="tr-info-text">
                <div className="tr-name-row">
                  <h3>{item.name}</h3>
                  <span className="tr-major-badge">{item.major}</span>
                  {item.status && <span className="tr-status-badge">{item.status}</span>}
                </div>
                <div className="tr-skill-tags">
                  {item.skills.map((skill) => (
                    <span key={skill} className="tr-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="tr-card-right">
              <div className="tr-match-rate">
                <p className="tr-match-percent">{item.matchRate}%</p>
                <p className="tr-match-label">일치도</p>
              </div>
              <button className="tr-action-btn">제안 보내기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamRPage;