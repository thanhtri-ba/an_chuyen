import { createContext, useContext, useState, useEffect } from'react';
import api from'../lib/api';

interface User {
 id: string;
 email: string;
 fullName: string;
 role: string;
}

interface AuthContextType {
 user: User | null;
 token: string | null;
 login: (token: string, user: User) => void;
 logout: () => void;
 isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null);
 const [token, setToken] = useState<string | null>(localStorage.getItem('busz_token'));
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const initAuth = async () => {
 if (token) {
 try {
 const res = await api.get('/auth/profile');
 if (res.data && res.data.data) {
 setUser(res.data.data);
 }
 } catch (error) {
 console.error("Failed to fetch profile", error);
 setToken(null);
 localStorage.removeItem('busz_token');
 }
 }
 setIsLoading(false);
 };

 initAuth();
 }, [token]);

 const login = (newToken: string, userData: User) => {
 localStorage.setItem('busz_token', newToken);
 setToken(newToken);
 setUser(userData);
 };

 const logout = () => {
 localStorage.removeItem('busz_token');
 setToken(null);
 setUser(null);
 };

 return (
 <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
 {children}
 </AuthContext.Provider>
 );
}

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (context === undefined) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};
