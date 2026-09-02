import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

function PjcreatePage({
  setLeftsideChose = () => {},
  pjList = [],
  setPjList = () => {},
  account = {}
}) {

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

    setCurrentProjcet({
      pjtitle : "",
      pjcontents : "",
      pjdeadline : "",
      pjcount : pjCount,
      pjprogress: 1,
      pjpersonCount: 1,
      pjPerson : [account],
      pjdone: false
    })

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
          <input onChange={(e)=>{setCurrentProjcet({...currentProject, pjtitle: e.target.value})}} value={currentProject.pjtitle}></input>
        </div>
        
        <div id='pjcreate-contents'>
          <span>상세 내용</span>
          <div id='pj-content_area' contentEditable="true" onInput={handleInput} value={currentProject.pjcontents}></div>
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
          <Link id='pj-cancel' onClick={()=>{setLeftsideChose("탐색");}} type='button' to='/search'>취소</Link>
          <Link id='pj-submit' onClick={PjAddSubmit} type='button' to='/search'>프로젝트 생성하기</Link>
        </div>
      </div>
    </div>
  )
}

export default PjcreatePage;