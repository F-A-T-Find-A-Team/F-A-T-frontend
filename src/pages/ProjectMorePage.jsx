import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import basicProfile from '../assets/snake.webp'
import { api } from '../API/api.js'

const progressByStatus = { IDEA: 1, IN_PROGRESS: 2, COMPLETED: 3 }

function normalizeProject(project, currentProject = {}) {
  return {
    ...currentProject,
    ...project,
    projectId: project.projectId ?? project.id ?? currentProject.projectId,
    pjtitle: project.projectTitle ?? project.pjtitle ?? currentProject.pjtitle,
    pjcontents: project.projectDescription ?? project.pjcontents ?? currentProject.pjcontents,
    pjdeadline: project.projectDeadline ?? project.pjdeadline ?? currentProject.pjdeadline,
    pjJungong: project.requiredMajors ?? project.pjJungong ?? currentProject.pjJungong ?? [],
    pjskill: project.requiredStacks ?? project.pjskill ?? currentProject.pjskill ?? [],
    pjPerson: project.members ?? project.pjPerson ?? currentProject.pjPerson ?? [],
    pjcount: project.maxMembers ?? project.pjcount ?? currentProject.pjcount,
    pjpersonCount: project.memberCount ?? project.pjpersonCount ?? currentProject.pjpersonCount,
    pjprogress: project.pjprogress ?? progressByStatus[project.projectStatus] ?? currentProject.pjprogress ?? 1,
    pjdone: project.pjdone ?? project.projectStatus === 'COMPLETED'
  }
}

function getDDay(deadline, isDone) {
  if (isDone) return '마감됨'
  if (!deadline) return '무기한'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(deadline)
  targetDate.setHours(0, 0, 0, 0)
  const diffInDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))

  if (diffInDays > 0) return `D-${diffInDays}`
  if (diffInDays === 0) return '오늘 마감'
  return '마감됨'
}

function ProjectMorePage() {
  const { clickedPj, setClickedPj, updateProject, setLeftsideChose, account, renderUserProfileImage } = useOutletContext()
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const project = clickedPj?.projectId?.toString() === projectId ? clickedPj : null

  useEffect(() => {
    let isMounted = true

    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`)
        if (isMounted) setClickedPj((currentProject) => normalizeProject(response.data, currentProject))
      } catch (error) {
        console.error('프로젝트 상세 조회에 실패했습니다.', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchProject()
    return () => { isMounted = false }
  }, [projectId, setClickedPj])

  const handleBack = () => {
    setLeftsideChose('탐색')
    navigate('/search')
  }

  const handleProgressChange = async (value) => {
    if (account.email !== project?.pjPerson?.[0]?.email) {
      alert('PM만 변경할 수 있어요.')
      return
    }

    const statusByProgress = { 1: 'IDEA', 2: 'IN_PROGRESS', 3: 'COMPLETED' }
    const status = statusByProgress[value]
    if (!status || !project?.projectId) return

    try {
      await api.patch(`/projects/${project.projectId}/status`, { status })
      updateProject({
        ...project,
        projectStatus: status,
        pjprogress: value,
        pjdone: value === 3
      })
    } catch (error) {
      console.error('진행도 수정 중 오류 발생', error)
      alert('진행도 수정 중 오류가 발생했습니다.')
    }
  }

  if (isLoading) return <div id='more-box'>프로젝트를 불러오는 중...</div>
  if (!project) return <div id='more-box'>프로젝트를 찾을 수 없습니다.</div>

  const isProjectManager = project.pjPerson?.[0]?.email === account.email

  return (
    <div id='more-box'>
      <div id='more-leftside'>
        <span id='more-gotosearch' onClick={handleBack}>&lt; 탐색으로</span>
        <h2>{project.pjtitle}</h2>
        <div id='more-userProfile'>
          {renderUserProfileImage('moreProfile')}
          <span>{project.pjPerson?.[0]?.name || account.name}</span>
          <span id='PM'>PM</span>
        </div>

        <ProjectProgress project={project} onChange={handleProgressChange} />

        <div className='more-contentsBox'>
          <span>상세 내용</span>
          <span id='more-contents'>{project.pjcontents}</span>
        </div>
        <div className='more-contentsBox'>
          <span>필요 전공</span>
          <div id='more-jungongBox'>
            {project.pjJungong.map((major) => <span key={major} className={major}>{major}</span>)}
          </div>
        </div>
        <div className='more-contentsBox'>
          <span>기술 스택</span>
          <div id='more-skillBox'>
            {project.pjskill.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      </div>

      <div id='more-rightside'>
        <div id='more-rightBox'>
          <div id='mright-header'>
            <div id='mright-end'>
              <span>{getDDay(project.pjdeadline, project.pjdone)}</span>
              <span className='mright-ex'>마감</span>
            </div>
            <div id='mright-mojib'>
              <span>{project.pjpersonCount}/{project.pjcount}</span>
              <span className='mright-ex'>모집</span>
            </div>
          </div>

          <div id='mright-box'>
            <span>현재 팀원</span>
            <div id='mright-teamBox'>
              {project.pjPerson.map((person) => <TeamProfile key={person.email} person={person} />)}
            </div>
            <button id='mright-submit' onClick={() => handleMemberApply(project, account)}>지원하기</button>
            <button id='mright-pmExcuse'>PM에게 문의하기</button>
          </div>

          {isProjectManager && (
            <div id='mright-bottom'>
              {project.pjdone
                ? <PmReview onOpen={() => setIsFeedbackModalOpen(true)} />
                : <PmComplete onComplete={() => handleProgressChange(3)} />}
            </div>
          )}
        </div>
      </div>

      {isFeedbackModalOpen && (
        <FeedbackModal
          project={project}
          onClose={() => setIsFeedbackModalOpen(false)}
          updateProject={updateProject}
        />
      )}
    </div>
  )
}

function ProjectProgress({ project, onChange }) {
  return (
    <div id='more-progressBox'>
      <span>진행 단계</span>
      <div id='more-progress'>
        <ProgressStep id='progress-idea' label='아이디어' value={1} project={project} onChange={onChange} />
        <div className={`progress-way ${project.pjprogress >= 2 ? 'active' : ''}`}></div>
        <ProgressStep id='progress-jinhaeng' label='진행중' value={2} project={project} onChange={onChange} />
        <div className={`progress-way ${project.pjprogress >= 3 ? 'active' : ''}`}></div>
        <ProgressStep id='progress-done' label='완성' value={3} project={project} onChange={onChange} />
      </div>
      <span id='more-inform'>단계를 누르면 상태가 바뀌어요. <span>완성</span>으로 바꾸면 레주메북 연동·피드백 창이 자동으로 떠요.</span>
    </div>
  )
}

function ProgressStep({ id, label, value, project, onChange }) {
  return (
    <div id={id} className={`${project.pjprogress >= value ? 'active' : ''} ${project.pjprogress === value ? 'cactive' : ''}`}>
      <div onClick={() => onChange(value)}>{value}</div>
      <span>{label}</span>
    </div>
  )
}

function TeamProfile({ person }) {
  return (
    <div
      id='mright-profiles'
      style={{
        backgroundImage: `url(${person.image || basicProfile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'transparent'
      }}
    />
  )
}

function handleMemberApply(project, account) {
  if (project.pjPerson?.some((person) => person.email === account.email)) {
    alert('이미 팀에 참여한 멤버입니다.')
    return
  }
  if (project.pjPerson?.length >= project.pjcount) {
    alert('모집 인원이 마감되었습니다.')
    return
  }
  alert('지원 API의 요청 형식이 아직 확정되지 않았습니다.')
}

function PmComplete({ onComplete }) {
  return (
    <div id='excuse-box'>
      <span id='excuse-span'>PM 전용</span>
      <button onClick={onComplete}>&#10003; 프로젝트 완료하기</button>
    </div>
  )
}

function PmReview({ onOpen }) {
  return (
    <div id='review-box'>
      <span id='excuse-span'>PM 전용</span>
      <button onClick={onOpen}>&#9733; 팀원 피드백 작성</button>
    </div>
  )
}

function FeedbackModal({ project, onClose, updateProject }) {
  const [feedbacks, setFeedbacks] = useState(project.feedbacks || {})

  const updateFeedback = (email, field, value) => {
    setFeedbacks((currentFeedbacks) => ({
      ...currentFeedbacks,
      [email]: { ...(currentFeedbacks[email] || {}), [field]: value }
    }))
  }

  const handleSubmit = async () => {
    const feedbackEntries = Object.entries(feedbacks).filter(([, feedback]) => feedback.comment?.trim())
    const feedbackRequests = feedbackEntries.map(([email, feedback]) => {
      const member = project.pjPerson?.find((person) => person.email === email)
      const targetUserId = member?.userId ?? member?.id
      if (!targetUserId) return null
      return api.post(`/projects/${project.projectId}/feedbacks`, {
        targetUserId,
        content: feedback.comment
      })
    }).filter(Boolean)

    if (feedbackRequests.length !== feedbackEntries.length) {
      alert('일부 팀원의 사용자 ID가 없어 피드백을 전송할 수 없습니다.')
      return
    }

    try {
      await Promise.all(feedbackRequests)
      updateProject({ ...project, feedbacks })
      alert('피드백이 성공적으로 저장되었습니다!')
      onClose()
    } catch (error) {
      console.error('피드백 작성 중 오류 발생', error)
      alert('피드백 작성 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='feedback-modal-overlay'>
      <div className='feedback-modal-content'>
        <div className='feedback-modal-header'>
          <div className='feedback-header-title'>
            <h3>팀원 피드백</h3>
            <p>함께한 팀원에게 별점과 한 줄 피드백을 남겨주세요.</p>
          </div>
          <button className='feedback-close-btn' onClick={onClose}>×</button>
        </div>
        <div className='feedback-modal-body'>
          {project.pjPerson?.map((member, index) => {
            const memberFeedback = feedbacks[member.email] || { rating: 0, comment: '' }
            const displayRole = index === 0 ? `PM${member.jungong ? ` · ${member.jungong}` : ''}` : (member.jungong || '팀원')
            const profileStyle = {
              backgroundImage: `url(${member.image || basicProfile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }

            return (
              <div key={member.email} className='feedback-member-card'>
                <div className='feedback-member-info'>
                  <div className='feedback-avatar' style={profileStyle}></div>
                  <div className='feedback-details'>
                    <span className='feedback-name'>{member.name}</span>
                    <span className='feedback-role'>{displayRole}</span>
                  </div>
                </div>
                <div className='feedback-stars'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${memberFeedback.rating >= star ? 'filled' : ''}`}
                      onClick={() => updateFeedback(member.email, 'rating', star)}
                    >★</span>
                  ))}
                </div>
                <input
                  type='text'
                  className='feedback-input'
                  placeholder='예: 커뮤니케이션이 정확하고 마감을 잘 지켰어요'
                  value={memberFeedback.comment || ''}
                  onChange={(event) => updateFeedback(member.email, 'comment', event.target.value)}
                />
              </div>
            )
          })}
        </div>
        <div className='feedback-modal-footer'>
          <button className='feedback-submit-btn' onClick={handleSubmit}>피드백 제출하기</button>
        </div>
      </div>
    </div>
  )
}

export default ProjectMorePage
