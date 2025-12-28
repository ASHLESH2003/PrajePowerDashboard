import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { User, Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // TRACKER: Keeps track if we are already logged in, without triggering re-renders
  const isLoggedInRef = useRef(false);

  // Helper: Fetch Profile with Timeout Safety
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );

      const dbPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data } = await Promise.race([dbPromise, timeoutPromise]) as any;

      if (data) {
        return {
          id: data.id,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email: data.email,
          role: (data.role as Role) || Role.Citizen,
          contact: data.phone || '',
          username: data.email?.split('@')[0] || 'user',
          password: '' 
        } as User;
      }
    } catch (err) {
      // Silent error
    }

    // Fallback User
    return {
        id: userId,
        name: 'Admin User',
        email: email,
        role: Role.Administrator,
        contact: '',
        username: 'admin',
        password: ''
    } as User;
  };

  const updateUserState = (user: User) => {
      setCurrentUser(user);
      isLoggedInRef.current = true; // Mark as logged in
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
           const user = await fetchProfile(session.user.id, session.user.email || '');
           if (mounted) updateUserState(user);
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Global Safety Timer
    const safetyTimer = setTimeout(() => {
        if (loading) setLoading(false);
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        isLoggedInRef.current = false; // Mark as logged out
        setLoading(false);
      } 
      else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        
        // --- THE FIX ---
        // Only show loading screen if we are NOT already logged in.
        // If we are switching tabs (isLoggedInRef is true), we skip this and update silently.
        if (!isLoggedInRef.current) {
            setLoading(true);
        }

        try {
            const user = await fetchProfile(session.user.id, session.user.email || '');
            if (mounted) updateUserState(user);
        } finally {
            if (mounted) setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    isLoggedInRef.current = false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
           <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};