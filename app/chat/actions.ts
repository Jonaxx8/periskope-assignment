"use server";
import { createClient } from '@/utils/supabase/server'; // Changed from 'client' to 'server'

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