"use client"
import { FC, useEffect, useState } from 'react';
import { FaPaperclip, FaSmile, FaMicrophone, FaMagic, FaRedo, FaPaperPlane, FaClock, FaBook } from 'react-icons/fa';
import { Chat, Message } from '../../app/types';
import MessageBubble from './MessageBubble';
import chatBackground from "@/public/chat/background.png";
import { getParticipants, getMessages, sendMessage, getMessagesWithSenderName } from '@/app/chat/actions';
import { LuSearch } from "react-icons/lu";
import { BsStars } from "react-icons/bs";
import { createClient } from '@/utils/supabase/client';



interface ChatAreaProps {
  chat: Chat | null;
}

const ChatArea: FC<ChatAreaProps> = ({ chat }) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!chat?.id) return;

    const fetchChatData = async () => {
      try {
        const [participants, messages] = await Promise.all([
          getParticipants(chat.id),
          getMessagesWithSenderName(chat.id),
        ]);

        console.log("messages", messages);
        
        setParticipants(participants || []);
        setMessages(messages || []);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [chat?.id]);


  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        Select a chat to begin
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !chat?.id) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        conversation_id: chat.id,
        sender_id: user.id,
        sender_name: user.email,
        content: messageInput.trim(),
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput('');
      await sendMessage({
        conversationId: chat.id,
        senderId: user.id,
        content: newMessage.content,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white px-6 py-2 border-b flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {chat.avatar ? (
              <img
                src={chat.avatar}
                alt={chat.title}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">{chat.title[0]}</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{chat.title}</h2>
            <div className="flex items-center text-sm text-gray-500">
              {participants.map((participant, index) => (
                <span key={participant.id}>
                  {index > 0 ? ", " : ""}
                  {participant.email.split("@")[0].split(".")[0] + " "}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full rotate-180">
            <BsStars />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <LuSearch />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto min-h-0"
        style={{
          backgroundImage: `url(${chatBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} 
      >
        <div className="px-6 py-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              timestamp={new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              sender={message.sender_name || 'Unknown'} 
              isOutgoing={message.sender_id === user?.id}
            />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-2 border-t">
      {/* Input + Send Icon Row */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 px-3 py-2 text-sm text-gray-500 placeholder-gray-400 bg-transparent focus:outline-none"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button className="p-2 text-green-600 hover:bg-gray-100 rounded-full" onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>

      {/* Icon Row + Dropdown */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-4">
          <FaPaperclip className="text-gray-500 cursor-pointer" />
          <FaSmile className="text-gray-500 cursor-pointer" />
          <FaClock className="text-gray-500 cursor-pointer" />
          <FaRedo className="text-gray-500 cursor-pointer" />
          <FaMagic className="text-gray-500 cursor-pointer" />
          <FaBook className="text-gray-500 cursor-pointer" />
          <FaMicrophone className="text-gray-500 cursor-pointer" />
        </div>

        {/* Periskope Pill */}
        <div className="flex items-center space-x-2 border rounded px-6 py-1 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
          <span>Periskope</span>
          </div>
          <svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatArea; 