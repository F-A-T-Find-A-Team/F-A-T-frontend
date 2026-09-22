import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import githubIcon from '../assets/github.webp'
import { api } from '../API/api.js'

function LoginPage({ setisLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await api.post('/login', { userEmail: email, password })
      setisLogin(true)
    } catch (error) {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      console.log('로그인 에러:', error)
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

      <div id='Login-rightside'>
        <button type='button' onClick={() => setisLogin(true)} style={{ position: 'fixed', right: 14, top: 14 }}>스키비야</button>
        <div id='Login-rightside-box'>
          <div>
            <h1>로그인</h1>
            <span>학교 이메일 계정으로 시작하세요</span>
          </div>
          <div id='email_box'>
            <span>학교 이메일</span><br />
            <input placeholder='mte@dsm.hs.kr' type='email' required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div id='email_box'>
            <span>비밀번호</span><br />
            <input type='password' required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button id='Login_button' type='submit'>로그인</button>
          <div id='gayjoygo'>계정이 없으신가요? <span id='gayib' onClick={() => navigate('/signup')}>회원가입</span></div>
        </div>
      </div>
    </form>
  )
}

export default LoginPage
