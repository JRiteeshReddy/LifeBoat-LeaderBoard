
import { mockSupabase } from './mockSupabase';
import { GameRecord, MetricType } from '../types';

export const formatValue = (value: number, type: MetricType) => {
  if (type === 'time') {
    const mins = Math.floor(value / 60);
    const secs = (value % 60).toFixed(3);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }
  return value.toLocaleString();
};

export const fetchLeaderboard = async (categoryId: string, timeFilter: string = 'all-time') => {
  // In a real app, this calls the RPC function:
  // const { data, error } = await supabase.rpc('get_leaderboard', { 
  //   p_category_id: categoryId, 
  //   p_time_filter: timeFilter 
  // });
  
  // Mocking the ranked response
  const queryResult = await mockSupabase.from('records').select().eq('category_id', categoryId);
  
  /**
   * Fix: Explicitly cast queryResult.data to GameRecord[] to resolve unknown type errors.
   */
  const records = (queryResult.data || []) as GameRecord[];
  
  // Simple mock sort (assuming 'time' for now)
  return records
    .sort((a, b) => a.value - b.value)
    .map((r, index) => ({
      rank: index + 1,
      id: r.id,
      username: r.profiles?.username || 'Unknown',
      avatar_url: r.profiles?.avatar_url || '',
      role: r.profiles?.role || 'player',
      value: r.value,
      proof_url: r.proof_url,
      created_at: r.created_at,
      is_pb: r.user_id === 'p1' // Mocking current user check
    }));
};
