'use client';

import React from 'react';
import { BudgetLineItem } from '@/data/budget-expenditure/types';
import { cn } from '@/lib/utils';

interface BudgetLineItemCardProps {
    item: BudgetLineItem;
    className?: string;
}

export function BudgetLineItemCard({ item, className }: BudgetLineItemCardProps) {
    const fields = [
        { label: 'Demand No', value: item.demandNo },
        { label: 'Major Head', value: item.majorHead },
        { label: 'Sub Major Head', value: item.subMajorHead },
        { label: 'Minor Head', value: item.minorHead },
        { label: 'Segment Head', value: item.segmentHead },
        { label: 'Scheme', value: item.scheme },
        { label: 'Project', value: item.project || 'N/A' },
        { label: 'Object Head', value: item.objectHead },
        { label: 'Detail Head', value: item.detailHead },
        { label: 'Charged/Voted', value: item.chargedOrVoted }
    ];

    return (
        <div className={cn("bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200", className)}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.scheme}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.ddoName}</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {item.ddoCode}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {fields.map(field => (
                    <div key={field.label} className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium mb-1">{field.label}</span>
                        <span className="text-sm font-semibold text-slate-800">{field.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Ceiling Limit</span>
                    <span className="text-lg font-bold text-emerald-600">
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0
                        }).format(item.ceilingLimit)}
                    </span>
                </div>
            </div>
        </div>
    );
}
