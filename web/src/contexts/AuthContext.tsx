import { createContext, useContext, useState, useEffect } from'react';
import api from'../lib/api';

import type { User } from '../types';

interface AuthContextType {
 user: User | null;
 token: string | null;
 login: (token: string, user: User) => void;
 logout: () => void;
 updateUser: (user: User) => void;
 isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [user, setUser] = useState<User | null>(null);
 const [token, setToken] = useState<string | null>(sessionStorage.getItem('busz_token'));
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
 sessionStorage.removeItem('busz_token');
 }
 }
 setIsLoading(false);
 };

 initAuth();
 }, [token]);

 const login = (newToken: string, userData: User) => {
 sessionStorage.setItem('busz_token', newToken);
 setToken(newToken);
 setUser(userData);
 };

 const logout = () => {
 sessionStorage.removeItem('busz_token');
 setToken(null);
 setUser(null);
 };

 const updateUser = (userData: User) => {
 setUser(userData);
 };

 return (
 <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
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
