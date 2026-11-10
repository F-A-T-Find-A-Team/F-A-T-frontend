'use client';
import { useEffect, useState } from 'react';
import { ApiError, chatApi, type ChatMessage, type ChatRoom, usersApi } from '@/app/lib/api';

export default function ChatPage() {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const activeRoom = chatRooms.find((room) => room.id === activeRoomId) ?? null;

    useEffect(() => {
        let cancelled = false;
        Promise.all([chatApi.rooms(), usersApi.me()])
            .then(([roomResult, profile]) => {
                if (cancelled) return;
                setChatRooms(roomResult.items);
                const requestedRoomId = Number(new URLSearchParams(window.location.search).get('roomId'));
                const requestedRoom = roomResult.items.find((room) => room.id === requestedRoomId);
                setActiveRoomId(requestedRoom?.id ?? roomResult.items[0]?.id ?? null);
                setCurrentUserId(profile.id);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof ApiError ? err.message : '채팅 목록을 불러오지 못했습니다.');
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (activeRoomId === null) return;
        let cancelled = false;
        chatApi.messages(activeRoomId, { size: 30 })
            .then((result) => { if (!cancelled) setMessages(result.items); })
            .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : '메시지를 불러오지 못했습니다.'); });
        return () => { cancelled = true; };
    }, [activeRoomId]);

    const handleSendMessage = async () => {
        const content = inputMessage.trim();
        if (!content || activeRoomId === null || isSending) return;
        setIsSending(true);
        setError('');
        try {
            await chatApi.sendMessage(activeRoomId, content, crypto.randomUUID());
            const result = await chatApi.messages(activeRoomId, { size: 30 });
            setMessages(result.items);
            setInputMessage('');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : '메시지를 전송하지 못했습니다.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="chat-container">
            {/* 1. 좌측 사이드바 (채팅 목록) */}
            <aside className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>채팅</h2>
                    <span>{chatRooms.length}개 방</span>
                </div>

                <div className="chat-room-list">
                    {chatRooms.map((room) => (
                        <button
                            key={room.id}
                            className={`chat-room-item ${activeRoomId === room.id ? 'active' : ''}`}
                            onClick={() => { setMessages([]); setActiveRoomId(room.id); }}
                        >
                            <div className="chat-room-header">
                                <span className="chat-room-title">{room.name}</span>
                                <span className="chat-room-time">{room.unreadCount || ''}</span>
                            </div>
                            <div className="chat-room-preview">{room.lastMessage}</div>
                            <span className="chat-tag">{room.type === 'DIRECT' ? '커피챗' : '팀 채팅'}</span>
                        </button>
                    ))}
                    {chatRooms.length === 0 && !error && <p className="chat-room-preview">참여 중인 채팅방이 없습니다.</p>}
                </div>
            </aside>

            {/* 2. 우측 메인 대화창 */}
            <main className="chat-main">
                {/* 상단 프로필 헤더 */}
                <header className="chat-main-header">
                    <div className="chat-user-avatar">{activeRoom?.name.slice(0, 1) ?? '?'}</div>
                    <div className="chat-user-info">
                        <h3>{activeRoom?.name ?? '채팅방을 선택하세요'}</h3>
                        <div className="chat-user-status">
                            <span className="status-dot"></span> {activeRoom?.type === 'DIRECT' ? '커피챗' : activeRoom ? '팀 채팅' : '대화 내역'}
                        </div>
                    </div>
                </header>

                {/* 메시지 스크롤 영역 */}
                <div className="chat-messages-area">
                    {messages.map((msg) => {
                        const outgoing = msg.sender.id === currentUserId;
                        return (
                            <div 
                                key={msg.id} 
                                className={`message-wrapper ${outgoing ? 'outgoing' : 'incoming'}`}
                            >
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
                    {messages.length === 0 && activeRoom && <p className="chat-room-preview">첫 메시지를 보내보세요.</p>}
                </div>

                {/* 하단 입력 영역 */}
                <div className="chat-input-area">
                    {error && <p role="alert">{error}</p>}
                    <input 
                        type="text"
                        className="chat-input"
                        autoComplete="off"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={!activeRoom || isSending}
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
                        disabled={!activeRoom || isSending}
                    >
                        ↑
                    </button>
                </div>
            </main>
        </div>
    );
}