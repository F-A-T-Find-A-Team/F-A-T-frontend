import { useState, useRef } from 'react'
import './App.css'
import githubIcon from './assets/github.webp'
import basicProfile from './assets/snake.webp'

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
      {emailconfirm ? <EmailConfirm setEmailconfirm={setEmailconfirm} userEmail={userEmail}/> : <SignPage setIsSign={setIsSign} setisLogin={setisLogin} setAccount={setAccount} setEmailconfirm={setEmailconfirm} setUserEmail={setUserEmail}/>}
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
      jungong: jungongSelect
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
              <input className='sign_input' type='password' placeholder='비밀번호' onChange={(e)=>{setUserPw(e.target.value);}}></input>
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
          
          <button id='sign_done_button' type='submit'>가입하고 시작하기</button>
        </div>
      </div>
    </form>
  )
}

function EmailConfirm({setEmailconfirm, userEmail}) {
  return (
    <div id='Login_box'>
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
          <h2>이메일 인증</h2>
          <div id='Email-spanBox'>
            <span>{userEmail}</span><span>로 6자리 코드를 보냈어요.</span>
          </div>

          <div id='Email-confirmBox'>
            <div id='Email-timeBox'>
              <span>인증번호</span>

              <span>10:13</span>
            </div>

            <input id='Email-numberBox'></input>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainPage({setisLogin, account, setAccount}) {
  
  const [leftsideChose, setLeftsideChose] = useState("탐색");
  const [pjList, setPjList] = useState([]);
  const [clickedPj, setClickedPj] = useState({});
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
            <span id='main-userNumber'>{account.number}·{account.jungong}</span>
          </div>
        </div>
      </div>
      
      <div id='main-rightside'>
        <div style={{ display: leftsideChose === "탐색" ? "block" : "none", width: "100%", height: "100%" }}>
          <SearchPage setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} renderUserProfileImage={renderUserProfileImage} account={account}/>
        </div>
        <div style={{ display: leftsideChose === "프젝자세히" ? "block" : "none", width: "100%", height: "100%" }}>
          <ProjectMore clickedPj={clickedPj} setClickedPj={setClickedPj} setLeftsideChose={setLeftsideChose} account={account} renderUserProfileImage={renderUserProfileImage}/>
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
          <MyPage/>
        </div>
      </div>
    </div>
  )
}

function SearchPage({setLeftsideChose, pjList, setClickedPj, renderUserProfileImage, account}) {
  
  const [currentSearch, setCurrentSearch] = useState("전체");

  const getDDay = (deadlineStr) => {
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
            <div>{getDDay(project.pjdeadline)}</div>
          </div>

          <div id='search-userProfile'>
            {renderUserProfileImage("pjProfile")}
            <span>{account.name}</span>
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
      pjPerson : [account]
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
          <div><span>기술 스택</span><span id='pj-free'> · 자유입력</span></div>
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

function ProjectMore({clickedPj, setClickedPj, setLeftsideChose, account, renderUserProfileImage}) {
  
  function ProgressClick(value) {
    setClickedPj({...clickedPj,pjprogress:value})
  }

  const getDDay = (deadlineStr) => {
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
          {!Pj.image && Pj.name}
        </div>
      );
    };

  const PjMemberAdd = (newMember) => {

    const isAlreadyMember = clickedPj.pjPerson.some(
      (person) => person.email === newMember.email
    );

    if (isAlreadyMember) {
      alert("이미 팀에 참여한 멤버입니다.");
      return;
    }

    if (clickedPj.pjPerson.length >= clickedPj.pjcount) {
      alert("모집 인원이 마감되었습니다.");
      return;
    }

    setClickedPj({...clickedPj,
      pjpersonCount: clickedPj.pjPerson.length + 1,
      pjPerson: [...clickedPj.pjPerson, newMember]
    })
  }

  return (
    <div id='more-box'>
      <div id='more-leftside'>
        <span id='more-gotosearch' onClick={()=>{setLeftsideChose("탐색");}}>&lt; 탐색으로</span>
        <h2>{clickedPj.pjtitle}</h2>
        <div id='more-userProfile'>
          {renderUserProfileImage("moreProfile")}
          <span>{account.name}</span>
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
              <span>{getDDay(clickedPj.pjdeadline)}</span>
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
                renderTeamProfileImage(`mright-profiles-${i}`, person)
              ))}
            </div>

            <button id='mright-submit' onClick={()=> {
              PjMemberAdd(account)
            }}>지원하기</button>
            <button id='mright-pmExcuse'>PM에게 문의하기</button>
          </div>

            <div id='mright-bottom'>
              {clickedPj.pjPerson && account === clickedPj.pjPerson[0] ? <PmExcuseButton/> : ""}
            </div>
        </div>
      </div>
    </div>
  )
}

function PmExcuseButton() {
  
  return (
    <div id='excuse-box'>
      <span id='excuse-span'>PM 전용</span>
      <button>&#10003; 프로젝트 완료하기</button>
    </div>
  )
}

function ChatPage() {
  return (
    <>
    </>
  )
}

function TeamRPage() {
  return (
    <>
    </>
  )
}

function MyPage() {
  return (
    <>
    
    </>
  )
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