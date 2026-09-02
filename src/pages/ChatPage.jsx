import { useState } from 'react'

function ChatPage() {
  // 예시: 채팅방 목록 데이터
  const [chatRooms] = useState([
    { id: 1, name: "김태오 · PM", message: "주 2회, 화·목 저녁에 비대면...", time: "방금", unread: false },
    { id: 2, name: "급식앱 팀 채팅방", message: "진행 상황이 '진행중'으로 변경...", time: "2시간", unread: true },
  ]);

  const [activeRoomId, setActiveRoomId] = useState(1);

  // 예시: 현재 선택된 방의 메시지 내역 (내가 보낸 건 isMe: true)
  const [messages, setMessages] = useState([
    { id: 1, sender: "김태오 · PM", text: "지원 전 커피챗이에요 · 부담 없이 물어보세요", isMe: false, type: "text" },
    { id: 2, sender: "나", text: "안녕하세요! FE로 지원 생각 중인데 회의는 얼마나 자주 하나요?", isMe: true, type: "text" },
    { id: 3, sender: "김태오 · PM", text: "주 2회, 화·목 저녁으로 비대면으로 해요. 부담 크지 않아요!", isMe: false, type: "text" },
    { id: 4, sender: "system", text: "진행 상황이 '진행중'으로 변경됐어요", isMe: false, type: "system" },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 메시지 추가 로직 (나중에 백엔드/웹소켓 연결 시 이 부분 수정)
    setMessages([
      ...messages,
      { id: Date.now(), sender: "나", text: inputText, isMe: true, type: "text" }
    ]);
    setInputText("");
  };

  return (
    <div id="chat-container">
      {/* 1. 좌측 채팅방 목록 */}
      <div id="chat-sidebar">
        <h2>채팅</h2>
        <div id="room-list">
          {chatRooms.map((room) => (
            <div 
              key={room.id} 
              className={`room-item ${activeRoomId === room.id ? "active" : ""}`}
              onClick={() => setActiveRoomId(room.id)}
            >
              <div className="room-avatar">태</div>
              <div className="room-info">
                <div className="room-top">
                  <span className="room-name">{room.name}</span>
                  <span className="room-time">{room.time}</span>
                </div>
                <p className="room-preview">{room.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 우측 대화창 영역 */}
      <div id="chat-main">
        {/* 우측 상단 헤더 */}
        <div id="chat-header">
          <div className="room-avatar">태</div>
          <div className="chat-header-info">
            <h3>김태오 · PM</h3>
            <span><span className="status-dot"></span> 온라인 · 지원 전 커피챗</span>
          </div>
        </div>

        {/* 메시지 스크롤 영역 */}
        <div id="chat-messages">
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="message-system">
                  <span>🔄 {msg.text}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`message-row ${msg.isMe ? "me" : "other"}`}>
                <div className="bubble">
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 입력 및 템플릿 영역 */}
        <div id="chat-bottom">
          <form id="chat-input-box" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="메시지를 입력하세요…" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" id="send-btn">↑</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
