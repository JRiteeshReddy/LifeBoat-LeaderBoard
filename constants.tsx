
import React from 'react';

export const GAMES = [
  { id: '1', name: 'SkyWars', slug: 'skywars', icon: '⚔️', description: 'Fast-paced aerial combat.' },
  { id: '2', name: 'BedWars', slug: 'bedwars', icon: '🛏️', description: 'Protect your base, destroy the beds.' },
  { id: '3', name: 'Survival Games', slug: 'survival-games', icon: '🏹', description: 'The original battle royale.' },
  { id: '4', name: 'Parkour', slug: 'parkour', icon: '🏃', description: 'Test your agility and speed.' },
];

export const LEADERBOARDS = [
  { id: 'lb-1', game_id: '1', name: 'Fastest Win', unit: 'seconds', description: 'Quickest time to eliminate all opponents.' },
  { id: 'lb-2', game_id: '1', name: 'Most Kills', unit: 'kills', description: 'High-score of kills in a single match.' },
  { id: 'lb-3', game_id: '4', name: 'Speedrun Course A', unit: 'seconds', description: 'Complete Course A as fast as possible.' },
];

export const Icons = {
  Trophy: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Video: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
    </svg>
  ),
};
