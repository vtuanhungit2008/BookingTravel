'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Star } from 'lucide-react'; // Optional icon lib

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

  const newMessages: Message[] = [...messages, { role: 'user', text: input }];
  setMessages([...newMessages, { role: 'assistant', text: '' }]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...newMessages.map((m) => ({ role: m.role, content: m.text })),
        ],
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let replyText = '';

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      replyText += decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: replyText };
        return updated;
      });
    }
  } catch (err) {
    console.error('Lỗi stream:', err);
    setMessages((prev) => [
      ...prev.slice(0, -1),
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
    <div className="flex flex-col h-full border rounded-lg shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-3 text-sm max-w-xl whitespace-pre-wrap rounded-2xl shadow-md ${
                msg.role === 'user'
                  ? 'bg-black text-white rounded-br-none ml-auto'
                  : 'bg-white text-gray-900 rounded-bl-none mr-auto'
              }`}
            >
              <ReactMarkdown
                components={{
                  img: ({ src, alt }) => (
                    <img
                      src={src || ''}
                      alt={alt}
                      className="rounded-xl my-3 w-full object-cover"
                    />
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline hover:text-blue-800"
                    >
                      {children}
                    </a>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mt-3 mb-1">{children}</h3>
                  ),
                  li: ({ children }) => (
                    <li className="list-disc list-inside text-sm">{children}</li>
                  ),
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400 italic">Đang suy nghĩ...</div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Nhập câu hỏi..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
