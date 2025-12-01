import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    color: string;
}

export function StatsCard({ label, value, change, trend, color }: StatsCardProps) {
    const trendColor = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-orange-600'
    }[trend];

    const TrendIcon = {
        up: ArrowUpRight,
        down: ArrowDownRight,
        neutral: Minus
    }[trend];

    const bgColors: any = {
        blue: 'bg-blue-50 border-blue-100',
        red: 'bg-red-50 border-red-100',
        green: 'bg-green-50 border-green-100',
        orange: 'bg-orange-50 border-orange-100'
    };

    const textColors: any = {
        blue: 'text-blue-600',
        red: 'text-red-600',
        green: 'text-green-600',
        orange: 'text-orange-600'
    };

    return (
        <Card className={cn("shadow-sm hover:shadow-md transition-shadow h-full", bgColors[color] || 'bg-white')}>
            <CardContent className="p-6">
                <p className={cn("text-xs font-semibold uppercase tracking-wider mb-1", textColors[color] || 'text-slate-500')}>{label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{value}</h3>
                <div className={cn("flex items-center text-xs font-medium", trendColor)}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    <span>{change}</span>
                </div>
            </CardContent>
        </Card>
    );
}
