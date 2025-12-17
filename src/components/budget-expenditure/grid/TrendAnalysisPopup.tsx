'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BudgetLineItem, HistoricalData } from '@/data/budget-expenditure/types';
import { formatCurrency } from '@/data/budget-expenditure/mockData';
import { Button } from '@/components/ui/button';
import { TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendAnalysisPopupProps {
    budgetLine: BudgetLineItem;
    history?: HistoricalData;
}

export function TrendAnalysisPopup({ budgetLine, history }: TrendAnalysisPopupProps) {
    const [open, setOpen] = useState(false);

    // Transform history data for chart
    const data = history ? [
        { year: 'FY-5', expenditure: history.fy5 / 10000000 },
        { year: 'FY-4', expenditure: history.fy4 / 10000000 },
        { year: 'FY-3', expenditure: history.fy3 / 10000000 },
        { year: 'FY-2', expenditure: history.fy2 / 10000000 },
        { year: 'FY-1', expenditure: history.fy1 / 10000000 },
        { year: 'Current BE', expenditure: history.currentYearBE / 10000000 },
    ] : [];

    const growthPercent = history?.fy1 && history?.fy5
        ? ((history.fy1 - history.fy5) / history.fy5 * 100).toFixed(1)
        : null;

    // 3-Year Medium Term Estimate Data (Rolling Budget - BE1, BE2, BE3)
    // Using mock data based on current BE with growth projections
    const currentBE = history?.currentYearBE || 0;
    const be1 = currentBE * 1.05; // 5% growth estimate for next year
    const be2 = be1 * 1.05; // 5% growth for year+1
    const be3 = be2 * 1.05; // 5% growth for year+2

    const mtefData = [
        { year: 'Current FY', estimate: currentBE / 10000000 },
        { year: 'FY+1 (BE1)', estimate: be1 / 10000000 },
        { year: 'FY+2 (BE2)', estimate: be2 / 10000000 },
        { year: 'FY+3 (BE3)', estimate: be3 / 10000000 },
    ];

    return (
        <>
            {/* Trigger Button */}
            <div
                className="relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                    <TrendingUp size={18} />
                </Button>

                {/* Centered Modal Overlay - only visible while hovering on button */}
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

                        {/* Modal */}
                        <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-mono text-xs text-blue-300 mb-1">{budgetLine.budgetHead}</p>
                                        <h3 className="font-bold text-white text-lg leading-tight mb-3">
                                            {budgetLine.scheme}
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Object Head</p>
                                                <p className="text-sm font-medium text-white">{budgetLine.objectHead}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Detail Head</p>
                                                <p className="text-sm font-medium text-white">{budgetLine.detailHead}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold",
                                        budgetLine.chargedOrVoted === 'Charged'
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-slate-700 text-white'
                                    )}>
                                        {budgetLine.chargedOrVoted}
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section - 5 Year Trend */}
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-base font-bold text-slate-900">5-Year Expenditure Trend</h4>
                                    {growthPercent && (
                                        <span className={cn(
                                            "text-sm font-bold px-3 py-1 rounded-full",
                                            parseFloat(growthPercent) >= 0
                                                ? "text-emerald-600 bg-emerald-50"
                                                : "text-red-600 bg-red-50"
                                        )}>
                                            {parseFloat(growthPercent) >= 0 ? '+' : ''}{growthPercent}% Growth
                                        </span>
                                    )}
                                </div>

                                <div className="h-44 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis
                                                dataKey="year"
                                                tick={{ fontSize: 11, fill: '#64748b' }}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#64748b' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) => `₹${value}Cr`}
                                                width={55}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#0f172a',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    color: '#fff',
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                                }}
                                                formatter={(value: number) => [`₹${(value).toFixed(2)} Cr`, 'Expenditure']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="expenditure"
                                                stroke="#3b82f6"
                                                strokeWidth={2.5}
                                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5, stroke: '#fff' }}
                                                activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff', strokeWidth: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-center mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span>Historical Expenditure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section - 3 Year Rolling Budget (MTEF) */}
                            <div className="p-5 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-base font-bold text-slate-900">Medium Term Estimate (Rolling Budget)</h4>
                                    <span className="text-xs font-medium px-2 py-1 rounded bg-violet-100 text-violet-700">
                                        3-Year MTEF
                                    </span>
                                </div>

                                <div className="h-36 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mtefData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                            <XAxis
                                                dataKey="year"
                                                tick={{ fontSize: 11, fill: '#64748b' }}
                                                axisLine={{ stroke: '#e2e8f0' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: '#64748b' }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) => `₹${value}Cr`}
                                                width={55}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#0f172a',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    color: '#fff',
                                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                                }}
                                                formatter={(value: number) => [`₹${(value).toFixed(2)} Cr`, 'Budget Estimate']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="estimate"
                                                stroke="#8b5cf6"
                                                strokeWidth={2.5}
                                                strokeDasharray="5 5"
                                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5, stroke: '#fff' }}
                                                activeDot={{ r: 7, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-center mt-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <div className="w-3 h-0.5 bg-violet-500" style={{ borderTop: '2px dashed #8b5cf6', width: '16px' }} />
                                        <span>Projected Estimates (BE1 → BE2 → BE3)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
