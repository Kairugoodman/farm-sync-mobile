import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Cow = Tables<'cows'>;
export type CowEvent = Tables<'cow_events'>;

// Cows
export const getCows = async (): Promise<Cow[]> => {
  const { data, error } = await supabase
    .from('cows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getCowById = async (id: string): Promise<Cow | null> => {
  const { data, error } = await supabase
    .from('cows')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const saveCow = async (cow: TablesInsert<'cows'>): Promise<Cow> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const cowData = { ...cow, user_id: user.id };

  const { data, error } = await supabase
    .from('cows')
    .upsert(cowData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCow = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cows')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Cow Events
export const getCowEvents = async (cowId?: string): Promise<CowEvent[]> => {
  let query = supabase
    .from('cow_events')
    .select('*')
    .order('event_date', { ascending: true });

  if (cowId) {
    query = query.eq('cow_id', cowId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const updateEventCompletion = async (
  eventId: string,
  completed: boolean
): Promise<void> => {
  const { error } = await supabase
    .from('cow_events')
    .update({ completed })
    .eq('id', eventId);

  if (error) throw error;
};
