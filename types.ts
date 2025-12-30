
export type UserRole = 'player' | 'moderator' | 'admin';
export type MetricType = 'time' | 'count' | 'score';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio?: string;
  discord_link?: string;
  role: UserRole;
  created_at: string;
}

export interface Gamemode {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  gamemode_id: string;
  name: string;
  metric_type: MetricType;
  rules?: string;
  difficulty_level?: string;
  estimated_effort?: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Renamed from Record to GameRecord to avoid shadowing built-in TypeScript Record type.
 */
export interface GameRecord {
  id: string;
  user_id: string;
  category_id: string;
  value: number;
  proof_url: string;
  status: VerificationStatus;
  notes?: string;
  moderator_feedback?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  // Joins
  profiles?: Profile;
  categories?: Category & { gamemodes?: Gamemode };
}

export interface ModerationLog {
  id: string;
  moderator_id: string;
  record_id: string;
  action_type: string;
  notes?: string;
  created_at: string;
}
