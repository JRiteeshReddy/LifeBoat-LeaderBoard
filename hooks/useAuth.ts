
import { useState, useEffect } from 'react';
import { mockSupabase } from '../services/mockSupabase';
import { Profile } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Simulate checking session from localStorage/cookies
      const storedUser = localStorage.getItem('lb_session');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        const { data } = await mockSupabase.from('profiles').select().eq('id', u.id).single();
        setProfile(data as Profile);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string) => {
    // For testing: 'admin@lifeboat.com' becomes an admin
    const role = email === 'admin@lifeboat.com' ? 'admin' : 'player';
    const mockUser = { id: role === 'admin' ? 'mod1' : 'p1', email };
    
    localStorage.setItem('lb_session', JSON.stringify(mockUser));
    setUser(mockUser);
    
    const { data } = await mockSupabase.from('profiles').select().eq('id', mockUser.id).single();
    setProfile(data as Profile);
  };

  const logout = () => {
    localStorage.removeItem('lb_session');
    setUser(null);
    setProfile(null);
  };

  return { user, profile, loading, login, logout, setProfile };
};
