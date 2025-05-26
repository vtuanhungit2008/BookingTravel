'use client';

import { useState } from 'react';
import AssistantChat from './AssistantChat';
import { BotIcon, X } from 'lucide-react';

export default function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)} 
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-gray-50 to-indigo-600 text-black p-4 rounded-full shadow-xl hover:scale-110 transition-all"
        aria-label="Trợ lý ảo"
      >
        {open ? <X className="w-6 h-6" /> : <BotIcon className="w-6 h-6" />}
      </button>


      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] max-h-[85vh] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 bg-white text-black">
            <h3 className="font-semibold text-sm">🤖 Trợ lý HomeAway</h3>
           
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <AssistantChat />
          </div>
        </div>
      )}
    </>
  );
}
