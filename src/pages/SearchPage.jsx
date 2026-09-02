import { useState } from 'react';
import basicProfile from '../assets/snake.webp';

function SearchPage({setLeftsideChose, pjList, setClickedPj, renderUserProfileImage, account}) {
  
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
      <div id='new_project_button' onClick={()=>{setLeftsideChose("프로젝트 생성")}}>+ 새 프로젝트</div>
    </div>

    <div id='search_list'>
      <button id='search-allButton' className={currentSearch === "전체" ? "active" : ""} onClick={()=>{setCurrentSearch("전체")}}>전체</button>
      <button id='search-allButton' className={currentSearch === "모집중" ? "active" : ""} onClick={()=>{setCurrentSearch("모집중")}}>모집중</button>
      <button id='search-allButton' className={currentSearch === "내 전공" ? "active" : ""} onClick={()=>{setCurrentSearch("내 전공")}}>내 전공</button>
      <button id='search-allButton' className={currentSearch === "관심 스택" ? "active" : ""} onClick={()=>{setCurrentSearch("관심 스택")}}>관심 스택</button>
    </div>
    
    <div id='search-pjList'>
      {pjList.map((project, index) => (
        <div key={index} onClick={()=>{setLeftsideChose("프젝자세히"); setClickedPj(project)}}>
          <div id='project-header'>
            <h3>{project.pjtitle}</h3>
            <div>{getDDay(project.pjdeadline, project.pjdone)}</div>
          </div>

          <div id='search-userProfile'>
            {renderUserProfileImage("pjProfile")}
            <span>{project.pjPerson?.[0]?.name || account.name}</span>
            <span id="PM">PM</span>
          </div>

          <div id='search-jungongBox'>
            {project.pjJungong && project.pjJungong.map((jungong, i) => (
              <span key={i} className={jungong}>{jungong}</span>
            ))}
          </div>

          <div id='search-skillBox'>
            {project.pjskill && project.pjskill.map((skill, i) => (
              <span key={i}>{skill}</span>
            ))}
          </div>

          <div id='project-bottom'>
            <div id='pjbottom-continue'><div></div>진행중</div>
            <div id='pjbottom-mojib'>모집 {project.pjpersonCount}/{project.pjcount}</div>
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

function ProjectMore({clickedPj, setClickedPj, updateProject, setLeftsideChose, account, renderUserProfileImage}) {
  
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  function ProgressClick(value) {
    if (account.email !== clickedPj.pjPerson?.[0]?.email) {
      alert("PM만 변경할 수 있어요.");
      return;
    }
    
    const updatedPj = {
      ...clickedPj,
      pjprogress: value,
      pjdone: value === 3 ? true : false 
    };
    updateProject(updatedPj);
  }

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

  const renderTeamProfileImage = (id, Pj) => {
      return (
        <div 
          id={id}
          key={id}
          style={
            Pj.image
              ? { 
                  backgroundImage: `url(${Pj.image})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  color: 'transparent'
                } 
              : {
                backgroundImage: `url(${basicProfile})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                color: 'transparent'
              }
          }
        >
        </div>
      );
    };

  const PjMemberAdd = (newMember) => {
    const isAlreadyMember = clickedPj.pjPerson?.some(
      (person) => person.email === newMember.email
    );

    if (isAlreadyMember) {
      alert("이미 팀에 참여한 멤버입니다.");
      return;
    }

    if (clickedPj.pjPerson?.length >= clickedPj.pjcount) {
      alert("모집 인원이 마감되었습니다.");
      return;
    }

    const updatedPj = {
      ...clickedPj,
      pjpersonCount: (clickedPj.pjPerson?.length || 0) + 1,
      pjPerson: [...(clickedPj.pjPerson || []), newMember]
    };
    updateProject(updatedPj);
  }

  return (
    <div id='more-box'>
      <div id='more-leftside'>
        <span id='more-gotosearch' onClick={()=>{setLeftsideChose("탐색");}}>&lt; 탐색으로</span>
        <h2>{clickedPj.pjtitle}</h2>
        <div id='more-userProfile'>
          {renderUserProfileImage("moreProfile")}
          <span>{clickedPj.pjPerson?.[0]?.name || account.name}</span>
          <span id="PM">PM</span>
        </div>
        
        <div id='more-progressBox'>
          <span>진행 단계</span>

          <div id='more-progress'>
            <div id='progress-idea' className={`${clickedPj.pjprogress >= 1 ? "active" : ""} ${clickedPj.pjprogress === 1 ? "cactive" : ""}`}>
              <div onClick={()=>{ProgressClick(1)}}>1</div>
              <span>아이디어</span>
            </div>

            <div className={`progress-way ${clickedPj.pjprogress >= 2 ? "active" : ""}`}></div>

            <div id='progress-jinhaeng' className={`${clickedPj.pjprogress >= 2 ? "active" : ""} ${clickedPj.pjprogress === 2 ? "cactive" : ""}`}>
              <div onClick={()=>{ProgressClick(2)}}>2</div>
              <span>진행중</span>
            </div>

            <div className={`progress-way ${clickedPj.pjprogress >= 3 ? "active" : ""}`}></div>

            <div id='progress-done' className={`${clickedPj.pjprogress >= 3 ? "active" : ""} ${clickedPj.pjprogress === 3 ? "cactive" : ""}`}>
              <div onClick={()=>{ProgressClick(3)}}>3</div>
              <span>완성</span>
            </div>
          </div>
          <span id='more-inform'>단계를 누르면 상태가 바뀌어요. <span>완성</span>으로 바꾸면 레주메북 연동·피드백 창이 자동으로 떠요.</span>
        </div>

        <div className='more-contentsBox'>
          <span>상세 내용</span>
          <span id='more-contents'>{clickedPj.pjcontents}</span>
        </div>

        <div className='more-contentsBox'>
          <span>필요 전공</span>
          <div id='more-jungongBox'>
            {clickedPj.pjJungong && clickedPj.pjJungong.map((jungong, i) => (
              <span key={i} className={jungong}>{jungong}</span>
            ))}
          </div>
        </div>

        <div className='more-contentsBox'>
          <span>기술 스택</span>
          <div id='more-skillBox'>
            {clickedPj.pjskill && clickedPj.pjskill.map((skill, i) => (
              <span key={i}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div id='more-rightside'>
        <div id='more-rightBox'>
          <div id='mright-header'>
            <div id='mright-end'>
              <span>{getDDay(clickedPj.pjdeadline, clickedPj.pjdone)}</span>
              <span className='mright-ex'>마감</span>
            </div>
            <div id='mright-mojib'>
              <span>{clickedPj.pjpersonCount}/{clickedPj.pjcount}</span>
              <span className='mright-ex'>모집</span>
            </div>
          </div>

          <div id='mright-box'>
            <span>현재 팀원</span>
            <div id='mright-teamBox'>
              {clickedPj.pjPerson && clickedPj.pjPerson.map((person, i) => (
                renderTeamProfileImage('mright-profiles', person)
              ))}
            </div>

            <button id='mright-submit' onClick={()=> {PjMemberAdd(account)}}>지원하기</button>
            <button id='mright-pmExcuse'>PM에게 문의하기</button>
          </div>

            <div id='mright-bottom'>
              {clickedPj.pjPerson && account.email === clickedPj.pjPerson?.[0]?.email ? 
                <PmButtonSelect 
                  ProgressClick={ProgressClick} 
                  clickedPj={clickedPj} 
                  setIsFeedbackModalOpen={setIsFeedbackModalOpen}
                /> : ""}
            </div>
        </div>
      </div>

      {isFeedbackModalOpen && (
        <FeedbackModal 
          clickedPj={clickedPj} 
          onClose={() => setIsFeedbackModalOpen(false)} 
          updateProject={updateProject}
        />
      )}
    </div>
  )
}

function PmButtonSelect({clickedPj, ProgressClick, setIsFeedbackModalOpen}) {
  return (
    <>
      {clickedPj.pjdone === true ? 
        <PmReview setIsFeedbackModalOpen={setIsFeedbackModalOpen}/> : 
        <PmExcuseButton ProgressClick={ProgressClick}/>}
    </>
  )
}

function PmExcuseButton({ProgressClick}) {
  return (
    <div id='excuse-box'>
      <span id='excuse-span'>PM 전용</span>
      <button onClick={()=>{ProgressClick(3)}}>&#10003; 프로젝트 완료하기</button>
    </div>
  )
}

function PmReview({setIsFeedbackModalOpen}) {
  return (
    <div id='review-box'>
      <span id='excuse-span'>PM 전용</span>
      <button onClick={()=>{setIsFeedbackModalOpen(true)}}>&#9733; 팀원 피드백 작성</button>
    </div>
  )
}

function FeedbackModal({ clickedPj, onClose, updateProject }) {
  const [feedbacks, setFeedbacks] = useState(() => {
    return clickedPj.feedbacks || {};
  });

  const handleRatingChange = (email, rating) => {
    setFeedbacks(prev => ({
      ...prev,
      [email]: { ...(prev[email] || {}), rating }
    }));
  };

  const handleCommentChange = (email, comment) => {
    setFeedbacks(prev => ({
      ...prev,
      [email]: { ...(prev[email] || {}), comment }
    }));
  };

  const handleSubmit = () => {
    const updatedPj = {
      ...clickedPj,
      feedbacks: feedbacks
    };
    updateProject(updatedPj);
    alert("피드백이 성공적으로 저장되었습니다!");
    onClose();
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal-content">
        <div className="feedback-modal-header">
          <div className="feedback-header-title">
            <h3>팀원 피드백</h3>
            <p>함께한 팀원에게 별점과 한 줄 피드백을 남겨주세요.</p>
          </div>
          <button className="feedback-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="feedback-modal-body">
          {clickedPj.pjPerson && clickedPj.pjPerson.map((member, idx) => {
            const isPM = idx === 0;
            const displayRole = isPM 
              ? `PM${member.jungong ? ` · ${member.jungong}` : ''}` 
              : (member.jungong || '팀원');
              
            const memberFeedback = feedbacks[member.email] || { rating: 0, comment: '' };
            
            const profileStyle = member.image
              ? { 
                  backgroundImage: `url(${member.image})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }
              : { 
                  backgroundImage: `url(${basicProfile})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                };
            
            return (
              <div key={member.email} className="feedback-member-card">
                <div className="feedback-member-info">
                  <div className="feedback-avatar" style={profileStyle}></div>
                  <div className="feedback-details">
                    <span className="feedback-name">{member.name}</span>
                    <span className="feedback-role">{displayRole}</span>
                  </div>
                </div>
                
                <div className="feedback-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star} 
                      className={`star ${memberFeedback.rating >= star ? 'filled' : ''}`}
                      onClick={() => handleRatingChange(member.email, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <input 
                  type="text" 
                  className="feedback-input" 
                  placeholder="예: 커뮤니케이션이 정확하고 마감을 잘 지켰어요"
                  value={memberFeedback.comment || ''} /* 🌟 || '' 추가: undefined 방지 */
                  onChange={(e) => handleCommentChange(member.email, e.target.value)}
                />
              </div>
            )
          })}
        </div>
        
        <div className="feedback-modal-footer">
          <button className="feedback-submit-btn" onClick={handleSubmit}>피드백 제출하기</button>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
