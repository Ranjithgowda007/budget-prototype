import React from 'react';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { MODULE_NAVIGATION } from '@/data/navigation';
import { getModuleById } from '@/config/modules';

interface ModuleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ module: string }>;
}

export default async function ModuleLayout({ children, params }: ModuleLayoutProps) {
    const { module: moduleId } = await params;

    // Validate module exists
    const moduleConfig = getModuleById(moduleId);
    if (!moduleConfig) {
        notFound();
    }

    // Get navigation items for this module
    // Fallback to empty array if no specific navigation defined
    const navigationItems = MODULE_NAVIGATION[moduleId] || [];

    return (
        <Layout sidebarItems={navigationItems}>
            {children}
        </Layout>
    );
}
