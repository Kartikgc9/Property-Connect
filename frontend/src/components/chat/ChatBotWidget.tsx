import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, toggleChat, setLoading } from '../../store/slices/chatSlice';
import { RootState } from '../../store';
import axios from 'axios';
import { Send, MessageCircle } from 'lucide-react';

export const ChatBotWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, isOpen, isLoading } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(addMessage({
      id: Date.now().toString(),
      content: trimmed,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text',
    }));
    setInput('');

    try {
      dispatch(setLoading(true));
      const res = await axios.post('/api/chat/message', { message: trimmed });
      const reply = res.data.reply;
      dispatch(addMessage({
        id: Date.now().toString(),
        content: reply,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
      }));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        onClick={() => dispatch(toggleChat())}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl flex flex-col h-96">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
        <span>PropertyConnect Assistant</span>
        <button onClick={() => dispatch(toggleChat())}>×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`p-2 rounded-lg max-w-[70%] ${m.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            {m.content}
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-500">Typing...</div>}
      </div>

      {/* Input */}
      <div className="p-2 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <button
          disabled={!input.trim() || isLoading}
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatBotWidget;