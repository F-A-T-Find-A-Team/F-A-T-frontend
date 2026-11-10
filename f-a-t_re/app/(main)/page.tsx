'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError, projectsApi, type ProjectSummary } from '@/app/lib/api';
import './HomePage.css';

export default function Home() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    projectsApi.recommended(5).then((result) => {
      if (!cancelled) setProjects(result.items);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof ApiError ? err.message : '추천 프로젝트를 불러오지 못했습니다.');
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="HomePage-container">
      <header className="HomePage-header">
        <div>
          <p>F.A.T. / PROJECTS</p>
          <h2>추천 프로젝트</h2>
        </div>
        <Link href="/search">전체 탐색</Link>
      </header>
      {error && <p role="alert" className="HomePage-error">{error}</p>}
      <div className="HomePage-list">
        {projects.map((project) => (
          <Link className="HomePage-item" href={`/search?project=${project.id}`} key={project.id}>
            <div>
              <span className="HomePage-stage">{project.stage === 'IDEA' ? '아이디어' : project.stage === 'COMPLETED' ? '완성' : '진행중'}</span>
              <h3>{project.title}</h3>
              <p>{project.summary ?? project.requiredMajors.join(' · ')}</p>
            </div>
            <div className="HomePage-tags">
              {[...project.requiredMajors, ...project.techStacks].map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <span className="HomePage-members">{project.memberCount}/{project.capacity}명</span>
          </Link>
        ))}
        {!error && projects.length === 0 && <p className="HomePage-empty">추천 프로젝트를 불러오는 중입니다.</p>}
      </div>
    </section>
  );
}