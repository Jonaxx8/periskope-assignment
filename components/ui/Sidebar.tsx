import { FC, useState, useMemo, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import ChatListItem from '../../components/ui/ChatListItem';
import { Chat } from '../../app/types';
import { MdFilterList } from "react-icons/md";
import { RiFolderDownloadFill } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
import { TbMessageCirclePlus } from "react-icons/tb";
import CreateChatModal from './CreateChatModal';
import { CgSpinner } from "react-icons/cg";
import { createClient } from '@/utils/supabase/client';
import { getLastMessageOfConversationWithSenderName } from '@/app/chat/actions';

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  onChatsUpdate?: () => void;
  isLoading?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onChatsUpdate,
  isLoading = false 
}) => {
  const [activeSearch, setActiveSearch] = useState(false)
  const [activeFilter, setActiveFilter] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false)
  const [localChats, setLocalChats] = useState(chats)
  const supabase = createClient();

  // Update local chats when props change
  useEffect(() => {
    setLocalChats(chats);
  }, [chats]);

  useEffect(() => {
    if (!chats.length) return;

    // Set up real-time subscription for all chats
    const channels = chats.map(chat => {
      return supabase
        .channel(`sidebar-chat:${chat.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${chat.id}`
          },
          async (payload) => {
            try {
              // Get the last message with sender name
              const lastMessage = await getLastMessageOfConversationWithSenderName(chat.id);
              
              // Update the local chat with the new last message
              setLocalChats(prevChats => 
                prevChats.map(prevChat => 
                  prevChat.id === chat.id 
                    ? {
                        ...prevChat,
                        last_message: lastMessage[0]?.content || '',
                        last_message_at: lastMessage[0]?.created_at || prevChat.last_message_at,
                        last_sender: lastMessage[0]?.sender_name || ''
                      }
                    : prevChat
                )
              );
            } catch (error) {
              console.error('Error updating chat:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for chat ${chat.id}:`, status);
        });
    });

    // Cleanup subscriptions
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [chats]);

  const handleChatCreated = () => {
    if (onChatsUpdate) {
      onChatsUpdate();
    }
  };

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return localChats;
    
    const query = searchQuery.toLowerCase().trim();
    return localChats.filter(chat => {
      // Search in chat title
      if (chat.title?.toLowerCase().includes(query)) return true;
      
      // Search in last message
      if (chat.last_message?.toLowerCase().includes(query)) return true;
      
      // Search in last sender
      if (chat.last_sender?.toLowerCase().includes(query)) return true;
      
      return false;
    });
  }, [localChats, searchQuery]);

  // Sort chats by last message time
  const sortedFilteredChats = useMemo(() => {
    return [...filteredChats].sort((a, b) => {
      const dateA = new Date(a.last_message_at || 0);
      const dateB = new Date(b.last_message_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredChats]);

  const handleSearchToggle = () => {
    setActiveSearch(!activeSearch);
    if (!activeSearch) {
      setSearchQuery(''); // Clear search when closing
    }
  };

  return (
    <aside className="w-96 bg-white border-r flex flex-col min-h-0 relative">
      {/* Header / Filter / Search */}
      <div className="p-4 border-b shrink-0 bg-gray-50">
        <div className="flex items-center justify-between">
          {activeFilter && <div className="flex items-center space-x-2">
            <span className="text-green-700 font-medium flex items-center gap-1">
              <RiFolderDownloadFill />
              Custom filter
            </span>
            <button className="text-gray-800 text-xs border rounded p-1 px-2 bg-white shadow-s ">Save</button>
          </div>}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSearchToggle}
              className={`p-1 relative hover:bg-gray-100 rounded border flex items-center space-x-1 px-2 text-xs !bg-white ${activeSearch ? 'text-green-600' : 'text-gray-800'}`}
            >
              <FaSearch size={10} className={activeSearch ? 'text-green-600' : 'text-gray-500'} />
              <span>Search</span>
              {activeSearch && <IoMdCloseCircle className='absolute -top-1 -right-1' size={12} color='green' />}
            </button>
            <button 
              onClick={() => setActiveFilter(!activeFilter)}
              className={`p-1 relative hover:bg-gray-100 rounded border flex items-center space-x-1 px-2  text-xs !bg-white ${activeFilter ? 'text-green-600' : 'text-gray-800'}`}
            >
              <MdFilterList size={12} className={activeFilter ? 'text-green-600' : 'text-gray-500'}/>
              <span>{activeFilter ? `Filtered` : `Filter`}</span>
              {activeFilter && <IoMdCloseCircle className='absolute -top-1 -right-1' size={12} color='green' />}
            </button>
          </div>
        </div>
        {activeSearch && 
          <div className="mt-3 flex items-center bg-white border rounded-md px-3 py-1.5">
            <FaSearch className="text-gray-400 mr-2" size={12} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
              placeholder="Search in messages and chats..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoMdCloseCircle size={16} />
              </button>
            )}
          </div>
        }
      </div> 

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <CgSpinner className="animate-spin text-gray-400 text-2xl" />
          </div>
        ) : (
          <>
            {sortedFilteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => onChatSelect(chat)}
              />
            ))}
            {activeSearch && sortedFilteredChats.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No chats found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Chat Button */}
      <button
        onClick={() => setIsCreateChatOpen(true)}
        className="absolute bottom-6 right-6 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-700 transition-colors"
      >
        <TbMessageCirclePlus size={24} />
      </button>

      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={isCreateChatOpen}
        onClose={() => setIsCreateChatOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </aside>
  );
};

export default Sidebar; 