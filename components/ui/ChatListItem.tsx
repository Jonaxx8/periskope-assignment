import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { Chat } from '../../app/types';
import { getLastMessageOfConversationWithSenderName } from '../../app/chat/actions';
import { FaPerson, FaUserGroup } from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';
import { BsCheck2All } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { IoMdLock } from 'react-icons/io';
import { MdOutlineBlock } from 'react-icons/md';
import { FaPhone } from "react-icons/fa6";
import { FaUserCircle } from 'react-icons/fa';


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

  return (
    <div
      className={`cursor-pointer px-3 py-2.5 hover:bg-gray-50 ${
        isActive ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex space-x-3">
        <div className="relative shrink-0">
          <div className="w-[45px] h-[45px] bg-gray-100 rounded-full flex items-center justify-center">
            <IoPersonSharp className="text-gray-400 text-xl" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-medium text-[15px] text-gray-900 truncate leading-5">
              {chat.title === "+91 99999 99999" ? "+91 99999 99999" : chat.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-[1px] text-xs font-medium rounded bg-red-50/80 text-red-400/90">Demo</span>
                <span className="px-1.5 py-[1px] text-xs font-medium rounded bg-green-50 text-green-500">Internal</span>
            </div>
          </div>
          {lastMessage && lastMessage.length > 0 && (
            <div className="flex items-center mt-[2px] gap-1 justify-between">
              <div className='flex items-center gap-1'>
              <span className="text-xs text-gray-400">{lastMessage?.[0]?.sender_name.split("@")[0].split(".")[0]+": " || ''}</span>
              <span className="text-[13px] text-gray-500 truncate leading-5">{lastMessage?.[0]?.content}</span>
              </div>
              <div className='flex items-center gap-1'>
                <FaUserCircle className='text-gray-400' />
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-[2px] justify-between">
            <div className=' bg-gray-100 rounded-lg p-1 w-fit text-[10px] flex items-center gap-1'>
            <FaPhone className="text-gray-400" />
            <span className="text-gray-400">+91 92896 65999</span>
            </div>
            <div>
            <span className="text-xs text-gray-400 ml-0.5">{chat.last_message_at ? `${new Date(chat.last_message_at).getDate()}-${new Date(chat.last_message_at).toLocaleString('en-US', {month: 'short'})}-${new Date(chat.last_message_at).getFullYear().toString().slice(-2)}` : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem; 