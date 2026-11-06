'use client';
import Link from 'next/link';
import { useState } from 'react';

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
}

export default function Search() {
  const [currentType, setCurrentTpye] = useState("전체");

  const type = [
    { name: "전체" },
    { name: "모집중" },
    { name: "내 전공" },
    { name: "관심 스택" }
  ];

  // 이미지에 있던 카드 데이터 6개
  const projects: Project[] = [
    {
      id: 1,
      title: '교내 급식 예약 & 잔반 관리 앱',
      dDay: 'D-12',
      pmName: '김태오',
      pmInitial: '태',
      tags: ['FE', 'BE', 'UI/UX', 'Flutter', 'Spring Boot'],
      status: '진행중',
      statusType: 'progress',
      recruitment: '모집 3/5',
    },
    {
      id: 2,
      title: 'AI 회의록 자동 정리 서비스',
      dDay: 'D-4',
      pmName: '서지안',
      pmInitial: '서',
      tags: ['BE', 'AI', 'Django', 'OpenAI'],
      status: '아이디어',
      statusType: 'idea',
      recruitment: '모집 1/4',
    },
    {
      id: 3,
      title: '동아리 출결·활동 기록 웹',
      dDay: 'D-20',
      pmName: '이도현',
      pmInitial: '이',
      tags: ['FE', 'BE', 'React', 'Node'],
      status: '진행중',
      statusType: 'progress',
      recruitment: '모집 2/3',
    },
    {
      id: 4,
      title: '교내 분실물 지도 서비스',
      dDay: 'D-8',
      pmName: '박서윤',
      pmInitial: '박',
      tags: ['FE', 'UI/UX', 'Flutter', 'Firebase'],
      status: '아이디어',
      statusType: 'idea',
      recruitment: '모집 1/3',
    },
    {
      id: 5,
      title: '펌웨어 기반 스마트 사물함',
      dDay: 'D-30',
      pmName: '최준우',
      pmInitial: '최',
      tags: ['EM(FW)', 'EM(HW)', 'C', 'RTOS'],
      status: '진행중',
      statusType: 'progress',
      recruitment: '모집 3/4',
    },
    {
      id: 6,
      title: '보안 취약점 스캐너 CLI',
      dDay: 'D-15',
      pmName: '정하린',
      pmInitial: '정',
      tags: ['security', 'BE', 'Go', 'Docker'],
      status: '완성',
      statusType: 'done',
      recruitment: '모집 4/4',
    },
  ];

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
          <div
            className={currentType === item.name ? "active Search-type" : "Search-type"}
            onClick={() => {
              setCurrentTpye(item.name);
            }}
            key={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* 프로젝트 카드 3열 그리드 */}
      <div className="Search-grid">
        {projects.map((project) => (
          <div key={project.id} className="Search-card">
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
    </div>
  );
}