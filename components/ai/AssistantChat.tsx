'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: 'assistant', text: data.reply || 'Không có phản hồi' },
      ]);
    } catch (error) {
      console.error('Lỗi:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', text: '⚠️ Đã xảy ra lỗi. Vui lòng thử lại.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 text-sm w-full max-w-screen-md whitespace-pre-wrap rounded-2xl shadow ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-br-none ml-auto'
                  : 'bg-white text-gray-800 rounded-bl-none mr-auto'
              }`}
            >
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <a
                      {...props}
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                    />
                  ),
                  li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-sm italic text-left">Đang suy nghĩ...</div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Nhập câu hỏi..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-red transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
