import React from 'react';
import { StatsCard } from './common/StatsCard';
import { ChartCard } from './common/ChartCard';
import { ActivityList } from './common/ActivityList';
import { ModuleListWidget } from './dashboard/ModuleListWidget';
import { MOCK_STATS } from '@/data/mockData';

export interface WidgetDefinition {
    id: string;
    label: string;
    component: React.ReactNode;
    defaultSize?: 'small' | 'medium' | 'large' | 'full';
    moduleId?: string; // 'common', 'dashboard', 'budget', etc.
}

// Helper to create stats widgets with mock data
const createStatsWidget = (id: string, index: number) => ({
    id,
    label: MOCK_STATS[index].label,
    component: <StatsCard {...MOCK_STATS[index]} trend={MOCK_STATS[index].trend as 'up' | 'down' | 'neutral'} />,
    defaultSize: 'small' as const,
    moduleId: 'common'
});

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
    // Common Widgets
    'stats-total': createStatsWidget('stats-total', 0),
    'stats-expenditure': createStatsWidget('stats-expenditure', 1),
    'stats-remaining': createStatsWidget('stats-remaining', 2),
    'stats-pending': createStatsWidget('stats-pending', 3),
    'chart-main': {
        id: 'chart-main',
        label: 'Expenditure Trends',
        component: <ChartCard />,
        defaultSize: 'medium',
        moduleId: 'common'
    },
    'activity-list': {
        id: 'activity-list',
        label: 'Recent Activity',
        component: <ActivityList />,
        defaultSize: 'medium',
        moduleId: 'common'
    },

    // Dashboard Widgets
    'module-list': {
        id: 'module-list',
        label: 'Module List',
        component: <ModuleListWidget />,
        defaultSize: 'full',
        moduleId: 'dashboard'
    },

    // Budget Widgets (Placeholders for now)
    // Add more widgets here as they are created
};

export function getWidgetById(id: string): WidgetDefinition | undefined {
    return WIDGET_REGISTRY[id];
}

export function getWidgetsByModule(moduleId: string): WidgetDefinition[] {
    return Object.values(WIDGET_REGISTRY).filter(w => w.moduleId === moduleId || w.moduleId === 'common');
}
