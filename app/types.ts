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
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  content: string;
  created_at: string;
  is_read: boolean;
}