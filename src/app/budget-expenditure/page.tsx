'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRoleRoute } from '@/context/AuthContext';

export default function BudgetEstimationPage() {
    const router = useRouter();
    const { isAuthenticated, activeRole, user } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            // Not logged in, redirect to login
            router.push('/login');
            return;
        }

        if (activeRole) {
            // Redirect to role-specific page
            router.push(getRoleRoute(activeRole));
        }
    }, [isAuthenticated, activeRole, router]);

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
