export interface Chat {
  id: string;
  title: string;
  type: 'direct' | 'group';
  avatar?: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  last_sender?: string;
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