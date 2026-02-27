// ============================================================
//  Chatbot.tsx  –  Replace your existing file
//  Changes from original:
//    • handleSend now calls the real backend /api/chat
//    • maintains full conversation history for context
//    • shows a typing indicator and error messages properly
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/api';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm your noCap assistant. How can I help you verify content today?", isUser: false },
  ]);
  // Keep the full ChatMessage history to send to the backend for context
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    // 1. Add user message to the UI immediately
    setMessages((prev) => [...prev, { text, isUser: true }]);
    setInputText('');
    setIsTyping(true);

    // 2. Build updated history to send
    const updatedHistory: ChatMessage[] = [
      ...history,
      { role: 'user', content: text },
    ];

    try {
      // 3. Call the real backend
      const { reply } = await sendChatMessage(updatedHistory);

      // 4. Save assistant turn to history
      setHistory([...updatedHistory, { role: 'assistant', content: reply }]);

      // 5. Show assistant reply
      setMessages((prev) => [...prev, { text: reply, isUser: false }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't reach the server. Please try again.", isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-32 right-8 w-96 h-[500px] bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-2xl border-4 border-amber-900 flex flex-col overflow-hidden"
            style={{ zIndex: 9998 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-4 flex items-center justify-between border-b-4 border-amber-900">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-black text-amber-900">noCap Assistant</h3>
                  <p className="text-xs text-amber-800">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-amber-300 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-amber-900" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.isUser
                        ? 'bg-yellow-400 text-amber-900 rounded-br-none'
                        : 'bg-white border-2 border-amber-200 text-amber-900 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border-2 border-amber-200 text-amber-900 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span className="text-sm text-amber-700">Thinking…</span>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/50 border-t-4 border-amber-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 p-3 rounded-xl border-2 border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-amber-900 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-yellow-400 text-amber-900 p-3 rounded-xl border-2 border-amber-600 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full shadow-2xl border-4 border-amber-900 flex items-center justify-center"
        style={{ zIndex: 9999 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-7 h-7 text-amber-900" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="w-7 h-7 text-amber-900" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}
