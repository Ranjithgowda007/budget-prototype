'use client';

import React, { useState, useMemo } from 'react';
import { BudgetLineItem, HistoricalData, DDOEstimation } from '@/data/budget-estimation/types';
import { formatCurrency, MOCK_HISTORICAL_DATA } from '@/data/budget-estimation/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowLeft, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';

// Dynamic FY calculation
const getCurrentFY = () => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    // FY starts in April (month 3)
    return month >= 3 ? year : year - 1;
};

const currentFYStart = getCurrentFY();
const FY = {
    prev: `${currentFYStart - 1}-${String(currentFYStart).slice(2)}`,
    curr: `${currentFYStart}-${String(currentFYStart + 1).slice(2)}`,
    next: `${currentFYStart + 1}-${String(currentFYStart + 2).slice(2)}`,
    nextPlus1: `${currentFYStart + 2}-${String(currentFYStart + 3).slice(2)}`,
    nextPlus2: `${currentFYStart + 3}-${String(currentFYStart + 4).slice(2)}`,
};

interface ItemFormData {
    reviseEstimateCY: number;
    budgetEstimateNextYear: number;
    forwardEstimateY2: number;
    forwardEstimateY3: number;
    remarks: string;
}

interface TableBudgetGridProps {
    role: 'creator' | 'verifier' | 'approver';
    items: BudgetLineItem[];
    estimations: DDOEstimation[];
}

export function TableBudgetGrid({ role, items, estimations }: TableBudgetGridProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, ItemFormData>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [submittedItems, setSubmittedItems] = useState<Set<string>>(new Set());

    const getItemFormData = (itemId: string): ItemFormData => {
        return formData[itemId] || {
            reviseEstimateCY: 0,
            budgetEstimateNextYear: 0,
            forwardEstimateY2: 0,
            forwardEstimateY3: 0,
            remarks: ''
        };
    };

    const updateFormData = (itemId: string, field: keyof ItemFormData, value: number | string) => {
        setFormData(prev => ({
            ...prev,
            [itemId]: {
                ...getItemFormData(itemId),
                [field]: value
            }
        }));
    };

    const getHistory = (itemId: string): HistoricalData | undefined => {
        return MOCK_HISTORICAL_DATA.find(h => h.budgetLineItemId === itemId);
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const est = estimations.find(e => e.budgetLineItemId === item.id);
            const query = searchQuery.toLowerCase().trim();

            const matchesSearch = !query ||
                item.budgetHead?.toLowerCase().includes(query) ||
                item.scheme.toLowerCase().includes(query) ||
                item.objectHead.toLowerCase().includes(query) ||
                item.srNo?.toLowerCase().includes(query) ||
                item.schemeNomenclature?.toLowerCase().includes(query);

            const matchesStatus = statusFilter === 'all' || est?.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, estimations, searchQuery, statusFilter]);

    const handleSaveAll = () => {
        const itemsWithData = Object.keys(formData).filter(id =>
            formData[id].reviseEstimateCY > 0 || formData[id].budgetEstimateNextYear > 0
        );

        itemsWithData.forEach(id => {
            setSavedItems(prev => new Set(prev).add(id));
        });

        toast.success(`${itemsWithData.length} items saved successfully`);
    };

    const handleSubmitAll = () => {
        const itemsWithData = Object.keys(formData).filter(id =>
            formData[id].reviseEstimateCY > 0 && formData[id].budgetEstimateNextYear > 0
        );

        itemsWithData.forEach(id => {
            setSubmittedItems(prev => new Set(prev).add(id));
        });

        toast.success(`${itemsWithData.length} items submitted for verification`);
    };

    // Column definitions
    const columns = [
        { key: 'srNo', label: 'Sr.', width: 'w-12', sticky: true },
        { key: 'budgetHead', label: 'Budget Head', width: 'w-64', sticky: true },
        { key: 'schemeNomenclature', label: 'Scheme Name', width: 'w-40' },
        { key: 'chargedOrVoted', label: 'C/V', width: 'w-14' },
        { key: 'bePrev', label: `BE (${FY.prev})`, width: 'w-28' },
        { key: 'expPrev', label: `Exp. (${FY.prev})`, width: 'w-28' },
        { key: 'beCurr', label: `BE (${FY.curr})`, width: 'w-28' },
        { key: 'allotCurr', label: `Allot. (${FY.curr})`, width: 'w-28' },
        { key: 'expCutoff', label: 'Exp. Cutoff', width: 'w-28' },
        { key: 'proposedExp', label: 'Proposed Exp.*', width: 'w-32', editable: true },
        { key: 'totalRE', label: 'Total RE', width: 'w-28' },
        { key: 'reOverBE', label: '% RE/BE', width: 'w-20' },
        { key: 'be1', label: `BE1 (${FY.next})*`, width: 'w-32', editable: true },
        { key: 'be1OverBE', label: '% BE1/BE', width: 'w-20' },
        { key: 'be2', label: `BE2 (${FY.nextPlus1})`, width: 'w-32', editable: true },
        { key: 'be3', label: `BE3 (${FY.nextPlus2})`, width: 'w-32', editable: true },
        { key: 'remarks', label: 'DDO Remarks', width: 'w-48', editable: true },
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Fixed Header Section */}
            <header className="flex-shrink-0 bg-slate-50 px-4 pt-2">
                <div className="max-w-full mx-auto">
                    {/* Summary Strip */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <span className="text-amber-600 font-bold text-sm">
                                            {items.length}
                                        </span>
                                    </div>
                                    <span className="text-slate-600 text-sm">Total Items</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-sm">
                                            {submittedItems.size}
                                        </span>
                                    </div>
                                    <span className="text-slate-600 text-sm">Submitted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">
                                            {savedItems.size}
                                        </span>
                                    </div>
                                    <span className="text-slate-600 text-sm">Saved</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={16} /> Back
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter Row */}
                    <div className="flex items-center gap-3 pb-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                placeholder="Search by scheme, budget head, serial number..."
                                className="pl-9 h-10 bg-white border-slate-200 rounded-lg text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-auto h-10 px-3 bg-white border-slate-200 rounded-lg gap-2">
                                <Filter size={14} className="text-slate-500" />
                                <span className="text-slate-700 text-sm">Filter</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Drafts</SelectItem>
                                <SelectItem value="under_verification">Under Review</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex-1" />
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-10"
                            onClick={handleSaveAll}
                        >
                            <Save size={14} /> Save All
                        </Button>
                        {role === 'creator' && (
                            <Button
                                size="sm"
                                className="gap-2 h-10 bg-blue-600 hover:bg-blue-700"
                                onClick={handleSubmitAll}
                            >
                                <Check size={14} /> Submit All
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Scrollable Table Container */}
            <main className="flex-1 overflow-auto px-4 pb-4">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-auto max-h-[calc(100vh-200px)]">
                        <table className="w-full text-sm border-collapse">
                            {/* Sticky Header */}
                            <thead className="bg-slate-100 sticky top-0 z-20">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={col.key}
                                            className={cn(
                                                "px-2 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap",
                                                col.width,
                                                col.sticky && idx === 0 && "sticky left-0 z-30 bg-slate-100",
                                                col.sticky && idx === 1 && "sticky left-12 z-30 bg-slate-100 border-r border-slate-300",
                                                col.editable && "text-blue-800 bg-blue-50"
                                            )}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {filteredItems.map((item, rowIdx) => {
                                    const data = getItemFormData(item.id);
                                    const history = getHistory(item.id);
                                    const isSubmitted = submittedItems.has(item.id);
                                    const isSaved = savedItems.has(item.id);

                                    const totalRE = (history?.actualTillDate || 0) + (data.reviseEstimateCY || 0);
                                    const reOverBE = history?.fy1 && history.fy1 > 0
                                        ? ((totalRE - history.fy1) / history.fy1 * 100).toFixed(1)
                                        : null;
                                    const be1OverBE = history?.currentYearBE && history.currentYearBE > 0 && data.budgetEstimateNextYear
                                        ? ((data.budgetEstimateNextYear - history.currentYearBE) / history.currentYearBE * 100).toFixed(1)
                                        : null;

                                    return (
                                        <tr
                                            key={item.id}
                                            className={cn(
                                                "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                                                rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                                                isSubmitted && "bg-green-50/50",
                                                isSaved && !isSubmitted && "bg-blue-50/30"
                                            )}
                                        >
                                            {/* Sr. No - Sticky */}
                                            <td className="px-2 py-2 sticky left-0 z-10 bg-inherit font-bold text-blue-600 text-center">
                                                {item.srNo}
                                            </td>

                                            {/* Budget Head - Sticky */}
                                            <td className="px-2 py-2 sticky left-12 z-10 bg-inherit border-r border-slate-200">
                                                <code className="text-xs font-mono font-semibold text-slate-900">
                                                    {item.budgetHead}
                                                </code>
                                            </td>

                                            {/* Scheme Name */}
                                            <td className="px-2 py-2 text-slate-700 font-medium truncate max-w-[160px]" title={item.schemeNomenclature || item.scheme}>
                                                {item.schemeNomenclature || item.scheme}
                                            </td>

                                            {/* C/V */}
                                            <td className="px-2 py-2 text-center">
                                                <span className={cn(
                                                    "text-xs font-bold px-1.5 py-0.5 rounded",
                                                    item.chargedOrVoted === 'Charged' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                                                )}>
                                                    {item.chargedOrVoted === 'Charged' ? 'C' : 'V'}
                                                </span>
                                            </td>

                                            {/* BE (Prev FY) */}
                                            <td className="px-2 py-2 text-right font-mono text-slate-700">
                                                {formatCurrency(history?.fy1 || 0)}
                                            </td>

                                            {/* Exp (Prev FY) */}
                                            <td className="px-2 py-2 text-right font-mono text-slate-700">
                                                {formatCurrency(history?.actualTillDate || 0)}
                                            </td>

                                            {/* BE (Curr FY) */}
                                            <td className="px-2 py-2 text-right font-mono text-slate-700">
                                                {formatCurrency(history?.currentYearBE || 0)}
                                            </td>

                                            {/* Allotment (Curr FY) */}
                                            <td className="px-2 py-2 text-right font-mono text-slate-700">
                                                {formatCurrency(history?.currentYearBE || 0)}
                                            </td>

                                            {/* Exp Cutoff */}
                                            <td className="px-2 py-2 text-right font-mono text-slate-700">
                                                {formatCurrency(history?.actualTillDate || 0)}
                                            </td>

                                            {/* Proposed Exp - Editable */}
                                            <td className="px-1 py-1 bg-blue-50/50">
                                                <Input
                                                    type="number"
                                                    value={data.reviseEstimateCY || ''}
                                                    onChange={(e) => updateFormData(item.id, 'reviseEstimateCY', parseFloat(e.target.value) || 0)}
                                                    disabled={isSubmitted}
                                                    className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right"
                                                    placeholder="0"
                                                />
                                            </td>

                                            {/* Total RE - Calculated */}
                                            <td className="px-2 py-2 text-right font-mono font-semibold text-slate-900">
                                                {formatCurrency(totalRE)}
                                            </td>

                                            {/* % RE Over BE */}
                                            <td className={cn(
                                                "px-2 py-2 text-right font-mono text-xs",
                                                reOverBE && parseFloat(reOverBE) < 0 ? "text-red-600" : "text-slate-600"
                                            )}>
                                                {reOverBE ? `${reOverBE}%` : '—'}
                                            </td>

                                            {/* BE1 - Editable */}
                                            <td className="px-1 py-1 bg-blue-50/50">
                                                <Input
                                                    type="number"
                                                    value={data.budgetEstimateNextYear || ''}
                                                    onChange={(e) => updateFormData(item.id, 'budgetEstimateNextYear', parseFloat(e.target.value) || 0)}
                                                    disabled={isSubmitted}
                                                    className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right"
                                                    placeholder="0"
                                                />
                                            </td>

                                            {/* % BE1 Over BE */}
                                            <td className={cn(
                                                "px-2 py-2 text-right font-mono text-xs",
                                                be1OverBE && parseFloat(be1OverBE) < 0 ? "text-red-600" : "text-slate-600"
                                            )}>
                                                {be1OverBE ? `${be1OverBE}%` : '—'}
                                            </td>

                                            {/* BE2 - Editable */}
                                            <td className="px-1 py-1 bg-blue-50/50">
                                                <Input
                                                    type="number"
                                                    value={data.forwardEstimateY2 || ''}
                                                    onChange={(e) => updateFormData(item.id, 'forwardEstimateY2', parseFloat(e.target.value) || 0)}
                                                    disabled={isSubmitted}
                                                    className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right"
                                                    placeholder="0"
                                                />
                                            </td>

                                            {/* BE3 - Editable */}
                                            <td className="px-1 py-1 bg-blue-50/50">
                                                <Input
                                                    type="number"
                                                    value={data.forwardEstimateY3 || ''}
                                                    onChange={(e) => updateFormData(item.id, 'forwardEstimateY3', parseFloat(e.target.value) || 0)}
                                                    disabled={isSubmitted}
                                                    className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right"
                                                    placeholder="0"
                                                />
                                            </td>

                                            {/* Remarks - Editable */}
                                            <td className="px-1 py-1 bg-blue-50/50">
                                                <Input
                                                    type="text"
                                                    value={data.remarks || ''}
                                                    onChange={(e) => updateFormData(item.id, 'remarks', e.target.value)}
                                                    disabled={isSubmitted}
                                                    className="h-7 text-xs border-blue-200 focus:border-blue-400 bg-white"
                                                    placeholder="Remarks..."
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Empty State */}
                        {filteredItems.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <p className="text-lg font-medium">No budget lines found</p>
                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
