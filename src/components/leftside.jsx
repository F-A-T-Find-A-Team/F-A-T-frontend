import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

function MainPage({
  account = {},
  setAccount,
  leftsideChose,
  setLeftsideChose,
  renderUserProfileImage
}) {
  const [localLeftsideChose, setLocalLeftsideChose] = useState('탐색')
  const currentLeftsideChose = leftsideChose ?? localLeftsideChose
  const updateLeftsideChose = setLeftsideChose ?? setLocalLeftsideChose

  return (
    <div id='main-background'>
      <div id='main-leftside'>
        <h1 id='main-title'>F.A.T.</h1>
        <Link id='main-search' className={currentLeftsideChose === '탐색' || currentLeftsideChose === '프젝자세히' ? 'active' : ''} to="/search" onClick={() => updateLeftsideChose('탐색')}><div></div>탐색</Link>
        <Link id='main-pj_create' className={currentLeftsideChose === '프로젝트 생성' ? 'active' : ''} to="/create" onClick={() => updateLeftsideChose('프로젝트 생성')}><div></div>프로젝트 생성</Link>
        <Link id='main-chat' className={currentLeftsideChose === '채팅' ? 'active' : ''} to="/chat" onClick={() => updateLeftsideChose('채팅')}><div></div>채팅</Link>
        <Link id='main-team_recommend' className={currentLeftsideChose === 'AI 팀원 추천' ? 'active' : ''} to="/team" onClick={() => updateLeftsideChose('AI 팀원 추천')}><div></div>AI 팀원 추천</Link>
        <Link id='main-mypage' className={currentLeftsideChose === '마이페이지' ? 'active' : ''} to="/mypage" onClick={() => updateLeftsideChose('마이페이지')}><div></div>마이페이지</Link>

        <div id='main-userProfile'>
          {renderUserProfileImage ? renderUserProfileImage('main-profileImage') : null}
          <div id='user_inform'>
            <span id='main-userName'>{account.name}</span>
            <span id='main-userNumber'>{account.number}{account.jungong ? `·${account.jungong}` : ''}</span>
          </div>
        </div>
      </div>

      <div id='main-rightside' className={currentLeftsideChose === '채팅' || currentLeftsideChose === '마이페이지' ? 'onChat' : ''}>
        <Outlet context={{
          setLeftsideChose: updateLeftsideChose,
          renderUserProfileImage,
          account,
          setAccount,
          pjList: [],
          setPjList: () => {},
          clickedPj: { pjPerson: [] },
          setClickedPj: () => {},
          updateProject: () => {}
        }} />
      </div>
    </div>
  )
}

export default MainPage