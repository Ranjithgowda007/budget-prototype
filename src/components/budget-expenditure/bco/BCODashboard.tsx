'use client';

import React from 'react';
import { PlusCircle, Search, Filter, FileText, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/budget-expenditure/shared/StatusBadge';
import { MOCK_ESTIMATIONS, MOCK_BUDGET_LINE_ITEMS, getBudgetLineItemById } from '@/data/budget-expenditure/mockData';
import { formatCurrency } from '@/data/budget-expenditure/mockData';

export function BCODashboard() {
    // Get BCO estimations (approved by DDO, waiting for BCO workflow)
    const bcoEstimations = MOCK_ESTIMATIONS.filter(est =>
        est.currentLevel.startsWith('bco') || est.status === 'approved'
    );

    const stats = [
        {
            icon: FileText,
            label: 'DDO Submissions',
            value: bcoEstimations.length,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: Clock,
            label: 'Pending Review',
            value: bcoEstimations.filter(e => e.currentLevel === 'bco_creator').length,
            color: 'bg-amber-100 text-amber-600'
        },
        {
            icon: CheckCircle,
            label: 'Compiled',
            value: bcoEstimations.filter(e => e.status === 'approved').length,
            color: 'bg-emerald-100 text-emerald-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">BCO Budget Compilation</h1>
                    <p className="text-slate-500 mt className-1">Review and compile DDO estimations</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DDO Estimations List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">DDO Estimations for Review</h2>
                    <p className="text-sm text-slate-500 mt-1">Review estimations submitted by DDOs</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">DDO</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Scheme</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">BE (Next Year)</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Submitted</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bcoEstimations.map((estimation) => {
                                const budgetLine = getBudgetLineItemById(estimation.budgetLineItemId);
                                return (
                                    <tr key={estimation.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{budgetLine?.ddoName}</p>
                                                <p className="text-sm text-slate-500">{budgetLine?.ddoCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{budgetLine?.scheme}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{formatCurrency(estimation.budgetEstimateNextYear)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={estimation.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-500">
                                                {estimation.submittedAt ? new Date(estimation.submittedAt).toLocaleDateString() : '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/budget/budget-expenditure/bco-creator/review/${estimation.id}`}>
                                                <Button variant="ghost" size="sm">Review</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
