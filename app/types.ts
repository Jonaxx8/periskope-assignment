export interface Chat {
  id: string;
  title: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  labels?: string[];
  participants?: string[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isOutgoing: boolean;
  status?: 'sent' | 'delivered' | 'read';
} 