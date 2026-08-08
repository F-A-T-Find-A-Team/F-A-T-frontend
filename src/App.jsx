import { useState, useRef, useEffect } from 'react'
import './App.css'
import './ChatPage.css'
import githubIcon from './assets/github.webp'
import basicProfile from './assets/snake.webp'
import './MyPage.css';

function Sign({setisLogin, setAccount}) {

  const [isSign, setIsSign] = useState(false);

  return (
    <>
      {isSign ? <SignOrEmail setIsSign={setIsSign} setisLogin={setisLogin} setAccount={setAccount}/>:<LoginPage setIsSign={setIsSign} setisLogin={setisLogin}/>}
    </>
  )
}

function LoginPage({setIsSign, setisLogin}) {

  const LoginSubmit = (e) => {
    e.preventDefault();
    setisLogin(true);
  }

  return (
    <form id='Login_box' onSubmit={LoginSubmit}>
      <div id='leftside_block'></div>
      <div id="Login-leftside">
        <h1>F.A.T.</h1>
        <div>
          <h2>전공과 기술 스택으로<br/>팀을 찾는 곳</h2>
          <span>아이디어부터 완성까지, 프로젝트를 함께할 사람을<br/>만나보세요.</span>
        </div>
        <p>© 2026 DSM · F.A.T</p>
      </div>

      <div id="Login-rightside">
        <div id="Login-rightside-box">
          <div>
            <h1>로그인</h1>
            <span>학교 이메일 계정으로 시작하세요</span>
          </div>

          <div id="email_box">
            <span>학교 이메일</span><br/>
            <input placeholder='mte@dsm.hs.kr' type='email' required></input>
          </div>
          <div id="email_box">
            <span>비밀번호</span><br/>
            <input type='password' required></input>
          </div>
          <button id='Login_button' type='submit'>로그인</button>
          <div id='gayjoygo'>계정이 없으신가요? <span id='gayib' onClick={() => {
            setIsSign(true);
          }}>회원가입</span></div>

          <div id='else'>
            <div className='else'></div><span>또는</span><div className='else'></div>
          </div>
          <div id='github_login' type='button'><img src={githubIcon}/><span>GitHub로 계속하기</span></div>
        </div>
      </div>
    </form>
  )
}

function SignOrEmail({setIsSign, setisLogin, setAccount}) {
  const [emailconfirm, setEmailconfirm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  return(
    <>
      {emailconfirm ? 
        <EmailConfirm 
          setEmailconfirm={setEmailconfirm} 
          userEmail={userEmail} 
          setisLogin={setisLogin} 
          setAccount={setAccount} 
        /> 
        : 
        <SignPage setIsSign={setIsSign} setisLogin={setisLogin} setAccount={setAccount} setEmailconfirm={setEmailconfirm} setUserEmail={setUserEmail}/>
      }
    </>
  )
}

function SignPage({setIsSign, setisLogin, setAccount, setEmailconfirm, setUserEmail}) {

  const [genderSelect, setGenderSelect] = useState("남");
  const [jungongSelect, setJungongSelect] = useState("FE");
  const [introLength, setIntroLength] = useState(0);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userIntro, setUserIntro] = useState("");

  // 🌟 관심 기술 스택 상태 추가
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleInput = (e) => {
    let text = e.currentTarget.textContent;

    if (text.length > 100) {
      text = text.slice(0, 100);
      e.currentTarget.textContent = text;
    }

    setIntroLength(text.length);
    setUserIntro(text);
  };

  // 🌟 기술 스택 추가 로직
  const addSkill = (e) => {
    if (e) e.preventDefault();
    if (currentSkill.trim() !== "" && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  // 🌟 엔터키 입력 시 폼 제출 방지 및 스택 추가
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 누를 때 회원가입 폼이 제출되는 것을 막음
      addSkill();
    }
  };

  // 🌟 기술 스택 삭제 로직
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const SignSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith("@dsm.hs.kr")) {
      alert("학교 이메일(@dsm.hs.kr) 형식으로만 가입할 수 있습니다!");
      return;
    }

    setAccount({
      name: userName,
      email: email,
      password: userPw,
      introduce: userIntro,
      image: profileImage,
      number: email.slice(4,8),
      jungong: jungongSelect,
      gender: genderSelect,
      skills: skills // 🌟 가입 시 기술 스택 배열도 계정 정보에 함께 저장
    })

    setUserEmail(email);
    setEmailconfirm(true);
  }

  return(
    <form id='Login_box' onSubmit={SignSubmit}>
      <div id='leftside_block'></div>
      <div id="Login-leftside">
        <h1>F.A.T.</h1>
        <div>
          <h2>전공과 기술 스택으로<br/>팀을 찾는 곳</h2>
          <span>아이디어부터 완성까지, 프로젝트를 함께할 사람을<br/>만나보세요.</span>
        </div>
        <p>© 2026 DSM · F.A.T</p>
      </div>

      <div id='Sign-rightside'>
        <div id="Sign_box">
          <h2 onClick={()=>{setIsSign(false)}}>&lt; 회원가입</h2>
          <span>프로필을 설정하고 팀을 찾아보세요</span>
          <div id='sign_profile'>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <div 
              id='profile_photo' 
              onClick={handlePhotoClick}
              style={
                profileImage 
                  ? { 
                      backgroundImage: `url(${profileImage})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      color: 'transparent',
                      cursor: 'pointer'
                    } 
                  : { cursor: 'pointer' }
              }
            >
              {!profileImage && "사진"}
            </div>

            <div id='sign_input_box'>
              <input className='sign_input' id='id_input' placeholder='이름' required onChange={(e)=>{setUserName(e.target.value)}}></input>
              <input className='sign_input' id='password_input'
                placeholder='이메일(ex: mte@dsm.hs.kr)' type='email' required onChange={(e)=>{setEmail(e.target.value)}}></input>
              <input className='sign_input' type='password' placeholder='비밀번호' required onChange={(e)=>{setUserPw(e.target.value);}}></input>
            </div>
          </div>

          <div id='introduce_box'>
            <div>
              <span>자기소개 </span><span id='introduce_count'>{introLength}/100</span>
            </div>
            <div id='introduce_area' contentEditable="true" onInput={handleInput}></div>
          </div>

          <div id='sign_gender'>
            <span>성별</span>
            <div id='gender_selector'>
              <button className={genderSelect === "남" ? "active" : ""} onClick={ () => {setGenderSelect("남");}} type='button'>남</button>
              <button className={genderSelect === "여" ? "active" : ""} onClick={ () => {setGenderSelect("여");}} type='button'>여</button>
            </div>
          </div>

          <div id='sign_jungong'>
            <span>내 전공 </span><span id='jungong_inform'>(1개)</span>
            <div id='jungong_selector'>
              <button className={jungongSelect === "FE" ? "active" : ""} onClick={()=> {setJungongSelect("FE")}} type='button'>FE</button>
              <button className={jungongSelect === "BE" ? "active" : ""} onClick={()=> {setJungongSelect("BE")}} type='button'>BE</button>
              <button className={jungongSelect === "EM(FW)" ? "active" : ""} onClick={()=> {setJungongSelect("EM(FW)")}} type='button'>EM(FW)</button>
              <button className={jungongSelect === "EM(HW)" ? "active" : ""} onClick={()=> {setJungongSelect("EM(HW)")}} type='button'>EM(HW)</button>
              <button className={jungongSelect === "Flutter" ? "active" : ""} onClick={()=> {setJungongSelect("Flutter")}} type='button'>Flutter</button>
              <button className={jungongSelect === "android" ? "active" : ""} onClick={()=> {setJungongSelect("android")}} type='button'>android</button>
              <button className={jungongSelect === "iOS" ? "active" : ""} onClick={()=> {setJungongSelect("iOS")}} type='button'>iOS</button>
              <button className={jungongSelect === "UI" ? "active" : ""} onClick={()=> {setJungongSelect("UI")}} type='button'>UI/UX</button>
              <button className={jungongSelect === "Game" ? "active" : ""} onClick={()=> {setJungongSelect("Game")}} type='button'>Game</button>
              <button className={jungongSelect === "security" ? "active" : ""} onClick={()=> {setJungongSelect("security")}} type='button'>security</button>
              <button className={jungongSelect === "AI" ? "active" : ""} onClick={()=> {setJungongSelect("AI")}} type='button'>AI</button>
            </div>
          </div>

          {/* 🌟 관심 기술 스택 UI 변경 부분 */}
          <div id='sign_skill'>
            <div style={{ marginBottom: '12px' }}>
              <span>관심 기술 스택</span><span className='pj-free' style={{ color: '#adb5bd', fontSize: '13px', fontWeight: '500' }}> · 자유 입력</span>
            </div>
            
            <div className="remake-skill-input-row">
              <input 
                type="text" 
                className="remake-input"
                placeholder="기술을 입력하고 Enter (예: Next.js)"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <button type="button" className="remake-add-btn" onClick={addSkill}>추가</button>
            </div>
            
            <div className="remake-skill-list">
              {skills.map((skill, index) => (
                <div key={index} className="remake-skill-chip">
                  {skill}
                  <button type="button" className="remake-skill-delete" onClick={() => removeSkill(skill)}>×</button>
                </div>
              ))}
            </div>
          </div>
          
          <button id='sign_done_button' type='submit'>가입하고 시작하기</button>
        </div>
      </div>
    </form>
  )
}

function EmailConfirm({setEmailconfirm, userEmail, setisLogin, setAccount, account}) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue && value !== '') return;

    const newCode = [...code];
    newCode[index] = numericValue;
    setCode(newCode);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index] !== '') {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const finalCode = code.join('');

    if (finalCode.length < 6) {
      alert("6자리 인증번호를 모두 입력해주세요.");
      return;
    }

    alert("인증이 완료되었습니다!");
    setisLogin(true);
  };

  return (
    <form onSubmit={handleVerify} id='Login_box'>
      <div id='leftside_block'></div>
      <div id="Login-leftside">
        <h1>F.A.T.</h1>
        <div>
          <h2>전공과 기술 스택으로<br/>팀을 찾는 곳</h2>
          <span>아이디어부터 완성까지, 프로젝트를 함께할 사람을<br/>만나보세요.</span>
        </div>
        <p>© 2026 DSM · F.A.T</p>
      </div>

      <div id='Email-rightside'>
        <div id="Email-box">
          <div id='Email-logo'></div>
          <h2 onClick={() => setEmailconfirm(false)} style={{ cursor: 'pointer' }}>&lt; 이메일 인증</h2>
          <div id='Email-spanBox'>
            <span>{userEmail || "학교 이메일"}</span><span>로 6자리 코드를 보냈어요.</span>
          </div>

          <div id='Email-confirmBox'>
            <div id='Email-timeBox'>
              <span>인증번호</span>
              <span>{formatTime(timeLeft)}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '15px' }}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type='text'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '40px',
                    height: '45px',
                    fontSize: '20px',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    outline: 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <button id='sign_done_button' type='submit' style={{ width: '100%', marginTop: '20px' }}>
            인증 확인
          </button>
        </div>
      </div>
    </form>
  );
}

function MainPage({setisLogin, account, setAccount}) {
  
  const [leftsideChose, setLeftsideChose] = useState("탐색");
  const [pjList, setPjList] = useState([]);
  
  const [clickedPj, setClickedPj] = useState({ pjPerson: [] });

  const updateProject = (updatedPj) => {
    setClickedPj(updatedPj);
    setPjList(pjList.map(pj => pj.pjtitle === updatedPj.pjtitle ? updatedPj : pj));
  };

  const renderUserProfileImage = (id) => {
      return (
        <div 
          id={id}
          style={
            account.image 
              ? { 
                  backgroundImage: `url(${account.image})`, 
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
          {!account.image && account.name}
        </div>
      );
    };

  return (
    <div id='main-background'>
      <div id='main-leftside'>
        <h1 id='main-title'>F.A.T.</h1>
        <button id='main-search' className={leftsideChose === "탐색" || leftsideChose === "프젝자세히" ? "active" : ""} onClick={()=>{setLeftsideChose("탐색");}}><div></div>탐색</button>
        <button id='main-pj_create' className={leftsideChose === "프로젝트 생성" ? "active" : ""} onClick={()=>{setLeftsideChose("프로젝트 생성");}}><div></div>프로젝트 생성</button>
        <button id='main-chat' className={leftsideChose === "채팅" ? "active" : ""} onClick={()=>{setLeftsideChose("채팅");}}><div></div>채팅</button>
        <button id='main-team_recommend' className={leftsideChose === "AI 팀원 추천" ? "active" : ""} onClick={()=>{setLeftsideChose("AI 팀원 추천");}}><div></div>AI 팀원 추천</button>
        <button id='main-mypage' className={leftsideChose === "마이페이지" ? "active" : ""} onClick={()=>{setLeftsideChose("마이페이지");}}><div></div>마이페이지</button>

        <div id='main-userProfile'>
          {renderUserProfileImage("main-profileImage")}
          <div id='user_inform'>
            <span id='main-userName'>{account.name}</span>
            <span id='main-userNumber'>{account.number}{account.jungong ? `·${account.jungong}` : ''}</span>
          </div>
        </div>
      </div>
      
      <div id='main-rightside' className={leftsideChose === "채팅" || leftsideChose === "마이페이지" ? "onChat" : ""}>
        <div style={{ display: leftsideChose === "탐색" ? "block" : "none", width: "100%", height: "100%" }}>
          <SearchPage setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} renderUserProfileImage={renderUserProfileImage} account={account}/>
        </div>
        
        <div style={{ display: leftsideChose === "프젝자세히" ? "block" : "none", width: "100%", height: "100%" }}>
          {clickedPj.pjtitle && 
            <ProjectMore clickedPj={clickedPj} setClickedPj={setClickedPj} updateProject={updateProject} setLeftsideChose={setLeftsideChose} account={account} renderUserProfileImage={renderUserProfileImage}/>
          }
        </div>

        <div style={{ display: leftsideChose === "프로젝트 생성" ? "block" : "none", width: "100%", height: "100%" }}>
          <PjcreatePage setLeftsideChose={setLeftsideChose} pjList={pjList} setPjList={setPjList} account={account}/>
        </div>
        <div style={{ display: leftsideChose === "채팅" ? "block" : "none", width: "100%", height: "100%" }}>
          <ChatPage/>
        </div>
        <div style={{ display: leftsideChose === "AI 팀원 추천" ? "block" : "none", width: "100%", height: "100%" }}>
          <TeamRPage/>
        </div>
        <div style={{ display: leftsideChose === "마이페이지" ? "block" : "none", width: "100%", height: "100%" }}>
          <MyPage account={account} setAccount={setAccount} />
        </div>
      </div>
    </div>
  )
}

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
            {/* 💡 getDDay 호출 시 project.pjdone 값을 같이 넘겨줍니다 */}
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

function PjcreatePage({setLeftsideChose, pjList, setPjList, account}) {

    const [jungongSelect, setJungongSelect] = useState([]);
    const [skillList, setSkillList] = useState([]);

    const [currentSkill, setCurrentSkill] = useState("");
    const [pjCount, setPjCount] = useState(2);

    const [currentProject, setCurrentProjcet] =useState({
      pjtitle : "",
      pjcontents : "",
      pjdeadline : "",
      pjcount : pjCount,
      pjprogress: 1,
      pjpersonCount: 1,
      pjPerson : [account],
      pjdone: false
    });

    const handleInput = (e) => {
    let text = e.currentTarget.textContent;

    if (text.length > 420) {
      text = text.slice(0, 420);
      e.currentTarget.textContent = text;
    }

    setCurrentProjcet({...currentProject, pjcontents:text})
  };

  function Jungong_click(jungongclick) {
    if(jungongSelect.includes(jungongclick)) {
      setJungongSelect(jungongSelect.filter(jungong => jungong !== jungongclick));
    }
    else {
      setJungongSelect([...jungongSelect, jungongclick]);
    }
  }

  function SkillAdd() {
    if(skillList.includes(currentSkill) || currentSkill === "") {
      return;
    }
    setSkillList([...skillList, currentSkill])
    setCurrentSkill("");
  }

  function MinusClicked() {
    if(pjCount <= 2) {
      return;
    }
    setPjCount(pjCount -1);
  }
  function PlusClicked() {
    setPjCount(pjCount +1);
  }

  function PjAddSubmit() {
    if(currentProject.pjtitle === "" || currentProject.pjcontents === "") {
      alert('프로젝트 제목과 내용을 전부 채워주세요');
      return;
    }

    const newProject = {
      ...currentProject,
      pjJungong: jungongSelect,
      pjskill: skillList,
      pjcount: pjCount
    };

    setPjList([...pjList, newProject]);
    setLeftsideChose("탐색");
  }

  return (
    <div id='pjcreate-box'>
      <div id='pjcreate-header'>
        <h2>새 프로젝트 만들기</h2>
        <span>전공을 태그하면 해당 학생들에게 알림이 전송돼요</span>
      </div>
      <div id='pjcreate-container'>
        <div id='pjcreate-title'>
          <span>프로젝트 제목</span>
          <input onChange={(e)=>{setCurrentProjcet({...currentProject, pjtitle: e.target.value})}}></input>
        </div>
        
        <div id='pjcreate-contents'>
          <span>상세 내용</span>
          <div id='pj-content_area' contentEditable="true" onInput={handleInput}></div>
        </div>

        <div id='pjcreate-jungongSelectors'>
          <span>필요 전공</span>
          <div id='pjcreate-jungongSelector'>
            <button className={jungongSelect.includes("FE") ? "active" : ""} onClick={()=> {Jungong_click("FE")}} type='button'>FE</button>
            <button className={jungongSelect.includes("BE") ? "active" : ""} onClick={()=> {Jungong_click("BE")}} type='button'>BE</button>
            <button className={jungongSelect.includes("EM(FW)") ? "active" : ""} onClick={()=> {Jungong_click("EM(FW)")}} type='button'>EM(FW)</button>
            <button className={jungongSelect.includes("EM(HW)") ? "active" : ""} onClick={()=> {Jungong_click("EM(HW)")}} type='button'>EM(HW)</button>
            <button className={jungongSelect.includes("Flutter") ? "active" : ""} onClick={()=> {Jungong_click("Flutter")}} type='button'>Flutter</button>
            <button className={jungongSelect.includes("android") ? "active" : ""} onClick={()=> {Jungong_click("android")}} type='button'>android</button>
            <button className={jungongSelect.includes("iOS") ? "active" : ""} onClick={()=> {Jungong_click("iOS")}} type='button'>iOS</button>
            <button className={jungongSelect.includes("UI") ? "active" : ""} onClick={()=> {Jungong_click("UI")}} type='button'>UI/UX</button>
            <button className={jungongSelect.includes("Game") ? "active" : ""} onClick={()=> {Jungong_click("Game")}} type='button'>Game</button>
            <button className={jungongSelect.includes("security") ? "active" : ""} onClick={()=> {Jungong_click("security")}} type='button'>security</button>
            <button className={jungongSelect.includes("AI") ? "active" : ""} onClick={()=> {Jungong_click("AI")}} type='button'>AI</button>
          </div>
          <div id='pj-jungong-alarm'><div>!</div>선택한 전공 학생 + 관심 스택이 일치하는 학생에게 알림이 가요</div>
        </div>

        <div id='pj-skill_stack'>
          <div><span>기술 스택</span><span className='pj-free'> · 자유입력</span></div>
          <div id='pj-skillBox'><input id='pj-skill_input' onChange={(e) => {setCurrentSkill(e.target.value);}} value={currentSkill}/><div id='pj-skill_add' onClick={()=>{SkillAdd()}}>추가</div></div>

          <div id='pg-added_skill'>
            {skillList.map((name, index) => (
              <div key={index}>
                {name}<div onClick={()=> {
                  setSkillList(skillList.filter(skill => skill !== name));
                }}>×</div>
              </div>
            ))}
          </div>
        </div>

        <div id='pj-day'>
          <span>프로젝트 기한</span>
          <input type='date' onChange={(e)=>{setCurrentProjcet({...currentProject, pjdeadline:e.target.value})}}></input>
        </div>

        <div id='pj-pCount'>
          <div><span>예상 모집 인원</span><span id='boninpoham'>· 본인포함</span></div>
          <div id='pj-countBox'>
            <div id='pjc-minus' onClick={()=>{MinusClicked()}}>−</div>
            <span>{pjCount}명</span>
            <div id='pjc-plus' onClick={()=>{PlusClicked()}}>+</div>
          </div>
        </div>

        <div id='pj-SubmitOrNot'>
          <button id='pj-cancel' onClick={()=>{setLeftsideChose("탐색");}} type='button'>취소</button>
          <button id='pj-submit' onClick={PjAddSubmit} type='button'>프로젝트 생성하기</button>
        </div>
      </div>
    </div>
  )
}

function ProjectMore({clickedPj, setClickedPj, updateProject, setLeftsideChose, account, renderUserProfileImage}) {
  
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
          <span id='more-contents'>
            {clickedPj.pjcontents}
          </span>

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

            <button id='mright-submit' onClick={()=> {
              PjMemberAdd(account)
            }}>지원하기</button>
            <button id='mright-pmExcuse'>PM에게 문의하기</button>
          </div>

            <div id='mright-bottom'>
              {clickedPj.pjPerson && account.email === clickedPj.pjPerson?.[0]?.email ? <PmButtonSelect ProgressClick={ProgressClick} clickedPj={clickedPj}/> : ""}
            </div>
        </div>
      </div>
    </div>
  )
}

function PmButtonSelect({clickedPj, ProgressClick}) {

  return (
    <>
      {clickedPj.pjdone === true ? <PmReview/> : <PmExcuseButton ProgressClick={ProgressClick}/>}
    </>
  )
}

function PmExcuseButton({ProgressClick}) {
  
  return (
    <div id='excuse-box'>
      <span id='excuse-span'>PM 전용</span>
      <button 
      onClick={()=>{ProgressClick(3)}}>&#10003; 프로젝트 완료하기</button>
    </div>
  )
}

function PmReview() {

  return (
    <div id='review-box'>
      <span id='excuse-span'>PM 전용</span>
      <button 
      onClick={()=>{ProgressClick(3)}}>&#9733; 팀원 피드백 작성</button>
    </div>
  )
}

function AfterPj() {

  return (
    <>
    
    </>
  )
}

function ChatPage() {
  // 예시: 채팅방 목록 데이터
  const [chatRooms] = useState([
    { id: 1, name: "김태오 · PM", message: "주 2회, 화·목 저녁에 비대면...", time: "방금", unread: false },
    { id: 2, name: "급식앱 팀 채팅방", message: "진행 상황이 '진행중'으로 변경...", time: "2시간", unread: true },
  ]);

  const [activeRoomId, setActiveRoomId] = useState(1);

  // 예시: 현재 선택된 방의 메시지 내역 (내가 보낸 건 isMe: true)
  const [messages, setMessages] = useState([
    { id: 1, sender: "김태오 · PM", text: "지원 전 커피챗이에요 · 부담 없이 물어보세요", isMe: false, type: "text" },
    { id: 2, sender: "나", text: "안녕하세요! FE로 지원 생각 중인데 회의는 얼마나 자주 하나요?", isMe: true, type: "text" },
    { id: 3, sender: "김태오 · PM", text: "주 2회, 화·목 저녁으로 비대면으로 해요. 부담 크지 않아요!", isMe: false, type: "text" },
    { id: 4, sender: "system", text: "진행 상황이 '진행중'으로 변경됐어요", isMe: false, type: "system" },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 메시지 추가 로직 (나중에 백엔드/웹소켓 연결 시 이 부분 수정)
    setMessages([
      ...messages,
      { id: Date.now(), sender: "나", text: inputText, isMe: true, type: "text" }
    ]);
    setInputText("");
  };

  return (
    <div id="chat-container">
      {/* 1. 좌측 채팅방 목록 */}
      <div id="chat-sidebar">
        <h2>채팅</h2>
        <div id="room-list">
          {chatRooms.map((room) => (
            <div 
              key={room.id} 
              className={`room-item ${activeRoomId === room.id ? "active" : ""}`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div className="room-avatar">태</div>
              <div className="room-info">
                <div className="room-top">
                  <span className="room-name">{room.name}</span>
                  <span className="room-time">{room.time}</span>
                </div>
                <p className="room-preview">{room.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 우측 대화창 영역 */}
      <div id="chat-main">
        {/* 우측 상단 헤더 */}
        <div id="chat-header">
          <div className="room-avatar">태</div>
          <div className="chat-header-info">
            <h3>김태오 · PM</h3>
            <span><span className="status-dot"></span> 온라인 · 지원 전 커피챗</span>
          </div>
        </div>

        {/* 메시지 스크롤 영역 */}
        <div id="chat-messages">
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="message-system">
                  <span>🔄 {msg.text}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`message-row ${msg.isMe ? "me" : "other"}`}>
                <div className="bubble">
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 입력 및 템플릿 영역 */}
        <div id="chat-bottom">
          <form id="chat-input-box" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="메시지를 입력하세요…" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" id="send-btn">↑</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TeamRPage() {
  return (
    <>
    </>
  )
}

function MyPage({ account, setAccount }) {
  const [isEditing, setIsEditing] = useState(false);

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

  // 이메일 앞부분을 아이디처럼 사용
  const userId = account.email ? account.email.split('@')[0] : 'user';
  
  // 프로필 이미지가 없을 때 텍스트 아바타
  const avatarText = account.name && account.name.length >= 3 
    ? account.name.charAt(1) 
    : (account.name ? account.name.charAt(0) : '👤');

  return (
    <div className="mypage-container">
      {/* 상단 프로필 헤더 카드 */}
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

          <div className="grid-card action-card">
            <div className="action-info">
              <h4>받은 피드백 보기 <span className="star-rating">⭐ 4.8</span></h4>
              <p>완료 프로젝트에서 12개</p>
            </div>
            <span className="arrow-icon">›</span>
          </div>

          <div className="grid-card action-card">
            <div className="action-info">
              <h4>알림 설정</h4>
              <p>전공 · 키워드 필터 알림</p>
            </div>
            <span className="arrow-icon">›</span>
          </div>
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
              } : {}}
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