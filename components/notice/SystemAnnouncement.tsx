'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, ChevronUp } from 'lucide-react';

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'PROMOTION' | 'URGENT' | 'UPDATE';
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

 useEffect(() => {
  if (!open || announcements.length > 0) return;
  fetch('/api/announcements')
    .then((res) => res.json())
    .then(setAnnouncements)
    .catch(() => {});
}, [open]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:text-indigo-600 transition"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {announcements.length > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl border border-gray-200 rounded-xl z-50 max-h-[420px] overflow-auto">
          <div className="p-4 border-b font-semibold text-gray-800 flex items-center gap-2">
            📢 Thông báo hệ thống
          </div>

          {announcements.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">Không có thông báo nào.</div>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className="p-4 border-b last:border-none text-sm hover:bg-gray-50 transition cursor-pointer"
                onClick={() => toggleExpand(a.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-900">{a.title}</div>
                  {expandedId === a.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {expandedId === a.id && (
                  <pre className="whitespace-pre-wrap text-gray-600 mt-2">{a.content}</pre>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
