"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Clock, Calendar, User, MoreVertical, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from "@/hooks/useMobile";
import { Conversation } from './ConversationListItem';
import { Message, ChatMessage } from './ChatMessage';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  onSetReminder: (messageId: string) => void;
  onSyncCalendar: (messageId: string) => void;
  onViewCustomerInfo: () => void;
}

export function ChatDrawer({
  isOpen,
  onClose,
  conversation,
  messages,
  onSendMessage,
  onSendFile,
  onSetReminder,
  onSyncCalendar,
  onViewCustomerInfo
}: ChatDrawerProps) {
  const isMobile = useMobile();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  };

  if (!conversation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Mobile only or if we want it modal-like) */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-secondary-000/20 backdrop-blur-[1px] z-[40]"
            />
          )}

          {/* Drawer Container */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed z-[50] bg-white shadow-xl flex flex-col overflow-hidden
              ${isMobile 
                ? 'left-4 right-4 bottom-0 top-[60px] rounded-t-2xl' 
                : 'top-0 right-0 bottom-0 w-[500px] border-l border-accent-20'
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-accent-20 bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <button onClick={onClose} className="p-2 -ml-2 hover:bg-accent-10 rounded-full">
                    <X size={20} className="text-secondary-000" />
                  </button>
                )}
                
                <div onClick={onViewCustomerInfo} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-accent-20 flex items-center justify-center overflow-hidden">
                       <span className="font-unbounded font-bold text-secondary-000 text-sm">
                          {conversation.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                       </span>
                    </div>
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-unbounded text-sm font-bold text-secondary-000 group-hover:text-primary-100 transition-colors">
                      {conversation.customerName}
                    </h3>
                    <p className="text-xs text-accent-60">
                      {conversation.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button className="p-2 text-accent-60 hover:text-primary-100 hover:bg-primary-100/10 rounded-full transition-all">
                   <Phone size={20} />
                 </button>
                 <button className="p-2 text-accent-60 hover:text-primary-100 hover:bg-primary-100/10 rounded-full transition-all">
                   <Video size={20} />
                 </button>
                 {!isMobile && (
                    <button onClick={onClose} className="p-2 ml-2 hover:bg-accent-10 rounded-full">
                      <X size={20} className="text-secondary-000" />
                    </button>
                 )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-accent-10/30">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-accent-60">
                    <p className="font-unageo text-sm">No messages yet. Start the conversation!</p>
                 </div>
               ) : (
                 messages.map((msg) => (
                   <div key={msg.id} className="group relative">
                      <ChatMessage message={msg} />
                      
                      {/* Hover Actions for Message (Desktop) */}
                      {!msg.isVendor && (
                        <div className="absolute top-2 right-0 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-lg p-1">
                           <button 
                             onClick={() => onSetReminder(msg.id)}
                             title="Set Reminder"
                             className="p-1.5 hover:bg-accent-10 rounded-md text-accent-60 hover:text-primary-100"
                           >
                             <Clock size={14} />
                           </button>
                           <button 
                             onClick={() => onSyncCalendar(msg.id)}
                             title="Sync to Calendar"
                             className="p-1.5 hover:bg-accent-10 rounded-md text-accent-60 hover:text-primary-100"
                           >
                             <Calendar size={14} />
                           </button>
                        </div>
                      )}
                   </div>
                 ))
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-accent-20">
              <div className="flex items-end gap-2 bg-accent-10/50 p-2 rounded-2xl border border-transparent focus-within:border-primary-100/50 focus-within:bg-white transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-accent-40 hover:text-primary-100 transition-colors shrink-0"
                >
                  <Paperclip size={20} />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </button>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm font-unageo text-secondary-000 placeholder:text-accent-40 resize-none max-h-32 py-2.5"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
                
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl transition-all shrink-0 
                    ${inputText.trim() 
                      ? 'bg-primary-100 text-white shadow-md hover:shadow-lg' 
                      : 'bg-accent-20 text-accent-60 cursor-not-allowed'}
                  `}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
