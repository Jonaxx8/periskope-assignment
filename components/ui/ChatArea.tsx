import { FC } from 'react';
import { FaPaperclip, FaSmile, FaClock, FaMicrophone } from 'react-icons/fa';
import { Chat } from '../../app/types';
import MessageBubble from './MessageBubble';
import chatBackground from "@/public/chat/background.png";

interface ChatAreaProps {
  chat: Chat | null;
}

const ChatArea: FC<ChatAreaProps> = ({ chat }) => {
  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        Select a chat to begin
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white px-6 py-4 border-b flex items-center justify-between shrink-0">
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
              <span className="mr-2">5 / 6 phones</span>
              <span>•</span>
              <span className="ml-2">Last active 2h ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaSmile className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaClock className="text-gray-500" />
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
          {/* Messages will be mapped here */}
          <MessageBubble
            message="Hello, South Euna!"
            timestamp="08:01"
            sender="Roshnag Airtel"
            isOutgoing={false}
          />
          <MessageBubble
            message="Hello!"
            timestamp="12:20"
            sender="Periskope"
            isOutgoing={true}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-3 border-t shrink-0">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaPaperclip className="text-gray-500" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
          />
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaSmile className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaMicrophone className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea; 