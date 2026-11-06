'use client';
import { useState } from 'react';

export default function ChatPage() {
    // 채팅방 목록 데이터 예시
    const chatRooms = [
        {
            id: 1,
            name: '김태오 · PM',
            preview: '주 2회, 화·목 저녁에 비대면…',
            time: '1시간',
            tag: '지원 전 커피챗',
        },
        {
            id: 2,
            name: '급식앱 팀 채팅방',
            preview: "진행 상황이 '진행중'으로 변경…",
            time: '2시간',
            tag: '팀원 전용',
        },
    ];

    const [activeRoomId, setActiveRoomId] = useState(1);
    const [inputMessage, setInputMessage] = useState('');
    
    // 대화 내역 상태 예시
    const [messages, setMessages] = useState([
        { id: 1, sender: 'incoming', text: '지원 전 커피챗이에요 · 부담 없이 물어보세요' },
        { id: 2, sender: 'outgoing', text: '안녕하세요! FE로 지원 생각 중인데 회의는 얼마나 자주 하나요?' },
        { id: 3, sender: 'incoming', text: '주 2회, 화·목 저녁에 비대면으로 해요. 부담 크지 않아요!' },
        { id: 4, sender: 'system', text: "진행 상황이 '진행중'으로 변경됐어요" },
    ]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // 메시지 전송 로직
        setMessages([
            ...messages,
            { id: Date.now(), sender: 'outgoing', text: inputMessage }
        ]);
        setInputMessage('');
    };

    return (
        <div className="chat-container">
            {/* 1. 좌측 사이드바 (채팅 목록) */}
            <aside className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>채팅</h2>
                    <button type="button" className="chat-empty-btn">빈 상태</button>
                </div>

                <div className="chat-room-list">
                    {chatRooms.map((room) => (
                        <div 
                            key={room.id}
                            className={`chat-room-item ${activeRoomId === room.id ? 'active' : ''}`}
                            onClick={() => setActiveRoomId(room.id)}
                        >
                            <div className="chat-room-header">
                                <span className="chat-room-title">{room.name}</span>
                                <span className="chat-room-time">{room.time}</span>
                            </div>
                            <div className="chat-room-preview">{room.preview}</div>
                            <span className="chat-tag">{room.tag}</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 2. 우측 메인 대화창 */}
            <main className="chat-main">
                {/* 상단 프로필 헤더 */}
                <header className="chat-main-header">
                    <div className="chat-user-avatar">태</div>
                    <div className="chat-user-info">
                        <h3>김태오 · PM</h3>
                        <div className="chat-user-status">
                            <span className="status-dot"></span> 온라인 · 지원 전 커피챗
                        </div>
                    </div>
                </header>

                {/* 메시지 스크롤 영역 */}
                <div className="chat-messages-area">
                    {messages.map((msg) => {
                        if (msg.sender === 'system') {
                            return (
                                <div key={msg.id} className="chat-system-notice">
                                    <span>💬 {msg.text}</span>
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={msg.id} 
                                className={`message-wrapper ${msg.sender === 'outgoing' ? 'outgoing' : 'incoming'}`}
                            >
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 하단 입력 영역 */}
                <div className="chat-input-area">
                    <input 
                        type="text"
                        className="chat-input"
                        autoComplete="off"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="메시지를 입력하세요…"
                    />
                    <button 
                        type="button" 
                        className="chat-send-btn"
                        onClick={handleSendMessage}
                    >
                        ↑
                    </button>
                </div>
            </main>
        </div>
    );
}