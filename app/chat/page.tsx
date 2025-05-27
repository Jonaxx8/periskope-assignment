"use client";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/ui/Sidebar";
import ChatArea from "../../components/ui/ChatArea";
import { Chat } from "../types";
import NavigationBar from "../../components/ui/NavigationBar";
import TopBar from "../../components/ui/TopBar";
import PlaceholderContent from "../../components/ui/PlaceholderContent";
import RightToolbar from "@/components/ui/RightToolbar";
import { createClient } from "@/utils/supabase/client";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeNavItem, setActiveNavItem] = useState('chats');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          type,
          created_at,
          last_message_at,
          participants!inner (
            user_id
          )
        `)
        .eq('participants.user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const formattedChats: Chat[] = data.map(chat => ({
        id: chat.id,
        title: chat.title,
        type: chat.type,
        lastMessageTime: new Date(chat.last_message_at || chat.created_at).toLocaleDateString(),
        created_at: chat.created_at,
        last_message_at: chat.last_message_at || chat.created_at,
      }));

      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleRefresh = () => {
    fetchChats();
  };

  const handleHelp = () => {
    console.log('Opening help...');
  };

  const handleNavSelect = (item: string) => {
    setActiveNavItem(item);
  };

  const renderContent = () => {
    if (activeNavItem === 'chats') {
      return (
        <>
          <Sidebar
            chats={chats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            onChatsUpdate={fetchChats}
            isLoading={isLoading}
          />
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1">
              <ChatArea chat={activeChat} />
            </div>
            <RightToolbar />
          </div>
        </>
      );
    }
    return <PlaceholderContent section={activeNavItem} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <NavigationBar activeItem={activeNavItem} onItemSelect={handleNavSelect} />
      <div className="flex flex-col flex-1 min-h-0">
        <TopBar 
          activeSection={activeNavItem}
          onRefresh={handleRefresh} 
          onHelp={handleHelp} 
        />
        <div className="flex flex-1 min-h-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}