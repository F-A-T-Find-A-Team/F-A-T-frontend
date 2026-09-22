import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailVerificationPage({ setisLogin }) {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(180)
  const inputRefs = useRef([])

  useEffect(() => {
    if (timeLeft === 0) return undefined
    const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleVerify = (event) => {
    event.preventDefault()
    if (code.join('').length < 6) {
      alert('6자리 인증번호를 모두 입력해주세요.')
      return
    }
    alert('인증이 완료되었습니다!')
    setisLogin(true)
    navigate('/search', { replace: true })
  }

  const updateCode = (index, value) => {
    const digit = value.replace(/[^0-9]/g, '')
    const nextCode = [...code]
    nextCode[index] = digit
    setCode(nextCode)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  return (
    <form onSubmit={handleVerify} id='Login_box'>
      <div id='leftside_block'></div>
      <div id='Login-leftside'><h1>F.A.T.</h1><div><h2>전공과 기술 스택으로<br />팀을 찾는 곳</h2><span>아이디어부터 완성까지, 프로젝트를 함께할 사람을<br />만나보세요.</span></div><p>© 2026 DSM · F.A.T</p></div>
      <div id='Email-rightside'><div id='Email-box'><div id='Email-logo'></div><h2 onClick={() => navigate('/signup')}>&lt; 이메일 인증</h2><div id='Email-spanBox'><span>{state?.userEmail || '학교 이메일'}</span><span>로 6자리 코드를 보냈어요.</span></div><div id='Email-confirmBox'><div id='Email-timeBox'><span>인증번호</span><span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span></div><div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '15px' }}>{code.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element }} type='text' maxLength={1} value={digit} onChange={(event) => updateCode(index, event.target.value)} />)}</div></div><button id='sign_done_button' type='submit' style={{ width: '100%', marginTop: '20px' }}>인증 확인</button></div></div>
    </form>
  )
}

export default EmailVerificationPage