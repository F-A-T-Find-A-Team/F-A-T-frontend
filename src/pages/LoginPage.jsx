import { useState, useRef, useEffect } from 'react'
import githubIcon from '../assets/github.webp'

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

  const addSkill = (e) => {
    if (e) e.preventDefault();
    if (currentSkill.trim() !== "" && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

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
      skills: skills
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

export default Sign;