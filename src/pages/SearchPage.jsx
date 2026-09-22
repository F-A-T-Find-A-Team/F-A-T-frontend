import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom'


function SearchPage() {
  const { setLeftsideChose, pjList, setClickedPj, renderUserProfileImage, account } = useOutletContext()
  const navigate = useNavigate();
  const [currentSearch, setCurrentSearch] = useState("전체");

  const getDDay = (deadlineStr, isDone) => {
    if (isDone) return "마감됨";

    if (!deadlineStr) return "무기한";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(deadlineStr);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffInMs = targetDate - today;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 0) {
      return `D-${diffInDays}`;
    } else if (diffInDays === 0) {
      return "오늘 마감";
    } else {
      return "마감됨";
    }
  };

  return (
    <>
    <div id='main-header'>
      <div>
        <h2>프로젝트 탐색</h2>
        <span>내 전공·관심 스택에 맞는 팀을 찾아보세요</span>
      </div>
      <Link to='/create' id='new_project_button' onClick={()=>{setLeftsideChose("프로젝트 생성");}}>+ 새 프로젝트</Link>
    </div>

    <div id='search_list'>
      <button id='search-allButton' className={currentSearch === "전체" ? "active" : ""} onClick={()=>{setCurrentSearch("전체")}}>전체</button>
      <button id='search-allButton' className={currentSearch === "모집중" ? "active" : ""} onClick={()=>{setCurrentSearch("모집중")}}>모집중</button>
      <button id='search-allButton' className={currentSearch === "내 전공" ? "active" : ""} onClick={()=>{setCurrentSearch("내 전공")}}>내 전공</button>
      <button id='search-allButton' className={currentSearch === "관심 스택" ? "active" : ""} onClick={()=>{setCurrentSearch("관심 스택")}}>관심 스택</button>
    </div>
    
    <div id='search-pjList'>
      {pjList.map((project, index) => (
        <div
          key={project.projectId ?? index}
          onClick={() => {
            setLeftsideChose("프젝자세히");
            setClickedPj(project);
            navigate(`/project/${project.projectId}`);
          }}
        >
          <div id='project-header'>
            <h3>{project.projectTitle ?? project.pjtitle}</h3>
            <div>{getDDay(project.projectDeadline ?? project.pjdeadline, project.pjdone)}</div>
          </div>

          <div id='search-userProfile'>
            {renderUserProfileImage("pjProfile")}
            <span>{project.pjPerson?.[0]?.name || account.name}</span>
            <span id="PM">PM</span>
          </div>

          <div id='search-jungongBox'>
            {(project.requiredMajors ?? project.pjJungong ?? []).map((jungong, i) => (
              <span key={i} className={jungong}>{jungong}</span>
            ))}
          </div>

          <div id='search-skillBox'>
            {(project.requiredStacks ?? project.pjskill ?? []).map((skill, i) => (
              <span key={i}>{skill}</span>
            ))}
          </div>

          <div id='project-bottom'>
            <div id='pjbottom-continue'><div></div>진행중</div>
            <div id='pjbottom-mojib'>모집 {project.pjpersonCount ?? project.pjPerson?.length ?? 0}/{project.pjcount}</div>
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default SearchPage;

