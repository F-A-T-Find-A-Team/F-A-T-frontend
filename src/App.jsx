import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { api } from './API/api.js'

import './App.css'
import './ChatPage.css'
import './MyPage.css'

import Leftside from './components/leftside.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import PjcreatePage from './pages/PjcreatePage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import MyPage from './pages/MyPage.jsx'
import X from './pages/X.jsx'


function App() {
  const [account, setAccount] = useState({
    name: 'BigBoss',
    email: '20261013@dsm.hs.kr',
    number: '1013',
    jungong: 'FE',
    gender: '남',
    introduce: 'I am BigBoss, and you are too',
    skills: ['sold the world', 'stealth']
  })
  const [isLogin, setIsLogin] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [leftsideChose, setLeftsideChose] = useState('탐색')
  const [pjList, setPjList] = useState([])
  const [clickedPj, setClickedPj] = useState({ pjPerson: [] })

  useEffect(() => {
    if (!isLogin) return;

    const fetchProject = async () => {
      try {
        let response;
        try {
          response = await api.get('/projects');
        } catch (error) {
          if (error.response?.status !== 404) throw error;
          response = await api.get('/project');
        }
        const projects = Array.isArray(response.data) 
          ? response.data
          : response.data?.projects ?? [];
        setPjList(projects.map((project) => ({
          ...project,
          projectId: project.projectId ?? project.id,
          pjtitle: project.pjtitle ?? project.projectTitle,
          pjcontents: project.pjcontents ?? project.projectDescription,
          pjdeadline: project.pjdeadline ?? project.projectDeadline,
          pjJungong: project.pjJungong ?? project.requiredMajors,
          pjskill: project.pjskill ?? project.requiredStacks,
          pjPerson: project.pjPerson ?? project.members ?? [],
          pjcount: project.pjcount ?? project.maxMembers,
          pjpersonCount: project.pjpersonCount ?? project.memberCount,
          pjprogress: project.pjprogress ?? ({ IDEA: 1, IN_PROGRESS: 2, COMPLETED: 3 }[project.projectStatus] ?? 1),
          pjdone: project.pjdone ?? project.projectStatus === 'COMPLETED'
        })));
      } catch(error) {
        console.log("프로젝트 목록을 불러오는데 실패",error);
      }
    }

    fetchProject();

    const fetchAccount = async () => {
      try {
        const response = await api.get('/mypage');
        const user = response.data;
        setAccount((currentAccount) => ({
          ...currentAccount,
          name: user.userName ?? currentAccount.name,
          email: user.userEmail ?? currentAccount.email,
          gender: user.userGender ?? currentAccount.gender,
          jungong: user.userMajor ?? currentAccount.jungong,
          skills: user.interestStacks ?? currentAccount.skills,
          userId: user.userId ?? currentAccount.userId,
          number: user.userStudentNumber ?? currentAccount.number,
          githubUsername: user.githubUsername ?? currentAccount.githubUsername
        }));
      } catch (error) {
        console.log('내 정보를 불러오는데 실패', error);
      }
    };

    fetchAccount();
  }, [isLogin])

  const updateProject = (updatedProject) => {
    setClickedPj(updatedProject);
    setPjList((previousProjects) => previousProjects.map((project) => (
      project.projectId === updatedProject.projectId
        ? { ...project, ...updatedProject }
        : project
    )));
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLogin ? <Navigate to="/" replace /> : (
              <div className="bg-login" id="body">
                <LoginPage setisLogin={setIsLogin} setAccount={setAccount} />
              </div>
            )
          }
        />
        <Route
          path="/"
          element={
            isLogin ? (
              <div className="bg-main" id="body" data-theme={isDarkMode ? 'dark' : 'light'}>
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
                />
              </div>
            ) : <Navigate to="/login" replace />
          }
        >
          <Route index element={<SearchPage leftsideChose={leftsideChose} setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} clickedPj={clickedPj} updateProject={updateProject} renderUserProfileImage={renderUserProfileImage} account={account} />} />
          <Route path="search" element={<SearchPage leftsideChose={leftsideChose} setLeftsideChose={setLeftsideChose} pjList={pjList} setClickedPj={setClickedPj} clickedPj={clickedPj} updateProject={updateProject} renderUserProfileImage={renderUserProfileImage} account={account} />} />
          <Route path="create" element={<PjcreatePage setLeftsideChose={setLeftsideChose} pjList={pjList} setPjList={setPjList} account={account} />} />
          <Route path="chat" element={<ChatPage account={account} />} />
          <Route path="mypage" element={<MyPage account={account} setAccount={setAccount} pjList={pjList} />} />
          <Route path="x" element={<X />} />
        </Route>
        <Route path="*" element={<Navigate to={isLogin ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App  