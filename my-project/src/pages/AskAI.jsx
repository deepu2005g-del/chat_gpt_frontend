import React, { useState, useRef, useEffect } from 'react';

const AskAI = () => {
    // Get current user's email for user-specific storage (legacy, now using token)
    const token = localStorage.getItem('access_token');

    // All chats: { id, title, messages: [{role, content}], created_at }
    const [allChats, setAllChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const chatEndRef = useRef(null);

    // Get the active chat's messages
    const activeChat = allChats.find((c) => c.id === activeChatId);
    const chatHistory = activeChat ? activeChat.messages : [];

    // Fetch chats on mount
    useEffect(() => {
        if (token) {
            fetch(`${import.meta.env.VITE_API_BASE}/chats/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Failed to fetch chats');
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setAllChats(data);
                    }
                })
                .catch(err => console.error("Failed to load chats", err));
        }
    }, [token]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, loading]);

    // Create a new chat
    const handleNewChat = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/chats/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: 'New Chat' })
            });

            if (res.ok) {
                const newChat = await res.json();
                setAllChats((prev) => [newChat, ...prev]);
                setActiveChatId(newChat.id);
                setError('');
                setShowHistory(false);
            } else {
                setError('Failed to create new chat');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    // Delete a chat from history
    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/chats/${chatId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setAllChats((prev) => prev.filter((c) => c.id !== chatId));
                if (activeChatId === chatId) {
                    setActiveChatId(null);
                }
            }
        } catch (err) {
            console.error("Failed to delete chat", err);
        }
    };

    // Send a message
    const handleAsk = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setMessage(''); // Clear input immediately

        let currentChatId = activeChatId;

        // Auto-create a new chat if none is active
        if (!currentChatId) {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/chats/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '') })
                });

                if (res.ok) {
                    const newChat = await res.json();
                    setAllChats((prev) => [newChat, ...prev]);
                    currentChatId = newChat.id;
                    setActiveChatId(currentChatId);
                } else {
                    setError('Failed to start conversation');
                    setLoading(false);
                    return;
                }
            } catch (err) {
                setError('Network error starting conversation');
                setLoading(false);
                return;
            }
        }

        setLoading(true);
        setError('');

        // Optimistic update: Add user message to UI
        setAllChats((prev) =>
            prev.map((chat) => {
                if (chat.id === currentChatId) {
                    return { ...chat, messages: [...chat.messages, { role: 'user', content: userMessage }] };
                }
                return chat;
            })
        );

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE}/chats/${currentChatId}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: 'user',
                    content: userMessage
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // data is the new message object from backend (AI response)
                setAllChats((prev) =>
                    prev.map((chat) =>
                        chat.id === currentChatId
                            ? { ...chat, messages: [...chat.messages, { role: 'ai', content: data.content }] }
                            : chat
                    )
                );
            } else {
                setError(data.detail || 'The AI is unavailable right now.');
            }
        } catch (err) {
            setError('Failed to connect to AI server.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="h-[calc(100vh-140px)] w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex h-full">

                {/* Sidebar - History */}
                <div className={`
          ${showHistory ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:static inset-y-0 left-0 z-50 md:z-auto
          w-72 md:w-64 bg-slate-900 text-white flex flex-col border-r border-gray-200
          transition-transform duration-300 md:transition-none
        `}>
                    {/* New Chat Button */}
                    <div className="p-3 border-b border-white/10">
                        <button
                            onClick={handleNewChat}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            New Chat
                        </button>
                    </div>

                    {/* Chat History List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <p className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider px-3 py-2">Chat History</p>
                        {allChats.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-xs">No conversations yet</p>
                            </div>
                        )}
                        {allChats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => { setActiveChatId(chat.id); setShowHistory(false); setError(''); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group flex items-center gap-2 ${activeChatId === chat.id
                                    ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium text-xs">{chat.title}</p>
                                    <p className="text-[10px] text-slate-500">{chat.messages.length} messages • {formatDate(chat.created_at)}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                                    title="Delete chat"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile overlay */}
                {showHistory && (
                    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowHistory(false)} />
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center gap-3">
                        <button
                            onClick={() => setShowHistory(true)}
                            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-white font-bold text-sm md:text-base truncate">
                                {activeChat ? activeChat.title : 'AI Assistant'}
                            </h2>
                            <p className="text-indigo-200 text-[10px] md:text-xs">Powered by AI • Always ready to help</p>
                        </div>
                    </div>

                    {/* Chat Display Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 space-y-4">
                        {/* Empty State */}
                        {chatHistory.length === 0 && !loading && !error && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-14 h-14 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <p className="font-medium">Start a conversation</p>
                                <p className="text-sm mt-1">Ask me anything — I'm here to help!</p>
                            </div>
                        )}

                        {/* Chat Messages */}
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] font-bold text-gray-400 mb-1 mx-2 uppercase tracking-wider">
                                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                </span>
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {loading && (
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-gray-400 mb-1 ml-2 uppercase tracking-wider">AI Assistant</span>
                                <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleAsk} className="p-3 md:p-4 bg-white border-t border-gray-100 flex gap-2 md:gap-3">
                        <input
                            type="text"
                            className="flex-1 bg-gray-100 border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 focus:bg-white outline-none transition-all text-sm"
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:from-gray-300 disabled:to-gray-400 transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AskAI;