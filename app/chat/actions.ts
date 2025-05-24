"use server";
import { createClient } from '@/utils/supabase/server'; 

export const getChats = async () => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("error", error);

  if (error) {
    throw new Error(error.message);
  }

  console.log("data", data);
  return data;
}

interface User {
  id: string;
  email: string;
}

interface CreateChatParams {
  title: string;
  participants: User[];
}

export async function searchUsers(query: string): Promise<User[]> {
  try {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser || query.length < 2) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .neq('id', currentUser.id)
      .ilike('email', `%${query}%`)
      .limit(5);

    if (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search users');
    }

    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

export async function createChat({ title, participants }: CreateChatParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a chat');
    }

    // Start a transaction by creating the conversation first
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert([
        { 
          title,
          type: participants.length === 1 ? 'direct' : 'group',
          created_at: new Date().toISOString(),
          last_message_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (convError) {
      console.error('Conversation error:', convError);
      throw new Error('Failed to create conversation');
    }

    if (!conversation) {
      throw new Error('No conversation was created');
    }

    // Add participants including the creator
    const participantsToAdd = [
      { 
        conversation_id: conversation.id, 
        user_id: user.id, 
        role: 'admin',
        created_at: new Date().toISOString()
      },
      ...participants.map(p => ({
        conversation_id: conversation.id,
        user_id: p.id,
        role: 'member',
        created_at: new Date().toISOString()
      }))
    ];

    const { error: partError } = await supabase
      .from('participants')
      .insert(participantsToAdd);

    if (partError) {
      console.error('Participants error:', partError);
      // If adding participants fails, clean up the conversation
      await supabase
        .from('conversations')
        .delete()
        .eq('id', conversation.id);
      
      throw new Error('Failed to add participants');
    }

    return conversation;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

export const getParticipants = async (conversationId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('conversation_id', conversationId);

  const { data: participants, error: participantsError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', data?.map(participant => participant.user_id) || []);

  if (error) {
    throw new Error(error.message);
  }

  return participants;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const getMessages = async (conversationId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const getLastMessageOfConversation = async (conversationId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(1);

  return data;
}

export const sendMessage = async ({
  conversationId,
  senderId,
  content,
}: {
  conversationId: string;
  senderId: string;
  content: string;
}) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
    });
  if (error) throw error;
};


export const getSenderName = async (senderId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', senderId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export const getMessagesWithSenderName = async (conversationId: string) => {
  const supabase = await createClient();
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (messagesError) throw new Error(messagesError.message);

  // Get unique sender IDs
  const senderIds = Array.from(new Set((messages as Message[] || []).map(msg => msg.sender_id)));

  // Fetch all relevant profiles in one query
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .in('id', senderIds);

  if (profilesError) throw new Error(profilesError.message);

  // Create a map of profiles for easy lookup
  const profileMap = new Map(profiles?.map(profile => [profile.id, profile]));

  // Combine messages with sender information
  return (messages || []).map(msg => ({
    ...msg,
    sender_name: profileMap.get(msg.sender_id)?.display_name || 
                 profileMap.get(msg.sender_id)?.email || 
                 'Unknown'
  }));
};

export const getLastMessageOfConversationWithSenderName = async (conversationId: string) => {
  const supabase = await createClient();
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (messagesError) throw new Error(messagesError.message);

  if (!messages || messages.length === 0) return [];

  // Get sender profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .eq('id', messages[0].sender_id)
    .single();

  if (profileError) throw new Error(profileError.message);

  return [{
    ...messages[0],
    sender_name: profile?.display_name || profile?.email || ''
  }];
};