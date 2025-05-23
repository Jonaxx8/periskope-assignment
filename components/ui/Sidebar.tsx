import { FC } from 'react';
import { FaSearch, FaSave, FaFilter } from 'react-icons/fa';
import ChatListItem from '../../components/ui/ChatListItem';
import { Chat } from '../../app/types';

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

const Sidebar: FC<SidebarProps> = ({ chats, activeChat, onChatSelect }) => {
  return (
    <aside className="w-80 bg-white border-r flex flex-col h-screen">
      {/* Header / Filter / Search */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-medium">Custom filter</span>
            <button className="text-gray-600 text-sm">Save</button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <FaSearch className="text-gray-500" size={14} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <FaFilter className="text-gray-500" size={14} />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center bg-gray-100 rounded-md px-3 py-1.5">
          <FaSearch className="text-gray-400 mr-2" size={12} />
          <input
            className="bg-transparent outline-none text-sm flex-1"
            placeholder="Search chats"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={activeChat?.id === chat.id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar; 