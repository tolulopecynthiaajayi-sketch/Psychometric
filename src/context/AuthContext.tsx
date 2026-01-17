import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            console.warn("AuthContext: Firebase Auth not initialized (likely missing keys).");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // SAFETY FALLBACK: Force loading to false after 3 seconds
        // This prevents the app from hanging if Firebase is blocked (e.g. by extensions or strict mobile networks)
        const safetyTimer = setTimeout(() => {
            setLoading((current) => {
                if (current) {
                    console.warn("AuthContext: Firebase timed out, forcing app load.");
                    return false;
                }
                return current;
            });
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    const logout = async () => {
        if (auth) {
            await firebaseSignOut(auth);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
