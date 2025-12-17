import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MODULE_NAVIGATION } from '@/data/navigation';

export default function BudgetEstimationLayout({ children }: { children: React.ReactNode }) {
    // Use budget module navigation
    const navigationItems = MODULE_NAVIGATION['budget'] || [];

    return (
        <Layout sidebarItems={navigationItems}>
            {children}
        </Layout>
    );
}
