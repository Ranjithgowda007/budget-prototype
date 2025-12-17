'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authenticateUser as authUser } from '@/data/users';

type Role = 'creator' | 'verifier' | 'approver';

interface AuthContextType {
    user: User | null;
    activeRole: Role | null;
    isAuthenticated: boolean;
    login: (userId: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
    switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ifmis_auth_user';
const ROLE_STORAGE_KEY = 'ifmis_active_role';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [activeRole, setActiveRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser) as User;
                setUser(parsedUser);

                // Set active role - prefer stored role if valid, otherwise use first role
                if (storedRole && parsedUser.roles.includes(storedRole as Role)) {
                    setActiveRole(storedRole as Role);
                } else {
                    setActiveRole(parsedUser.roles[0]);
                }
            }
        } catch (e) {
            console.error('Error loading auth state:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userId: string, password: string): { success: boolean; error?: string } => {
        const authenticatedUser = authUser(userId, password);

        if (authenticatedUser) {
            // Update last login time
            const userWithUpdatedLogin = {
                ...authenticatedUser,
                lastLogin: new Date().toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            setUser(userWithUpdatedLogin);
            setActiveRole(authenticatedUser.roles[0]);

            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithUpdatedLogin));
            localStorage.setItem(ROLE_STORAGE_KEY, authenticatedUser.roles[0]);

            return { success: true };
        }

        return { success: false, error: 'Invalid User ID or Password' };
    };

    const logout = () => {
        setUser(null);
        setActiveRole(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(ROLE_STORAGE_KEY);
    };

    const switchRole = (role: Role) => {
        if (user && user.roles.includes(role)) {
            setActiveRole(role);
            localStorage.setItem(ROLE_STORAGE_KEY, role);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                activeRole,
                isAuthenticated: !!user,
                login,
                logout,
                switchRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper to get role display name
export function getRoleDisplayName(role: Role): string {
    switch (role) {
        case 'creator': return 'DDO Creator';
        case 'verifier': return 'DDO Verifier';
        case 'approver': return 'DDO Approver';
        default: return role;
    }
}

// Helper to get role route
export function getRoleRoute(role: Role): string {
    switch (role) {
        case 'creator': return '/budget/budget-expenditure/ddo-creator';
        case 'verifier': return '/budget/budget-expenditure/ddo-verifier';
        case 'approver': return '/budget/budget-expenditure/ddo-approver';
        default: return '/budget/budget-expenditure/ddo-creator';
    }
}
