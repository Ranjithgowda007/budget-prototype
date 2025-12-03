import React from 'react';
import { notFound } from 'next/navigation';
import { getModuleById } from '@/config/modules';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

interface ModulePageProps {
    params: Promise<{ module: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
    const { module: moduleId } = await params;
    const moduleConfig = getModuleById(moduleId);

    if (!moduleConfig) {
        notFound();
    }

    if (moduleId === 'dashboard') {
        return (
            <>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary mt-1">Select a module to get started.</p>
                </div>
                <DashboardGrid defaultWidgets={['module-list']} />
            </>
        );
    }

    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary">{moduleConfig.name}</h1>
            <p className="text-text-secondary mt-1">{moduleConfig.description || `Welcome to ${moduleConfig.name}`}</p>

            <div className="mt-8">
                <DashboardGrid />
            </div>
        </div>
    );
}
