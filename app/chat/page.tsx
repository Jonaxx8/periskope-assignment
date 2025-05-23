"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/ui/Sidebar";
import ChatArea from "../../components/ui/ChatArea";
import { Chat } from "../types";
import NavigationBar from "../../components/ui/NavigationBar";
import TopBar from "../../components/ui/TopBar";
import PlaceholderContent from "../../components/ui/PlaceholderContent";
import RightToolbar from "@/components/ui/RightToolbar";
// Mock data for development
const mockChats: Chat[] = [
  {
    id: "1",
    title: "Test El Centro",
    labels: ["Demo"],
    lastMessage: "Roshnag: Hello, Ahmadport!",
    lastMessageTime: "04-Feb-25",
    participants: ["Roshnag Airtel", "Roshnag Jio", "Bharat Kumar Ramesh"],
  },
  {
    id: "2",
    title: "Test Skope Final 5",
    labels: ["Demo"],
    lastMessage: "Support2: This doesn't go on Tuesday...",
    lastMessageTime: "Yesterday",
  },
  {
    id: "3",
    title: "Periskope Team Chat",
    labels: ["Demo", "Internal"],
    lastMessage: "Periskope: Test message",
    lastMessageTime: "28-Feb-25",
  },
];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeNavItem, setActiveNavItem] = useState('messages');

  const handleRefresh = () => {
    // Implement refresh logic here
    console.log('Refreshing...');
  };

  const handleHelp = () => {
    // Implement help logic here
    console.log('Opening help...');
  };

  const handleNavSelect = (item: string) => {
    setActiveNavItem(item);
  };

  const renderContent = () => {
    if (activeNavItem === 'messages') {
      return (
        <>
          <Sidebar
            chats={chats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
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