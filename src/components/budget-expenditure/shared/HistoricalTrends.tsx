'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoricalData } from '@/data/budget-expenditure/types';
import { formatCurrency } from '@/data/budget-expenditure/mockData';

interface HistoricalTrendsProps {
    data: HistoricalData;
}

export function HistoricalTrends({ data }: HistoricalTrendsProps) {
    const chartData = [
        { year: 'FY-5', amount: data.fy5 },
        { year: 'FY-4', amount: data.fy4 },
        { year: 'FY-3', amount: data.fy3 },
        { year: 'FY-2', amount: data.fy2 },
        { year: 'FY-1', amount: data.fy1 },
        { year: 'Current BE', amount: data.currentYearBE }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">{payload[0].payload.year}</p>
                    <p className="text-sm text-blue-600 font-bold">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">5-Year Expenditure Trend</h3>

            <div className="mb-6">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="year"
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => `₹${(value / 10000000).toFixed(0)}Cr`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Expenditure"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Actual Till Date</p>
                    <p className="text-base font-bold text-emerald-600">{formatCurrency(data.actualTillDate)}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Projected Balance</p>
                    <p className="text-base font-bold text-amber-600">{formatCurrency(data.projectedBalance)}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Total Expected</p>
                    <p className="text-base font-bold text-blue-600">
                        {formatCurrency(data.actualTillDate + data.projectedBalance)}
                    </p>
                </div>
            </div>
        </div>
    );
}
