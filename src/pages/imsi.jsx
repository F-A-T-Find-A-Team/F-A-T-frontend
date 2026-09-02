import { useState, useRef, useEffect } from 'react'
import './App.css'
import './ChatPage.css'
import githubIcon from './assets/github.webp'
import basicProfile from './assets/snake.webp'
import './MyPage.css';




function MyPage({ account, setAccount, pjList = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  // 🌟 피드백 모달 상태
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // account 정보가 아직 로드되지 않았을 때의 예외 처리
  if (!account) return null;

  // isEditing 상태가 true면 수정 페이지(MyPageRemake)를 렌더링
  if (isEditing) {
    return (
      <MyPageRemake 
        account={account} 
        setAccount={setAccount} 
        setIsEditing={setIsEditing} 
      />
    );
  }

  // 🌟 내 계정(email)으로 받은 피드백 데이터 수집
  const myFeedbacks = [];
  pjList.forEach(pj => {
    if (pj.feedbacks && pj.feedbacks[account.email]) {
      myFeedbacks.push({
        pjTitle: pj.pjtitle,
        rating: pj.feedbacks[account.email].rating,
        comment: pj.feedbacks[account.email].comment
      });
    }
  });

  // 🌟 총 받은 피드백 개수 및 평균 별점 계산
  const totalFeedbacks = myFeedbacks.length;
  const avgRating = totalFeedbacks > 0 
    ? (myFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedbacks).toFixed(1) 
    : 0;

  // 이메일 앞부분을 아이디처럼 사용
  const userId = account.email ? account.email.split('@')[0] : 'user';
  
  // 프로필 이미지가 없을 때 텍스트 아바타
  const avatarText = account.name && account.name.length >= 3 
    ? account.name.charAt(1) 
    : (account.name ? account.name.charAt(0) : '👤');

  return (
    <div className="mypage-container">
      {/* 🟢 복구됨: 상단 프로필 헤더 카드 */}
      <div className="profile-header-card">
        <div className="profile-info-section">
          <div 
            className="profile-avatar"
            style={account.image ? { 
              backgroundImage: `url(${account.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'transparent'
            } : {
              backgroundImage: `url(${basicProfile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'transparent'
            }}
          >
          </div>
          
          <div className="profile-details">
            <div className="profile-name-row">
              <h2>{account.name}</h2>
              <span className="badge gender-badge">{account.gender}</span>
            </div>
            <div className="profile-sub-info">
              <span>{account.number}</span>
            </div>
            <div className="badge major-badge">{account.jungong}</div>
          </div>
        </div>
        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>프로필 수정</button>
      </div>

      {/* 자기소개 섹션 */}
      <div className="profile-bio">
        <p>{account.introduce || "작성된 자기소개가 없습니다."}</p>
      </div>

      <div className="mypage-grid">
        {/* 🟢 복구됨: 깃허브 연동 카드 */}
        <div className="grid-card github-card">
          <div className="github-header">
            <div className="github-title">
              <div className="github-icon"></div>
              <h3>GitHub 연동됨</h3>
            </div>
            <span className="badge connected-badge">Connected</span>
          </div>
          
          <a href="#" className="github-link">
            @{userId}-dev <span className="dot">·</span> 24 repos ↗
          </a>
          
          <div className="language-stats">
            <div className="lang-row">
              <span className="lang-name">TypeScript</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="lang-row">
              <span className="lang-name">Dart</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="lang-row">
              <span className="lang-name">Python</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="github-footer">
            <span className="footer-info">저장소 6개 연동 중</span>
            <button className="disconnect-btn">연동 해지</button>
          </div>
        </div>

        <div className="right-cards-column">
          {/* 🟢 복구됨: 통계 카드 */}
          <div className="grid-card stats-card">
            <div className="stat-item">
              <span className="stat-num text-green">1</span>
              <span className="stat-label">진행중</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num text-black">2</span>
              <span className="stat-label">완료</span>
            </div>
          </div>

          {/* 🌟 수정된 부분: 받은 피드백 보기 카드 */}
          <div 
            className="grid-card action-card" 
            onClick={() => setIsFeedbackModalOpen(true)} 
            style={{ cursor: 'pointer' }}
          >
            <div className="action-info">
              <h4>받은 피드백 보기 <span className="star-rating">⭐ {avgRating > 0 ? avgRating : "0.0"}</span></h4>
              <p>완료 프로젝트에서 {totalFeedbacks}개</p>
            </div>
            <span className="arrow-icon">›</span>
          </div>
        </div>
      </div>

      {/* 🌟 피드백 모달창 렌더링 */}
      {isFeedbackModalOpen && (
        <MyFeedbackModal 
          myFeedbacks={myFeedbacks} 
          onClose={() => setIsFeedbackModalOpen(false)} 
        />
      )}
    </div>
  );
}

function MyFeedbackModal({ myFeedbacks, onClose }) {
  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal-content">
        <div className="feedback-modal-header">
          <div className="feedback-header-title">
            <h3>받은 피드백 내역</h3>
            <p>함께한 팀원들이 남겨준 소중한 피드백이에요.</p>
          </div>
          <button className="feedback-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="feedback-modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {myFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#adb5bd' }}>
              아직 받은 피드백이 없습니다. <br/>프로젝트를 완료하고 피드백을 받아보세요!
            </div>
          ) : (
            myFeedbacks.map((fb, idx) => (
              <div key={idx} className="feedback-member-card" style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#212529' }}>{fb.pjTitle}</span>
                  <div className="feedback-stars" style={{ gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`star ${fb.rating >= star ? 'filled' : ''}`} style={{ cursor: 'default' }}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ width: '100%', backgroundColor: '#f8f9fa', padding: '14px', borderRadius: '8px', fontSize: '14px', color: '#495057', boxSizing: 'border-box' }}>
                  {fb.comment || "작성된 코멘트가 없습니다."}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function MyPageRemake({ account, setAccount, setIsEditing }) {
  // 로컬 상태 관리
  const [intro, setIntro] = useState(account.introduce || "");
  const [gender, setGender] = useState(account.gender || "남"); // 기타 제거
  
  // 전공 단일 선택
  const [jungongSelect, setJungongSelect] = useState(account.jungong || "FE");

  // 관심 기술 스택 (계정에 skills 배열이 있으면 불러오고, 없으면 빈 배열)
  const [skills, setSkills] = useState(account.skills || []);
  const [currentSkill, setCurrentSkill] = useState("");

  const userId = account.email ? account.email.split('@')[0] : 'user';
  const avatarText = account.name && account.name.length >= 3 
    ? account.name.charAt(1) 
    : (account.name ? account.name.charAt(0) : '👤');

  const allJungongs = ['FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI/UX', 'Game', 'security', 'AI'];
  const genders = ['남', '여']; // 기타 제거

  // 저장 로직 (이때 setAccount가 정상 작동하려면 MainPage에서 props로 내려줘야 함)
  const handleSave = () => {
    if (typeof setAccount === 'function') {
      setAccount({
        ...account,
        introduce: intro,
        gender: gender,
        jungong: jungongSelect, // 단일 전공 저장
        skills: skills // 기술 스택 저장
      });
      setIsEditing(false);
    } else {
      console.error("setAccount가 함수가 아닙니다. MainPage에서 props를 확인해주세요.");
    }
  };

  // 기술 스택 추가
  const addSkill = (e) => {
    if (e) e.preventDefault();
    if (currentSkill.trim() !== "" && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  // 스택 엔터키 입력 처리
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // 기술 스택 삭제
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="remake-container">
      {/* 1. 상단 프로필 헤더 카드 */}
      <div className="remake-card">
        <div className="remake-header-inner">
          <div className="remake-profile-left">
            <div 
              className="remake-avatar"
              style={account.image ? { 
                backgroundImage: `url(${account.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent'
              } : {
                backgroundImage: `url(${basicProfile})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent'
              }}
            >
              {!account.image && avatarText}
            </div>
            
            <div className="remake-profile-details">
              <div className="remake-name-row">
                <h2>{userId}</h2>
                <span className="remake-badge-gray">{gender}</span>
              </div>
              <div className="remake-sub-info">
                <span>{account.number} · {account.name}</span>
              </div>
              <div className="remake-majors-display">
                 {/* 단일 전공 배지 표시 */}
                 <span className="remake-badge-blue">{jungongSelect}</span>
              </div>
            </div>
          </div>
          <button className="remake-save-btn" onClick={handleSave}>완료</button>
        </div>
      </div>

      {/* 2. 하단 정보 수정 폼 카드 */}
      <div className="remake-card remake-form-card">
        
        {/* 한 줄 소개 */}
        <div className="remake-form-group">
          <label>한 줄 소개 <span>{intro.length}/100</span></label>
          <textarea 
            className="remake-textarea"
            maxLength={100}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="자기소개를 입력해주세요."
          />
        </div>

        {/* 성별 */}
        <div className="remake-form-group">
          <label>성별</label>
          <div className="remake-btn-group">
            {genders.map((g) => (
              <button 
                key={g} 
                className={`remake-toggle-btn ${gender === g ? 'active' : ''}`}
                onClick={() => setGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 전공 (단일 선택) */}
        <div className="remake-form-group">
          <label>전공 <span>· 1개</span></label>
          <div className="remake-tag-group">
            {allJungongs.map((major) => (
              <button 
                key={major} 
                className={`remake-tag-btn ${jungongSelect === major ? 'active' : ''}`}
                onClick={() => setJungongSelect(major)}
              >
                {major}
              </button>
            ))}
          </div>
        </div>

        {/* 관심 기술 스택 */}
        <div className="remake-form-group">
          <label>관심 기술 스택 <span>· 자유 입력</span></label>
          <div className="remake-skill-input-row">
            <input 
              type="text" 
              className="remake-input"
              placeholder="기술을 입력하고 Enter (예: Next.js)"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
            <button className="remake-add-btn" onClick={addSkill}>추가</button>
          </div>
          
          <div className="remake-skill-list">
            {skills.map((skill, index) => (
              <div key={index} className="remake-skill-chip">
                {skill}
                <button className="remake-skill-delete" onClick={() => removeSkill(skill)}>×</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {

  const [account, setAccount] = useState({});
  const [isLogin, setisLogin] = useState(false);

  return (
    <div className={isLogin ? "bg-main" : "bg-login"} id="fucking_body">
      {isLogin ? <MainPage setisLogin={setisLogin} account={account} setAccount={setAccount}/>:<Sign setisLogin={setisLogin} setAccount={setAccount}/>}
    </div>
  )
}

export default App