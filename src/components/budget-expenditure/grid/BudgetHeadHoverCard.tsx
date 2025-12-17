'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BudgetLineItem, HistoricalData } from '@/data/budget-expenditure/types';
import { formatCurrency } from '@/data/budget-expenditure/mockData';

interface BudgetHeadHoverCardProps {
    children: React.ReactNode;
    budgetLine: BudgetLineItem;
    history?: HistoricalData;
}

export function BudgetHeadHoverCard({ children, budgetLine, history }: BudgetHeadHoverCardProps) {
    const [open, setOpen] = useState(false);

    // Transform history data for chart
    const data = history ? [
        { name: 'Year 5', amount: history.fy5 },
        { name: 'Year 4', amount: history.fy4 },
        { name: 'Year 3', amount: history.fy3 },
        { name: 'Year 2', amount: history.fy2 },
        { name: 'Year 1', amount: history.fy1 },
        { name: 'Current', amount: history.currentYearBE },
    ] : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className="cursor-help decoration-slate-400 decoration-dotted underline-offset-2"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    {children}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-96 p-0 overflow-hidden shadow-xl border-slate-200"
                side="right"
                align="start"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-100">
                    <p className="font-mono text-xs text-slate-500 mb-1">{budgetLine.budgetHead}</p>
                    <p className="font-semibold text-slate-900 text-sm">{budgetLine.scheme}</p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-500 block">Object Head</span>
                            <span className="font-medium text-slate-900">{budgetLine.objectHead}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Detail Head</span>
                            <span className="font-medium text-slate-900">{budgetLine.detailHead}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Type</span>
                            <span className={`font-medium ${budgetLine.chargedOrVoted === 'Charged' ? 'text-amber-600' : 'text-slate-900'}`}>
                                {budgetLine.chargedOrVoted}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Ceiling Limit</span>
                            <span className="font-medium text-emerald-600">{formatCurrency(budgetLine.ceilingLimit)}</span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-32 w-full pt-2 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-2">Expenditure Trend (Last 5 Years)</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '10px' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 2, fill: '#3b82f6', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex justify-between items-center text-xs bg-slate-50 -mx-4 -mb-4 px-4 py-2 border-t border-slate-100">
                        <span className="text-slate-500">Expenditure</span>
                        <span className="font-bold text-slate-900">{formatCurrency(history?.actualTillDate || 0)}</span>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

