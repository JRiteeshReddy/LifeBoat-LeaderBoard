
import { GameRecord, Profile, Category, Gamemode } from '../types';

/**
 * Fix: MOCK_PROFILES now correctly uses the global Record utility type
 * since the custom Record interface was renamed to GameRecord.
 */
const MOCK_PROFILES: Record<string, Profile> = {
  'p1': {
    id: 'p1',
    username: 'Dream',
    avatar_url: 'https://picsum.photos/seed/dream/100',
    role: 'player',
    created_at: new Date().toISOString()
  },
  'mod1': {
    id: 'mod1',
    username: 'Hypixel_Mod',
    avatar_url: 'https://picsum.photos/seed/mod/100',
    role: 'moderator',
    created_at: new Date().toISOString()
  }
};

const MOCK_GAMEMODES: Gamemode[] = [
  { id: 'g1', name: 'SkyWars', slug: 'skywars', icon: '⚔️', description: 'Island survival combat', is_active: true, created_at: '' },
  { id: 'g2', name: 'BedWars', slug: 'bedwars', icon: '🛏️', description: 'Bed protection wars', is_active: true, created_at: '' }
];

const MOCK_CATEGORIES: Category[] = [
  { 
    id: 'c1', 
    gamemode_id: 'g1', 
    name: 'Fastest Solo Win', 
    metric_type: 'time', 
    difficulty_level: 'Hard', 
    estimated_effort: '20h+', 
    is_active: true, 
    created_at: '' 
  },
  { 
    id: 'c2', 
    gamemode_id: 'g2', 
    name: 'Most Kills (Single Match)', 
    metric_type: 'count', 
    difficulty_level: 'Legendary', 
    estimated_effort: '50h+', 
    is_active: true, 
    created_at: '' 
  }
];

/**
 * Fix: MOCK_RECORDS now uses GameRecord type.
 */
let MOCK_RECORDS: GameRecord[] = [
  {
    id: 'r1',
    user_id: 'p1',
    category_id: 'c1',
    value: 42.5,
    proof_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: MOCK_PROFILES['p1'],
    categories: { ...MOCK_CATEGORIES[0], gamemodes: MOCK_GAMEMODES[0] }
  },
  {
    id: 'r2',
    user_id: 'p1',
    category_id: 'c2',
    value: 28,
    proof_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'pending',
    notes: 'Used the new pearl clutching strategy.',
    created_at: new Date().toISOString(),
    profiles: MOCK_PROFILES['p1'],
    categories: { ...MOCK_CATEGORIES[1], gamemodes: MOCK_GAMEMODES[1] }
  }
];

const createMockQuery = (table: string, filterCol?: string, filterVal?: any) => {
  const getTableData = () => {
    switch (table) {
      case 'records':
        if (filterCol === 'category_id') return MOCK_RECORDS.filter(r => r.category_id === filterVal);
        if (filterCol === 'status') return MOCK_RECORDS.filter(r => r.status === filterVal);
        if (filterCol === 'user_id') return MOCK_RECORDS.filter(r => r.user_id === filterVal);
        return MOCK_RECORDS;
      case 'gamemodes':
        return MOCK_GAMEMODES;
      case 'categories':
        if (filterCol === 'gamemode_id') return MOCK_CATEGORIES.filter(c => c.gamemode_id === filterVal);
        return MOCK_CATEGORIES;
      case 'profiles':
        return Object.values(MOCK_PROFILES);
      default:
        return [];
    }
  };

  const data = getTableData();

  return {
    data,
    error: null,
    eq: (col: string, val: any) => createMockQuery(table, col, val),
    order: (col: string, options: any) => createMockQuery(table, filterCol, filterVal),
    single: () => ({ 
      data: table === 'profiles' ? (filterVal ? MOCK_PROFILES[filterVal] : MOCK_PROFILES['p1']) : (data[0] || null), 
      error: null 
    })
  };
};

export const mockSupabase = {
  auth: {
    getUser: () => ({ data: { user: { id: 'p1', email: 'dream@example.com' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: {} }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: (query?: string) => createMockQuery(table),
    insert: async (newData: any) => {
      const record = { 
        ...newData, 
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        status: 'pending',
        profiles: MOCK_PROFILES[newData.user_id || 'p1']
      };
      MOCK_RECORDS.unshift(record as any);
      return { data: record, error: null };
    },
    /**
     * Fix: update now returns an object with an async eq method to support chaining
     * as used in components/ModerationQueue.tsx.
     */
    update: (updates: any) => ({
      eq: async (col: string, val: any) => {
        if (table === 'records') {
          MOCK_RECORDS = MOCK_RECORDS.map(r => r.id === val ? { ...r, ...updates } : r);
        }
        return { data: updates, error: null };
      }
    }),
  })
};
