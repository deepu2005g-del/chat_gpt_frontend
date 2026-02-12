import React, { useState, useRef, useEffect } from 'react';

const AskAI = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState(() => {
        // Load chat history from localStorage on first render
        const saved = localStorage.getItem('ai_chat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const chatEndRef = useRef(null);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
    }, [chatHistory]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, loading]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setLoading(true);
        setError('');

        // Add user message to chat history immediately
        setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
        setMessage('');

        const token = localStorage.getItem('access_token');

        try {
            const response = await fetch('http://127.0.0.1:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    system_prompt: "You are a helpful assistant."
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Add AI response to chat history
                setChatHistory((prev) => [...prev, { role: 'ai', content: data.response }]);
            } else {
                setError(data.detail || 'The AI is unavailable right now.');
            }
        } catch (err) {
            setError('Failed to connect to AI server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">AI Assistant</h2>
                        <p className="text-indigo-200 text-xs">Powered by AI • Always ready to help</p>
                    </div>
                    {chatHistory.length > 0 && (
                        <button
                            onClick={() => { setChatHistory([]); setError(''); localStorage.removeItem('ai_chat_history'); }}
                            className="ml-auto text-white/70 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                            Clear Chat
                        </button>
                    )}
                </div>

                {/* Chat Display Area */}
                <div className="h-[450px] overflow-y-auto p-6 bg-gray-50 space-y-4">
                    {/* Empty State */}
                    {chatHistory.length === 0 && !loading && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="font-medium text-lg">Start a conversation</p>
                            <p className="text-sm mt-1">Ask me anything — I'm here to help!</p>
                        </div>
                    )}

                    {/* Chat Messages */}
                    {chatHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <span className="text-[10px] font-bold text-gray-400 mb-1 mx-2 uppercase tracking-wider">
                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <div
                                className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-md'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
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
                <form onSubmit={handleAsk} className="p-4 bg-white border-t border-gray-100 flex gap-3">
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
    );
};

export default AskAI;