'use client';

import React, { useState, useMemo } from 'react';
import { BudgetLineItem, HistoricalData, EstimationRecord } from '@/data/budget-expenditure/types';
import { formatCurrency, MOCK_HISTORICAL_DATA } from '@/data/budget-expenditure/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowLeft, Save, Check, Columns, Eye, EyeOff, Upload, Download, RotateCcw, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { requiresBreakup } from '@/data/budget-expenditure/breakupConfig';
import { BreakupModal, BreakupItem } from './BreakupModal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

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
    estimations: EstimationRecord[];
    viewToggle?: React.ReactNode;
}

export function TableBudgetGrid({ role, items, estimations, viewToggle }: TableBudgetGridProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, ItemFormData>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [submittedItems, setSubmittedItems] = useState<Set<string>>(new Set());

    // Breakup modal state
    const [breakupModalOpen, setBreakupModalOpen] = useState(false);
    const [activeBreakupLine, setActiveBreakupLine] = useState<BudgetLineItem | null>(null);
    const [breakupData, setBreakupData] = useState<Record<string, BreakupItem[]>>({});

    // Column visibility state - all visible by default
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
        'srNo', 'budgetHead', 'schemeNomenclature', 'chargedOrVoted',
        'bePrev', 'expPrev', 'beCurr', 'allotCurr', 'expCutoff',
        'proposedExp', 'totalRE', 'reOverBE', 'be1', 'be1OverBE',
        'be2', 'be3', 'remarks'
    ]));

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

    // Count returned items
    const returnedCount = estimations.filter(est => est.status === 'returned').length;
    // Count completed items (saved + submitted)
    const completedCount = savedItems.size + submittedItems.size;
    // Pending items = total - completed - returned
    const pendingCount = items.length - completedCount - returnedCount;

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
        { key: 'srNo', label: 'Sr. No', width: 'w-12', sticky: true },
        { key: 'budgetHead', label: 'Budget Head', width: 'w-64', sticky: true },
        { key: 'schemeNomenclature', label: 'Scheme Name', width: 'w-40' },
        { key: 'chargedOrVoted', label: 'Charged/Voted', width: 'w-14' },
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

    // Toggle column visibility
    const toggleColumn = (key: string) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                // Don't allow hiding sticky columns
                const col = columns.find(c => c.key === key);
                if (col?.sticky) {
                    toast.error('Cannot hide sticky columns');
                    return prev;
                }
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const selectAllColumns = () => {
        setVisibleColumns(new Set(columns.map(c => c.key)));
    };

    const deselectNonEssential = () => {
        // Keep only sticky columns and editable columns
        setVisibleColumns(new Set(columns.filter(c => c.sticky || c.editable).map(c => c.key)));
    };

    // Get visible columns
    const displayColumns = columns.filter(col => visibleColumns.has(col.key));

    // Handle breakup save - update BE1 with total
    const handleBreakupSave = (items: BreakupItem[], total: number) => {
        if (activeBreakupLine) {
            setBreakupData(prev => ({
                ...prev,
                [activeBreakupLine.id]: items
            }));
            updateFormData(activeBreakupLine.id, 'budgetEstimateNextYear', total);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Breakup Modal */}
            {activeBreakupLine && (
                <BreakupModal
                    budgetLine={activeBreakupLine}
                    isOpen={breakupModalOpen}
                    onOpenChange={setBreakupModalOpen}
                    onSave={handleBreakupSave}
                    initialData={breakupData[activeBreakupLine.id]}
                    isReadOnly={submittedItems.has(activeBreakupLine.id)}
                />
            )}

            {/* Fixed Header Section */}
            <header className="flex-shrink-0 bg-slate-50 px-4 pt-2">
                <div className="max-w-full mx-auto">
                    {/* Summary Strip */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 mb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                {/* Pending Card */}
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <Clock className="text-amber-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-medium">Pending</p>
                                        <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                {/* Completed Card */}
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="text-emerald-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-medium">Completed</p>
                                        <p className="text-xl font-bold text-slate-900">{completedCount}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                {/* Returned Card */}
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <RotateCcw className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-medium">Returned</p>
                                        <p className="text-xl font-bold text-slate-900">{returnedCount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* View Toggle + Back Button */}
                            <div className="flex items-center gap-3">
                                {viewToggle}
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

                        {/* Column Visibility Dropdown */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 h-10">
                                    <Columns size={14} />
                                    <span>Columns</span>
                                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {visibleColumns.size}/{columns.length}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-3" align="end">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm text-slate-900">Toggle Columns</h4>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs px-2"
                                                onClick={selectAllColumns}
                                            >
                                                <Eye size={12} className="mr-1" /> All
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs px-2"
                                                onClick={deselectNonEssential}
                                            >
                                                <EyeOff size={12} className="mr-1" /> Essential
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 pt-2 max-h-64 overflow-y-auto space-y-1">
                                        {columns.map(col => (
                                            <label
                                                key={col.key}
                                                className={cn(
                                                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors",
                                                    col.sticky && "bg-blue-50"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={visibleColumns.has(col.key)}
                                                    onCheckedChange={() => toggleColumn(col.key)}
                                                    disabled={col.sticky}
                                                />
                                                <span className={cn(
                                                    "text-sm flex-1",
                                                    col.sticky ? "text-blue-700 font-medium" : "text-slate-700"
                                                )}>
                                                    {col.label}
                                                </span>
                                                {col.sticky && (
                                                    <span className="text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">Fixed</span>
                                                )}
                                                {col.editable && (
                                                    <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Input</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="flex-1" />

                        {/* Import/Export Buttons */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-10"
                            onClick={() => toast.info('Import feature coming soon!')}
                        >
                            <Upload size={14} /> Import
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-10"
                            onClick={() => toast.info('Export feature coming soon!')}
                        >
                            <Download size={14} /> Export
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-10"
                            onClick={handleSaveAll}
                        >
                            <Save size={14} /> Save All
                        </Button>
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
                                    {displayColumns.map((col, idx) => {
                                        const isFirstSticky = col.key === 'srNo';
                                        const isSecondSticky = col.key === 'budgetHead';
                                        return (
                                            <th
                                                key={col.key}
                                                className={cn(
                                                    "px-2 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap",
                                                    col.width,
                                                    isFirstSticky && "sticky left-0 z-30 bg-slate-100",
                                                    isSecondSticky && "sticky left-12 z-30 bg-slate-100 border-r border-slate-300",
                                                    col.editable && "text-blue-800 bg-blue-50"
                                                )}
                                            >
                                                {col.label}
                                            </th>
                                        );
                                    })}
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

                                    // Render cell content based on column key
                                    const renderCell = (colKey: string) => {
                                        switch (colKey) {
                                            case 'srNo':
                                                return <td key={colKey} className="px-2 py-2 sticky left-0 z-10 bg-inherit font-bold text-blue-600 text-center">{item.srNo}</td>;
                                            case 'budgetHead':
                                                return <td key={colKey} className="px-2 py-2 sticky left-12 z-10 bg-inherit border-r border-slate-200"><code className="text-xs font-mono font-semibold text-slate-900">{item.budgetHead}</code></td>;
                                            case 'schemeNomenclature':
                                                return <td key={colKey} className="px-2 py-2 text-slate-700 font-medium truncate max-w-[160px]" title={item.schemeNomenclature || item.scheme}>{item.schemeNomenclature || item.scheme}</td>;
                                            case 'chargedOrVoted':
                                                return <td key={colKey} className="px-2 py-2 text-center"><span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", item.chargedOrVoted === 'Charged' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600')}>{item.chargedOrVoted === 'Charged' ? 'C' : 'V'}</span></td>;
                                            case 'bePrev':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono text-slate-700">{formatCurrency(history?.fy1 || 0)}</td>;
                                            case 'expPrev':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono text-slate-700">{formatCurrency(history?.actualTillDate || 0)}</td>;
                                            case 'beCurr':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono text-slate-700">{formatCurrency(history?.currentYearBE || 0)}</td>;
                                            case 'allotCurr':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono text-slate-700">{formatCurrency(history?.currentYearBE || 0)}</td>;
                                            case 'expCutoff':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono text-slate-700">{formatCurrency(history?.actualTillDate || 0)}</td>;
                                            case 'proposedExp':
                                                return <td key={colKey} className="px-1 py-1 bg-blue-50/50"><Input type="number" value={data.reviseEstimateCY || ''} onChange={(e) => updateFormData(item.id, 'reviseEstimateCY', parseFloat(e.target.value) || 0)} disabled={isSubmitted} className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right" placeholder="0" /></td>;
                                            case 'totalRE':
                                                return <td key={colKey} className="px-2 py-2 text-right font-mono font-semibold text-slate-900">{formatCurrency(totalRE)}</td>;
                                            case 'reOverBE':
                                                return <td key={colKey} className={cn("px-2 py-2 text-right font-mono text-xs", reOverBE && parseFloat(reOverBE) < 0 ? "text-red-600" : "text-slate-600")}>{reOverBE ? `${reOverBE}%` : '—'}</td>;
                                            case 'be1':
                                                // Check if this item requires breakup
                                                if (requiresBreakup(item.objectHead, item.detailHead)) {
                                                    return (
                                                        <td key={colKey} className="px-1 py-1 bg-blue-50/50">
                                                            <div
                                                                onClick={() => !isSubmitted && (() => { setActiveBreakupLine(item); setBreakupModalOpen(true); })()}
                                                                className={cn(
                                                                    "h-7 px-2 text-xs font-mono border rounded flex items-center justify-end cursor-pointer transition-all",
                                                                    isSubmitted
                                                                        ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                                                                        : "bg-white border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                                                                )}
                                                            >
                                                                {data.budgetEstimateNextYear > 0 ? formatCurrency(data.budgetEstimateNextYear) : "Add →"}
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={colKey} className="px-1 py-1 bg-blue-50/50"><Input type="number" value={data.budgetEstimateNextYear || ''} onChange={(e) => updateFormData(item.id, 'budgetEstimateNextYear', parseFloat(e.target.value) || 0)} disabled={isSubmitted} className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right" placeholder="0" /></td>;
                                            case 'be1OverBE':
                                                return <td key={colKey} className={cn("px-2 py-2 text-right font-mono text-xs", be1OverBE && parseFloat(be1OverBE) < 0 ? "text-red-600" : "text-slate-600")}>{be1OverBE ? `${be1OverBE}%` : '—'}</td>;
                                            case 'be2':
                                                return <td key={colKey} className="px-1 py-1 bg-blue-50/50"><Input type="number" value={data.forwardEstimateY2 || ''} onChange={(e) => updateFormData(item.id, 'forwardEstimateY2', parseFloat(e.target.value) || 0)} disabled={isSubmitted} className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right" placeholder="0" /></td>;
                                            case 'be3':
                                                return <td key={colKey} className="px-1 py-1 bg-blue-50/50"><Input type="number" value={data.forwardEstimateY3 || ''} onChange={(e) => updateFormData(item.id, 'forwardEstimateY3', parseFloat(e.target.value) || 0)} disabled={isSubmitted} className="h-7 text-xs font-mono border-blue-200 focus:border-blue-400 bg-white text-right" placeholder="0" /></td>;
                                            case 'remarks':
                                                return <td key={colKey} className="px-1 py-1 bg-blue-50/50"><Input type="text" value={data.remarks || ''} onChange={(e) => updateFormData(item.id, 'remarks', e.target.value)} disabled={isSubmitted} className="h-7 text-xs border-blue-200 focus:border-blue-400 bg-white" placeholder="Remarks..." /></td>;
                                            default:
                                                return null;
                                        }
                                    };

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
                                            {displayColumns.map(col => renderCell(col.key))}
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

            {/* Footer for Creator role */}
            {role === 'creator' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-full mx-auto flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{submittedItems.size}</span>
                            <span className="text-slate-400"> / </span>
                            <span>{items.length}</span>
                            <span className="ml-1">budget lines filled</span>
                        </div>
                        <Button
                            size="sm"
                            className="gap-2 h-10 bg-blue-600 hover:bg-blue-700"
                            onClick={handleSubmitAll}
                        >
                            <ArrowRight size={14} />
                            Submit All to Verifier
                        </Button>
                    </div>
                </footer>
            )}

            {/* Footer for Verifier role */}
            {role === 'verifier' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-full mx-auto flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{submittedItems.size}</span>
                            <span className="text-slate-400"> / </span>
                            <span>{items.length}</span>
                            <span className="ml-1">budget lines reviewed</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 h-10 border-orange-300 text-orange-600 hover:bg-orange-50"
                                onClick={() => toast.info('Return to Creator', { description: 'Items will be returned for corrections' })}
                            >
                                <RotateCcw size={14} />
                                Return to Creator
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2 h-10 bg-blue-600 hover:bg-blue-700"
                                onClick={handleSubmitAll}
                            >
                                <ArrowRight size={14} />
                                Forward to Approver
                            </Button>
                        </div>
                    </div>
                </footer>
            )}

            {/* Footer for Approver role */}
            {role === 'approver' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-full mx-auto flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{submittedItems.size}</span>
                            <span className="text-slate-400"> / </span>
                            <span>{items.length}</span>
                            <span className="ml-1">budget lines reviewed</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 h-10 border-orange-300 text-orange-600 hover:bg-orange-50"
                                onClick={() => toast.info('Return to Verifier', { description: 'Items will be returned for corrections' })}
                            >
                                <RotateCcw size={14} />
                                Return to Verifier
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2 h-10 bg-emerald-600 hover:bg-emerald-700"
                                onClick={handleSubmitAll}
                            >
                                <CheckCircle2 size={14} />
                                Approve & Send to BCO
                            </Button>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
