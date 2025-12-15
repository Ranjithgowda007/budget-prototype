'use client';

import React, { useState } from 'react';
import { PlusCircle, Search, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/budget-estimation/shared/StatusBadge';
import { MOCK_ESTIMATIONS, MOCK_BUDGET_LINE_ITEMS, getBudgetLineItemById } from '@/data/budget-estimation/mockData';
import { formatCurrency } from '@/data/budget-estimation/mockData';

export function DDODashboard() {
    const [searchTerm, setSearchTerm] = useState('');

    // Get DDO estimations (draft, returned, or under DDO workflow)
    const ddoEstimations = MOCK_ESTIMATIONS.filter(est =>
        est.currentLevel.startsWith('ddo')
    );

    const stats = [
        {
            icon: FileText,
            label: 'Total Estimations',
            value: ddoEstimations.length,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: Clock,
            label: 'Pending',
            value: ddoEstimations.filter(e => e.status === 'draft' || e.status === 'returned').length,
            color: 'bg-amber-100 text-amber-600'
        },
        {
            icon: CheckCircle,
            label: 'Approved',
            value: ddoEstimations.filter(e => e.status === 'approved').length,
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            icon: XCircle,
            label: 'Returned',
            value: ddoEstimations.filter(e => e.status === 'returned').length,
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    const filteredEstimations = ddoEstimations.filter(est => {
        const budgetLine = getBudgetLineItemById(est.budgetLineItemId);
        return budgetLine?.scheme.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budgetLine?.ddoCode.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">DDO Budget Estimation</h1>
                    <p className="text-slate-500 mt-1">Create and manage budget estimations</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/budget-estimation/ddo-creator/grid">
                        <Button className="gap-2 shadow-lg shadow-blue-200">
                            <FileText size={20} />
                            Open Grid View
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Search and Filters */}
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Modified</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEstimations.map((estimation) => {
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
                                                {new Date(estimation.modifiedAt || estimation.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href="/budget-estimation/ddo-creator/grid">
                                                <Button variant="ghost" size="sm">View</Button>
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
