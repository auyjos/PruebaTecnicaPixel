'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'; // Added useMemo
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      setCurrentUser(prevUser => {
        // Only update if a different user ID, prevents re-renders on token refresh
        if (user && prevUser?.uid === user.uid) {
          return prevUser;
        }
        return user;
      });
      setLoading(prev => prev ? false : prev); // Only transition from true->false once
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ currentUser, loading }), [currentUser, loading]); // Wrapped value in useMemo

  return (
    <AuthContext.Provider value={value}>
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
