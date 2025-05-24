import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { Chat } from '../../app/types';
import { getLastMessageOfConversationWithSenderName } from '../../app/chat/actions';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

const ChatListItem: FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const fetchLastMessage = async () => {
      const message = await getLastMessageOfConversationWithSenderName(chat.id);
      setLastMessage(message);
    };
    fetchLastMessage();
  }, [chat.id]);

  console.log(lastMessage);
  return (
    <div
      className={`cursor-pointer p-4 hover:bg-gray-50 border-b ${
        isActive ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          {chat.avatar ? (
            <Image
              src={chat.avatar}
              alt={chat.title}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">{chat.title[0]}</span>
            </div>
          )}
          {chat.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
            <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
          </div>
          {lastMessage && lastMessage.length > 0 && (
            <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600">
              {lastMessage?.[0]?.sender_name.split("@")[0].split(".")[0]+": " || ''} 
            </span>
            <span className="text-sm text-gray-500">
              {lastMessage?.[0]?.content}
            </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem; 