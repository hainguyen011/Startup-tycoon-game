import React, { useState, useEffect, useRef } from 'react';
import { Employee } from '../../../types';
import { XCircle, Send } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface ChatModalProps {
  employee: Employee;
  onClose: () => void;
  onChatWithEmployee?: (empId: string, message: string) => Promise<string>;
}

export const ChatModal: React.FC<ChatModalProps> = ({ employee, onClose, onChatWithEmployee }) => {
  const { t } = useLanguage();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'bot', text: string}[]>([{sender: 'bot', text: `Chào sếp, tôi là ${employee.name}.`}]);
  const [isChatting, setIsChatting] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatHistory]);

  const sendChat = async () => {
      if (!chatMessage.trim() || !onChatWithEmployee) return;
      const msg = chatMessage;
      setChatMessage('');
      setChatHistory(prev => [...prev, {sender: 'user', text: msg}]);
      setIsChatting(true);
      const response = await onChatWithEmployee(employee.id, msg);
      setChatHistory(prev => [...prev, {sender: 'bot', text: response}]);
      setIsChatting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[500px] animate-fadeIn">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>{employee.name}</div>
                <button onClick={onClose}><XCircle size={24} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>{m.text}</div>
                    </div>
                ))}
                {isChatting && <div className="text-xs text-slate-400 italic ml-4">{t('dashboard.chat.typing')}</div>}
            </div>
            <div className="p-3 border-t border-slate-200 flex gap-2 bg-white">
                <input className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder={t('dashboard.chat.placeholder')} />
                <button onClick={sendChat} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-blue-200 shadow-md"><Send size={20}/></button>
            </div>
        </div>
    </div>
  );
};
