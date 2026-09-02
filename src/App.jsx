import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './ChatPage.css'
import './MyPage.css'

import Leftside from './components/leftside.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import PjcreatePage from './pages/PjcreatePage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import MyPage from './pages/MyPage.jsx'

function App() {
  const [account, setAccount] = useState({
    name: 'BigBoss',
    email: '20261013@dsm.hs.kr',
    number: '2026',
    jungong: 'FE',
    gender: '중성',
    introduce: 'I am BigBoss, and you are too',
    skills: ['sold the world', 'stealth']
  })
  const [isLogin, setIsLogin] = useState(false)
  const [leftsideChose, setLeftsideChose] = useState('탐색')
  const [pjList, setPjList] = useState([])
  const [clickedPj, setClickedPj] = useState({ pjPerson: [] })

  const updateProject = (updatedPj) => {
    setClickedPj(updatedPj)
    setPjList((prev) =>
      prev.map((pj) => (pj.pjtitle === updatedPj.pjtitle ? updatedPj : pj))
    )
  }

  const renderUserProfileImage = (id, profileUser = account) => {
    return (
      <div
        id={id}
        style={
          profileUser?.image
            ? {
                backgroundImage: `url(${profileUser.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent'
              }
            : {
                backgroundImage: 'url(/src/assets/snake.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent'
              }
        }
      >
        {!profileUser?.image && profileUser?.name}
      </div>
    )
  }

  if (!isLogin) {
    return (
      <BrowserRouter>
        <div className="bg-login" id="body">
          <LoginPage setisLogin={setIsLogin} setAccount={setAccount} />
        </div>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="bg-main" id="body">
        <Routes>
          <Route
            path="/"
            element={
              <Leftside
                account={account}
                setAccount={setAccount}
                leftsideChose={leftsideChose}
                setLeftsideChose={setLeftsideChose}
                renderUserProfileImage={renderUserProfileImage}
                pjList={pjList}
                setPjList={setPjList}
                clickedPj={clickedPj}
                setClickedPj={setClickedPj}
                updateProject={updateProject}
              />
            }
          >
            <Route index element={<SearchPage setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} renderUserProfileImage={renderUserProfileImage} account={account} />} />
            <Route path="search" element={<SearchPage setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} renderUserProfileImage={renderUserProfileImage} account={account} />} />
            <Route path="create" element={<PjcreatePage setLeftsideChose={setLeftsideChose} pjList={pjList} setPjList={setPjList} account={account} />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="mypage" element={<MyPage account={account} setAccount={setAccount} pjList={pjList} />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App