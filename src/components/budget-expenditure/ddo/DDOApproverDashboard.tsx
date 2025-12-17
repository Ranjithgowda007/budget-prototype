'use client';

import React, { useState } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/budget-expenditure/shared/StatusBadge';
import { MOCK_ESTIMATIONS, getBudgetLineItemById, formatCurrency } from '@/data/budget-expenditure/mockData';

export function DDOApproverDashboard() {
    const [searchTerm, setSearchTerm] = useState('');

    // Get estimations under approval
    const approverEstimations = MOCK_ESTIMATIONS.filter(est =>
        est.currentLevel === 'ddo_approver' || est.status === 'under_approval'
    );

    const stats = [
        {
            icon: FileText,
            label: 'Pending Approval',
            value: approverEstimations.length,
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: Clock,
            label: 'Today',
            value: approverEstimations.filter(e => new Date(e.verifiedAt || '').toDateString() === new Date().toDateString()).length,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: CheckCircle2,
            label: 'Approved This Month',
            value: 25,
            color: 'bg-emerald-100 text-emerald-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">DDO Approver - Budget Estimation</h1>
                    <p className="text-slate-500 mt-1">Review and approve budget estimations</p>
                </div>
                <Link href="/budget/budget-expenditure/ddo-approver/grid">
                    <Button variant="outline" className="gap-2">
                        <FileText size={20} />
                        Switch to Grid View
                    </Button>
                </Link>
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

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        placeholder="Search by scheme or DDO code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={20} />
                    Filter
                </Button>
            </div>

            {/* Estimations List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Scheme</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Budget Line</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">BE (Next Year)</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Verified</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {approverEstimations.map((estimation) => {
                                const budgetLine = getBudgetLineItemById(estimation.budgetLineItemId);
                                return (
                                    <tr key={estimation.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{budgetLine?.scheme}</p>
                                                <p className="text-sm text-slate-500">{budgetLine?.ddoCode}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="font-mono text-slate-700">{budgetLine?.budgetHead || `${budgetLine?.demandNo}-${budgetLine?.majorHead}-${budgetLine?.subMajorHead}-${budgetLine?.minorHead}-${budgetLine?.segmentHead}-${budgetLine?.ddoCode?.split('/')[1]}-${budgetLine?.chargedOrVoted === 'Charged' ? 'C' : 'V'}-${budgetLine?.objectHead}-${budgetLine?.detailHead}`}</p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{formatCurrency(estimation.budgetEstimateNextYear)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={estimation.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-500">
                                                {estimation.verifiedAt ? new Date(estimation.verifiedAt).toLocaleString() : '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/budget/budget-expenditure/ddo-approver/review/${estimation.id}`}>
                                                <Button size="sm">Review</Button>
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
