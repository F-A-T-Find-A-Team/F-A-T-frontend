import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../API/api.js'

function SignupPage() {
  const navigate = useNavigate()
  const [gender, setGender] = useState('남')
  const [major, setMajor] = useState('FE')
  const [intro, setIntro] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const fileInputRef = useRef(null)

  const addSkill = (event) => {
    event?.preventDefault()
    const skill = currentSkill.trim()
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setCurrentSkill('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.endsWith('@dsm.hs.kr')) {
      alert('학교 이메일(@dsm.hs.kr) 형식으로만 가입할 수 있습니다!')
      return
    }

    try {
        await api.post('/signup', {
        userName: name,
        userEmail: email,
        userPassword: password,
        introduce: intro,
        image: profileImage,
        userStudentNumber: email.slice(4, 8),
        userMajor: major,
        userGender: gender,
        interestStacks: skills
      })
      navigate('/signup/verify', { state: { userEmail: email } })
    } catch (error) {
      alert('회원가입 중 오류 발생')
      console.log('회원가입 에러:', error)
    }
  }

  return (
    <form id='Login_box' onSubmit={handleSubmit}>
      <div id='leftside_block'></div>
      <div id='Login-leftside'>
        <h1>F.A.T.</h1>
        <div>
          <h2>전공과 기술 스택으로<br />팀을 찾는 곳</h2>
          <span>아이디어부터 완성까지, 프로젝트를 함께할 사람을<br />만나보세요.</span>
        </div>
        <p>© 2026 DSM · F.A.T</p>
      </div>
      <div id='Sign-rightside'>
        <div id='Sign_box'>
            <h2 onClick={() => navigate('/login')}>&lt; 회원가입</h2>
            <span>프로필을 설정하고 팀을 찾아보세요</span>
            <div id='sign_profile'>
            <input type='file' ref={fileInputRef} onChange={(event) => setProfileImage(event.target.files[0])} accept='image/*' style={{ display: 'none' }} />
            <div id='profile_photo' onClick={() => fileInputRef.current.click()}>사진</div>
            <div id='sign_input_box'>
                <input className='sign_input' placeholder='이름' required value={name} onChange={(event) => setName(event.target.value)} />
                <input className='sign_input' placeholder='이메일(ex: mte@dsm.hs.kr)' type='email' required value={email} onChange={(event) => setEmail(event.target.value)} />
                <input className='sign_input' type='password' placeholder='비밀번호' required value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
        </div>
        <div id='introduce_box'>
            <div><span>자기소개 </span><span id='introduce_count'>{intro.length}/100</span></div>
            <div id='introduce_area' contentEditable='true' onInput={(event) => setIntro(event.currentTarget.textContent.slice(0, 100))}></div>
          </div>
          <div id='sign_gender'><span>성별</span><div id='gender_selector'>{['남', '여'].map((value) => <button key={value} className={gender === value ? 'active' : ''} onClick={() => setGender(value)} type='button'>{value}</button>)}</div></div>
          <div id='sign_jungong'><span>내 전공 </span><span id='jungong_inform'>(1개)</span><div id='jungong_selector'>{['FE', 'BE', 'EM(FW)', 'EM(HW)', 'Flutter', 'android', 'iOS', 'UI', 'Game', 'security', 'AI'].map((value) => <button key={value} className={major === value ? 'active' : ''} onClick={() => setMajor(value)} type='button'>{value}</button>)}</div></div>
          <div id='sign_skill'>
            <div style={{ marginBottom: '12px' }}><span>관심 기술 스택</span><span className='pj-free'> · 자유 입력</span></div>
            <div className='remake-skill-input-row'><input className='remake-input' placeholder='기술을 입력하고 Enter (예: Next.js)' value={currentSkill} onChange={(event) => setCurrentSkill(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addSkill(event)} /><button type='button' className='remake-add-btn' onClick={addSkill}>추가</button></div>
            <div className='remake-skill-list'>{skills.map((skill) => <div key={skill} className='remake-skill-chip'>{skill}<button type='button' className='remake-skill-delete' onClick={() => setSkills(skills.filter((item) => item !== skill))}>×</button></div>)}</div>
          </div>
          <button id='sign_done_button' type='submit'>가입하고 시작하기</button>
        </div>
      </div>
    </form>
  )
}

export default SignupPage