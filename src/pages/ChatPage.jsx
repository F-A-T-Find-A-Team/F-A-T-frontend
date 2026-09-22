import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../API/api.js'

const POLLING_INTERVAL = 5000;

const getRoomId = (room) => room.chatRoomId ?? room.roomId ?? room.id;
const getRoomName = (room) => room.roomName ?? room.name ?? room.title ?? '채팅방';
const getRoomPreview = (room) => room.lastMessage?.content ?? room.lastMessage ?? room.message ?? '새 채팅방';
const getRoomTime = (room) => room.lastMessage?.sentAt ?? room.updatedAt ?? room.sentAt ?? '';

const normalizeRooms = (data) => Array.isArray(data) ? data : data?.chatRooms ?? data?.rooms ?? [];
const normalizeMessages = (data) => Array.isArray(data) ? data : data?.messages ?? [];

function formatTime(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function ChatPage() {
  const { account = {} } = useOutletContext()
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [inputText, setInputText] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    api.get('/chat-rooms')
      .then((response) => {
        if (!isMounted) return;
        const rooms = normalizeRooms(response.data);
        setChatRooms(rooms);
        setActiveRoomId((currentRoomId) => currentRoomId ?? getRoomId(rooms[0]));
      })
      .catch((error) => {
        console.error('채팅방 목록 조회에 실패했습니다.', error);
        if (isMounted) setErrorMessage('채팅방 목록을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingRooms(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      return undefined;
    }

    let isMounted = true;
    const fetchMessages = (showLoading = false) => {
      if (showLoading) setIsLoadingMessages(true);
      return api.get(`/chat-rooms/${activeRoomId}/messages`)
        .then((response) => {
          if (isMounted) setMessages(normalizeMessages(response.data));
        })
        .catch((error) => {
          console.error('채팅 메시지 조회에 실패했습니다.', error);
          if (isMounted) setErrorMessage('메시지를 불러오지 못했습니다.');
        })
        .finally(() => {
          if (showLoading && isMounted) setIsLoadingMessages(false);
        });
    };

    fetchMessages(true);
    const pollingId = window.setInterval(fetchMessages, POLLING_INTERVAL);
    return () => {
      isMounted = false;
      window.clearInterval(pollingId);
    };
  }, [activeRoomId]);

  const handleSend = async (event) => {
    event.preventDefault();
    const content = inputText.trim();
    if (!content || !activeRoomId) return;

    try {
      await api.post(`/chat-rooms/${activeRoomId}/messages`, { content });
      setInputText('');
      const response = await api.get(`/chat-rooms/${activeRoomId}/messages`);
      setMessages(normalizeMessages(response.data));
      setErrorMessage('');
    } catch (error) {
      console.error('메시지 전송에 실패했습니다.', error);
      setErrorMessage('메시지를 전송하지 못했습니다.');
    }
  };

  const activeRoom = chatRooms.find((room) => getRoomId(room) === activeRoomId);

  return (
    <div id="chat-container">
      {/* 1. 좌측 채팅방 목록 */}
      <div id="chat-sidebar">
        <h2>채팅</h2>
        <div id="room-list">
          {isLoadingRooms && <p>채팅방을 불러오는 중...</p>}
          {!isLoadingRooms && chatRooms.length === 0 && <p>참여 중인 채팅방이 없습니다.</p>}
          {chatRooms.map((room) => (
            <div 
              key={getRoomId(room)} 
              className={`room-item ${activeRoomId === getRoomId(room) ? "active" : ""}`}
              onClick={() => setActiveRoomId(getRoomId(room))}
            >
              <div className="room-avatar">{getRoomName(room).charAt(0)}</div>
              <div className="room-info">
                <div className="room-top">
                  <span className="room-name">{getRoomName(room)}</span>
                  <span className="room-time">{formatTime(getRoomTime(room))}</span>
                </div>
                <p className="room-preview">{getRoomPreview(room)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 우측 대화창 영역 */}
      <div id="chat-main">
        {/* 우측 상단 헤더 */}
        <div id="chat-header">
          <div className="room-avatar">{activeRoom ? getRoomName(activeRoom).charAt(0) : '?'}</div>
          <div className="chat-header-info">
            <h3>{activeRoom ? getRoomName(activeRoom) : '채팅방을 선택하세요'}</h3>
            <span><span className="status-dot"></span> 대화 내용은 자동으로 갱신됩니다</span>
          </div>
        </div>

        {/* 메시지 스크롤 영역 */}
        <div id="chat-messages">
          {isLoadingMessages && <p>메시지를 불러오는 중...</p>}
          {!isLoadingMessages && activeRoomId && messages.length === 0 && <p>아직 메시지가 없습니다.</p>}
          {messages.map((message) => {
            const messageId = message.chatMessageId ?? message.messageId ?? message.id;
            const senderId = message.senderId ?? message.userId;
            const isMe = String(senderId) === String(account.userId ?? account.id);
            return (
              <div key={messageId} className={`message-row ${isMe ? "me" : "other"}`}>
                <div className="bubble">{message.content ?? message.text ?? ''}</div>
              </div>
            );
          })}
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        {/* 하단 입력 및 템플릿 영역 */}
        <div id="chat-bottom">
          <form id="chat-input-box" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder={activeRoomId ? '메시지를 입력하세요' : '채팅방을 먼저 선택하세요'}
              value={inputText}
              disabled={!activeRoomId}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" id="send-btn" disabled={!activeRoomId || !inputText.trim()}>↑</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
