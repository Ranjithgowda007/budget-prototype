'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, ArrowUp, Save, Send, Search, Filter, Clock, CheckCircle2, AlertCircle,
    TrendingUp, TrendingDown, Layers, Check, ChevronDown, ChevronUp, Target,
    FileText, AlertTriangle, Sparkles, Package, History
} from 'lucide-react';
import { BudgetLineItem, EstimationRecord, TypedAsset, AuditTrailEntry } from '@/data/budget-estimation/types';
import { formatCurrency, MOCK_HISTORICAL_DATA, getAuditTrailByBudgetLineId, MOCK_AUDIT_TRAIL } from '@/data/budget-estimation/mockData';
import { useRouter } from 'next/navigation';
import { BreakupModal, BREAKUP_REQUIRED_HEADS, BreakupItem } from './BreakupModal';
import { TrendAnalysisPopup } from './TrendAnalysisPopup';
import { AssetRequirementsModal } from './AssetRequirementsModal';
import { AuditTrailModal } from './AuditTrailModal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Constants for dropdowns
const OUTCOME_CATEGORIES = ['Development', 'Non-Development', 'Administrative'];
const SDG_GOALS = ['1 - No Poverty', '2 - Zero Hunger', '3 - Good Health', '4 - Quality Education', '5 - Gender Equality', '8 - Economic Growth'];
const SDG_TARGETS = ['1.1', '1.2', '2.1', '3.1', '4.1', '5.1', '8.1'];
const GENDER_TAGS = ['General', 'Women Specific', 'Gender Neutral'];
const GEOGRAPHY_TAGS = ['Urban', 'Rural', 'Semi-Urban', 'Pan-India'];

interface SmartBudgetGridProps {
    role: 'creator' | 'verifier' | 'approver';
    items: BudgetLineItem[];
    estimations: EstimationRecord[];
    onSave?: (data: any) => void;
    onSubmit?: (data: any) => void;
    summaryCards?: React.ReactNode;
}

interface ItemFormData {
    reviseEstimateCY: number;
    budgetEstimateNextYear: number;
    forwardEstimateY2: number;
    forwardEstimateY3: number;
    creatorRemarks: string;
    remarks: string;
    outcomeCategory: string;
    sdgGoal: string;
    sdgTarget: string;
    genderTag: string;
    scstTag: boolean;
    geographyTag: string;
}

export function SmartBudgetGrid({ role, items, estimations }: SmartBudgetGridProps) {
    const router = useRouter();

    // Dynamic Financial Year Calculation
    // Financial year starts in April, so if current month is Jan-Mar, FY started previous calendar year
    const getCurrentFY = () => {
        const now = new Date();
        const month = now.getMonth(); // 0-indexed (0 = Jan, 3 = Apr)
        const year = now.getFullYear();
        // If Jan-Mar, FY started in previous year
        const fyStartYear = month < 3 ? year - 1 : year;
        return fyStartYear;
    };

    const currentFYStart = getCurrentFY();
    const FY = {
        prev: `${currentFYStart - 1}-${String(currentFYStart).slice(-2)}`,      // e.g., 2024-25
        curr: `${currentFYStart}-${String(currentFYStart + 1).slice(-2)}`,       // e.g., 2025-26
        next: `${currentFYStart + 1}-${String(currentFYStart + 2).slice(-2)}`,   // e.g., 2026-27
        nextPlus1: `${currentFYStart + 2}-${String(currentFYStart + 3).slice(-2)}`, // e.g., 2027-28
        nextPlus2: `${currentFYStart + 3}-${String(currentFYStart + 4).slice(-2)}`, // e.g., 2028-29
    };

    const [formData, setFormData] = useState<Record<string, ItemFormData>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [breakupModalOpen, setBreakupModalOpen] = useState(false);
    const [activeBreakupLine, setActiveBreakupLine] = useState<BudgetLineItem | null>(null);
    const [breakupData, setBreakupData] = useState<Record<string, BreakupItem[]>>({});
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [submittedItems, setSubmittedItems] = useState<Set<string>>(new Set());
    const [assetModalOpen, setAssetModalOpen] = useState(false);
    const [activeAssetLine, setActiveAssetLine] = useState<BudgetLineItem | null>(null);
    const [assetData, setAssetData] = useState<Record<string, TypedAsset[]>>({});
    const [auditModalOpen, setAuditModalOpen] = useState(false);
    const [activeAuditLine, setActiveAuditLine] = useState<BudgetLineItem | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [serialSearch, setSerialSearch] = useState('');
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const mainRef = useRef<HTMLElement | null>(null);

    // Handle serial number change - auto scroll to item
    const handleSerialChange = (value: string) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        setSerialSearch(cleanValue);

        if (cleanValue) {
            const targetItem = items.find(item => item.srNo === cleanValue);
            if (targetItem && cardRefs.current[targetItem.id]) {
                cardRefs.current[targetItem.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Flash highlight effect
                const card = cardRefs.current[targetItem.id];
                if (card) {
                    card.style.boxShadow = '0 0 0 3px #3b82f6';
                    card.style.transition = 'box-shadow 0.3s ease';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                    }, 2000);
                }
            }
        }
    };

    // Handle scroll to show/hide "Go to Top" button
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setShowScrollTop(scrollTop > 200);
    };

    // Scroll to top function
    const scrollToTop = () => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Validation: Check if all required fields are filled
    const validateBudgetLines = (): string[] => {
        const unfilled: string[] = [];
        items.forEach(item => {
            if (submittedItems.has(item.id)) return; // Already submitted
            const data = getItemFormData(item.id);
            if (!data.reviseEstimateCY || !data.budgetEstimateNextYear) {
                unfilled.push(item.id);
            }
        });
        return unfilled;
    };

    // Get count of filled items (for progress display)
    const getFilledCount = (): number => {
        let count = 0;
        items.forEach(item => {
            if (submittedItems.has(item.id)) {
                count++;
                return;
            }
            const data = getItemFormData(item.id);
            if (data.reviseEstimateCY && data.budgetEstimateNextYear) {
                count++;
            }
        });
        return count;
    };

    // Batch submit handler
    const handleBatchSubmit = () => {
        const unfilledIds = validateBudgetLines();
        if (unfilledIds.length > 0) {
            // Scroll to first unfilled card
            const firstUnfilledRef = cardRefs.current[unfilledIds[0]];
            if (firstUnfilledRef) {
                firstUnfilledRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setExpandedItems(prev => new Set(prev).add(unfilledIds[0]));
            }
            toast.error('Please fill all required fields', {
                description: `${unfilledIds.length} budget line(s) have missing data`
            });
            return;
        }
        // Submit all non-submitted items
        const newSubmitted = new Set(submittedItems);
        items.forEach(item => newSubmitted.add(item.id));
        setSubmittedItems(newSubmitted);
        const action = role === 'creator' ? 'Sent to Verifier' : role === 'verifier' ? 'Sent to Approver' : 'Approved';
        toast.success(action, {
            description: `All ${items.length} budget lines submitted successfully`
        });
    };

    const getItemFormData = (itemId: string): ItemFormData => {
        if (formData[itemId]) return formData[itemId];
        const est = estimations.find(e => e.budgetLineItemId === itemId);
        return {
            reviseEstimateCY: est?.reviseEstimateCY || 0,
            budgetEstimateNextYear: est?.budgetEstimateNextYear || 0,
            forwardEstimateY2: est?.forwardEstimateY2 || 0,
            forwardEstimateY3: est?.forwardEstimateY3 || 0,
            creatorRemarks: est?.creatorRemarks || '',
            remarks: '',
            outcomeCategory: est?.outcomeCategory || '',
            sdgGoal: est?.sdgGoal || '',
            sdgTarget: est?.sdgTarget || '',
            genderTag: est?.genderTag || 'General',
            scstTag: est?.scstTag || false,
            geographyTag: est?.geographyTag || '',
        };
    };

    const updateFormData = (itemId: string, field: keyof ItemFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [itemId]: {
                ...getItemFormData(itemId),
                [field]: value
            }
        }));
        setSavedItems(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    };

    const toggleExpand = (itemId: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) {
                next.delete(itemId);
            } else {
                next.add(itemId);
            }
            return next;
        });
    };

    const handleBreakupClick = (item: BudgetLineItem) => {
        setActiveBreakupLine(item);
        setBreakupModalOpen(true);
    };

    const handleBreakupSave = (items: BreakupItem[]) => {
        if (activeBreakupLine) {
            setBreakupData(prev => ({
                ...prev,
                [activeBreakupLine.id]: items
            }));
        }
    };

    const handleSaveItem = (id: string, scheme: string) => {
        setSavedItems(prev => new Set(prev).add(id));
        toast.success(`Draft Saved`, {
            description: scheme.substring(0, 50) + (scheme.length > 50 ? '...' : '')
        });
    };

    const handleSubmitItem = (id: string, scheme: string) => {
        setSubmittedItems(prev => new Set(prev).add(id));
        const action = role === 'creator' ? 'Sent to Verifier' : role === 'verifier' ? 'Sent to Approver' : 'Approved';
        toast.success(action, {
            description: scheme.substring(0, 50) + (scheme.length > 50 ? '...' : '')
        });
    };

    const handleAssetClick = (item: BudgetLineItem) => {
        setActiveAssetLine(item);
        setAssetModalOpen(true);
    };

    const handleAssetSave = (assets: TypedAsset[]) => {
        if (activeAssetLine) {
            setAssetData(prev => ({
                ...prev,
                [activeAssetLine.id]: assets
            }));
            toast.success('Asset requirements saved', {
                description: `${assets.length} items added`
            });
        }
    };

    const handleAuditClick = (item: BudgetLineItem) => {
        setActiveAuditLine(item);
        setAuditModalOpen(true);
    };

    const getStatusInfo = (status?: string, itemId?: string) => {
        if (submittedItems.has(itemId || '')) {
            return { label: 'Submitted', color: 'bg-emerald-500', icon: Check };
        }
        if (savedItems.has(itemId || '')) {
            return { label: 'Saved', color: 'bg-sky-500', icon: Save };
        }
        switch (status) {
            case 'approved': return { label: 'Approved', color: 'bg-emerald-500', icon: CheckCircle2 };
            case 'returned': return { label: 'Returned', color: 'bg-amber-500', icon: AlertCircle };
            case 'under_verification': return { label: 'Under Review', color: 'bg-violet-500', icon: Clock };
            case 'under_approval': return { label: 'Under Approval', color: 'bg-blue-500', icon: Clock };
            default: return { label: 'Draft', color: 'bg-slate-400', icon: FileText };
        }
    };

    // Highlight search text in budget head
    const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
        if (!highlight.trim()) {
            return <>{text}</>;
        }
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return (
            <>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-yellow-300 text-slate-900 rounded px-0.5">
                            {part}
                        </mark>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const est = estimations.find(e => e.budgetLineItemId === item.id);
            const query = searchQuery.toLowerCase().trim();

            // Search in budget head (primary), scheme name, object head, serial number, and scheme nomenclature
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

    const completedCount = savedItems.size + submittedItems.size;
    const pendingCount = items.length - completedCount;
    const totalProposedRE = items.reduce((acc, item) => {
        const data = getItemFormData(item.id);
        return acc + (data.reviseEstimateCY || 0);
    }, 0);

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Fixed Header Section */}
            <header className="flex-shrink-0 bg-slate-50 px-4 pt-2">
                <div className="max-w-[1400px] mx-auto">
                    {/* Summary Strip */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
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
                                {/* Progress Bar */}
                                <div className="flex-1 max-w-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs text-slate-500 uppercase font-medium">Progress</p>
                                        <p className="text-sm font-semibold text-slate-700">{getFilledCount()}/{items.length}</p>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                                            style={{ width: `${items.length > 0 ? (getFilledCount() / items.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={16} /> Back to Dashboard
                            </Button>
                        </div>
                    </div>

                    {/* Search & Filter - Fixed */}
                    <div className="flex items-center gap-3 pb-4">
                        {/* Serial Number Quick Jump - Auto search on input */}
                        <Input
                            type="text"
                            placeholder="Sr. No."
                            className="w-24 h-12 bg-white border-slate-200 rounded-lg text-center font-mono font-semibold"
                            value={serialSearch}
                            onChange={(e) => handleSerialChange(e.target.value)}
                        />
                        {/* Main Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Search by scheme or DDO code..."
                                className="pl-11 h-12 bg-white border-slate-200 rounded-lg text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-auto h-12 px-4 bg-white border-slate-200 rounded-lg gap-2">
                                <Filter size={16} className="text-slate-500" />
                                <span className="text-slate-700">Filter</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Drafts</SelectItem>
                                <SelectItem value="under_verification">Under Review</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main
                ref={mainRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 pb-6 relative"
            >
                <div className="max-w-[1400px] mx-auto">
                    {/* Budget Line Cards */}
                    <div className="space-y-4">
                        {activeBreakupLine && (
                            <BreakupModal
                                budgetLine={activeBreakupLine}
                                isOpen={breakupModalOpen}
                                onOpenChange={setBreakupModalOpen}
                                onSave={handleBreakupSave}
                                initialData={breakupData[activeBreakupLine.id]}
                                isReadOnly={false}
                            />
                        )}

                        {activeAssetLine && (
                            <AssetRequirementsModal
                                isOpen={assetModalOpen}
                                onOpenChange={setAssetModalOpen}
                                assets={assetData[activeAssetLine.id] || []}
                                onSave={handleAssetSave}
                                disabled={submittedItems.has(activeAssetLine.id)}
                            />
                        )}

                        {activeAuditLine && (
                            <AuditTrailModal
                                isOpen={auditModalOpen}
                                onOpenChange={setAuditModalOpen}
                                budgetLine={activeAuditLine}
                                auditTrail={getAuditTrailByBudgetLineId(activeAuditLine.id)}
                            />
                        )}

                        {filteredItems.map((item, index) => {
                            const est = estimations.find(e => e.budgetLineItemId === item.id);
                            const history = MOCK_HISTORICAL_DATA.find(h => h.budgetLineItemId === item.id);
                            const data = getItemFormData(item.id);
                            const isExpanded = expandedItems.has(item.id);
                            const statusInfo = getStatusInfo(est?.status, item.id);
                            const isSubmitted = submittedItems.has(item.id);
                            const needsBreakup = BREAKUP_REQUIRED_HEADS.some(head => item.detailHead.includes(head.split('/')[1]));

                            // Calculate deviation
                            const deviation = data.budgetEstimateNextYear > 0 && data.reviseEstimateCY > 0
                                ? ((data.budgetEstimateNextYear - data.reviseEstimateCY) / data.reviseEstimateCY * 100).toFixed(1)
                                : null;
                            const exceedsCeiling = data.budgetEstimateNextYear > (item.ceilingLimit || 0);

                            // Check if this card has missing required fields
                            const isMissingRequired = !isSubmitted && (!data.reviseEstimateCY || !data.budgetEstimateNextYear);

                            return (
                                <Card
                                    key={item.id}
                                    ref={(el) => { cardRefs.current[item.id] = el; }}
                                    className={cn(
                                        "bg-white shadow-sm overflow-hidden transition-all duration-300",
                                        "border hover:shadow-md border-slate-200",
                                        isMissingRequired && "border-l-4 border-l-amber-400"
                                    )}
                                >
                                    <CardContent className="p-0">
                                        {/* Header */}
                                        <div className="px-5 py-4 border-b border-slate-100">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0 flex items-center gap-3">
                                                    {/* Serial Number Badge - using item.srNo directly */}
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                                                        {item.srNo}
                                                    </span>
                                                    {/* Budget Line Code with Charged/Voted and Scheme - All on one line */}
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <code className="text-lg font-bold font-mono text-slate-900 tracking-wide">
                                                            <HighlightText text={item.budgetHead || ''} highlight={searchQuery} />
                                                        </code>
                                                        <span className={cn(
                                                            "text-xs font-bold px-2 py-0.5 rounded",
                                                            item.chargedOrVoted === 'Charged' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                                                        )}>
                                                            {item.chargedOrVoted}
                                                        </span>
                                                        <span className="text-slate-300">|</span>
                                                        <h3 className="font-medium text-slate-900 text-base leading-snug truncate">
                                                            {item.scheme}
                                                        </h3>
                                                        {item.schemeNomenclature && (
                                                            <>
                                                                <span className="text-slate-300">|</span>
                                                                <span className="text-sm font-semibold text-slate-900 truncate max-w-[250px]">
                                                                    {item.schemeNomenclature}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <TrendAnalysisPopup budgetLine={item} history={history} />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleExpand(item.id)}
                                                        className="text-slate-500"
                                                    >
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Estimation Grid */}
                                        <div className="px-5 py-4 bg-white">
                                            {/* Row 1: Display Fields - Non-editable */}
                                            <div className="grid grid-cols-8 gap-x-4 gap-y-1 pb-3 border-b border-slate-200">
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Budget Estimate ({FY.prev})</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.fy1 || 0)}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Expenditure ({FY.prev})</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.actualTillDate || 0)}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Budget Estimate ({FY.curr})</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.currentYearBE || 0)}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Budget Allotment ({FY.curr})</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.currentYearBE || 0)}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Reappropriation</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">₹0</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Supplementary Budget</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">₹0</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Total BE ({FY.curr})</Label>
                                                    <p className="text-sm font-bold text-slate-900 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.currentYearBE || 0)}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Exp. Upto Cutoff Date</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono mt-1 h-8 flex items-center">{formatCurrency(history?.actualTillDate || 0)}</p>
                                                </div>
                                            </div>

                                            {/* Row 2: Input & Calculated Fields - Mixed editable/non-editable */}
                                            <div className="grid grid-cols-8 gap-x-4 gap-y-1 py-3 border-b border-slate-200">
                                                {/* Editable Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-blue-900 font-semibold uppercase tracking-wide leading-tight">Proposed Exp. (Rem. Months) *</Label>
                                                    <Input
                                                        type="number"
                                                        value={data.reviseEstimateCY || ''}
                                                        onChange={(e) => updateFormData(item.id, 'reviseEstimateCY', parseFloat(e.target.value) || 0)}
                                                        placeholder="0"
                                                        disabled={isSubmitted}
                                                        className="h-8 font-mono text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-blue-50 mt-1"
                                                    />
                                                </div>
                                                {/* Calculated Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">Total Revised Estimate (RE)</Label>
                                                    <p className="text-sm font-bold text-slate-900 font-mono h-8 flex items-center mt-1">
                                                        {formatCurrency((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0))}
                                                    </p>
                                                </div>
                                                {/* Calculated Field - % RE Over BE moved here */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">% RE Over BE ({FY.prev})</Label>
                                                    <p className="text-sm font-semibold text-slate-800 font-mono h-8 flex items-center mt-1">
                                                        {history?.fy1 && history.fy1 > 0
                                                            ? `${((((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0)) - history.fy1) / history.fy1 * 100).toFixed(1)}%`
                                                            : '—'}
                                                    </p>
                                                </div>
                                                {/* Editable Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-blue-900 font-semibold uppercase tracking-wide leading-tight">BE {FY.next} (BE1) *</Label>
                                                    <Input
                                                        type="number"
                                                        value={data.budgetEstimateNextYear || ''}
                                                        onChange={(e) => updateFormData(item.id, 'budgetEstimateNextYear', parseFloat(e.target.value) || 0)}
                                                        placeholder="0"
                                                        disabled={isSubmitted}
                                                        className="h-8 font-mono text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-blue-50 mt-1"
                                                    />
                                                </div>
                                                {/* Calculated Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">% BE1 Over Current BE</Label>
                                                    <p className={cn(
                                                        "text-sm font-semibold font-mono h-8 flex items-center mt-1",
                                                        data.budgetEstimateNextYear && history?.currentYearBE
                                                            ? (((data.budgetEstimateNextYear - history.currentYearBE) / history.currentYearBE) < 0 ? "text-red-600" : "text-slate-800")
                                                            : "text-slate-800"
                                                    )}>
                                                        {history?.currentYearBE && history.currentYearBE > 0 && data.budgetEstimateNextYear
                                                            ? `${(((data.budgetEstimateNextYear - history.currentYearBE) / history.currentYearBE) * 100).toFixed(1)}%`
                                                            : '—'}
                                                    </p>
                                                </div>
                                                {/* Calculated Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-slate-700 uppercase tracking-wide leading-tight font-medium">% BE1 Over Current RE</Label>
                                                    <p className={cn(
                                                        "text-sm font-semibold font-mono h-8 flex items-center mt-1",
                                                        ((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0)) > 0 && data.budgetEstimateNextYear
                                                            ? (((data.budgetEstimateNextYear - ((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0))) / ((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0))) < 0 ? "text-red-600" : "text-slate-800")
                                                            : "text-slate-800"
                                                    )}>
                                                        {((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0)) > 0 && data.budgetEstimateNextYear
                                                            ? `${(((data.budgetEstimateNextYear - ((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0))) / ((history?.actualTillDate || 0) + (data.reviseEstimateCY || 0))) * 100).toFixed(1)}%`
                                                            : '—'}
                                                    </p>
                                                </div>
                                                {/* Editable Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-blue-900 font-semibold uppercase tracking-wide leading-tight">BE {FY.nextPlus1} (BE2)</Label>
                                                    <Input
                                                        type="number"
                                                        value={data.forwardEstimateY2 || ''}
                                                        onChange={(e) => updateFormData(item.id, 'forwardEstimateY2', parseFloat(e.target.value) || 0)}
                                                        placeholder="0"
                                                        disabled={isSubmitted}
                                                        className="h-8 font-mono text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-blue-50 mt-1"
                                                    />
                                                </div>
                                                {/* Editable Field */}
                                                <div className="flex flex-col">
                                                    <Label className="text-xs text-blue-900 font-semibold uppercase tracking-wide leading-tight">BE {FY.nextPlus2} (BE3)</Label>
                                                    <Input
                                                        type="number"
                                                        value={data.forwardEstimateY3 || ''}
                                                        onChange={(e) => updateFormData(item.id, 'forwardEstimateY3', parseFloat(e.target.value) || 0)}
                                                        placeholder="0"
                                                        disabled={isSubmitted}
                                                        className="h-8 font-mono text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-200 bg-blue-50 mt-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 3: DDO Remarks - Editable */}
                                            <div className="pt-3">
                                                <Label className="text-xs text-blue-900 font-semibold uppercase tracking-wide">DDO Remarks</Label>
                                                <textarea
                                                    value={data.remarks || ''}
                                                    onChange={(e) => updateFormData(item.id, 'remarks', e.target.value)}
                                                    onInput={(e) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        target.style.height = 'auto';
                                                        target.style.height = `${Math.max(48, target.scrollHeight)}px`;
                                                    }}
                                                    onFocus={(e) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        if (!target.value) {
                                                            target.style.height = '80px';
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        const target = e.target as HTMLTextAreaElement;
                                                        if (!target.value) {
                                                            target.style.height = '48px';
                                                        }
                                                    }}
                                                    placeholder="Enter remarks/justification (optional)..."
                                                    disabled={isSubmitted}
                                                    className="w-full min-h-[48px] px-3 py-2 text-sm border border-blue-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-blue-50 resize-none placeholder:text-slate-500 mt-1 transition-all duration-200"
                                                    maxLength={2000}
                                                />
                                            </div>

                                            {/* Actions Row - Separate line */}
                                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 gap-2 border-slate-300 text-slate-600 hover:bg-slate-50"
                                                    onClick={() => handleAuditClick(item)}
                                                >
                                                    <History size={14} />
                                                    Audit Trail
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                    onClick={() => handleAssetClick(item)}
                                                    disabled={isSubmitted}
                                                >
                                                    <Package size={14} />
                                                    Assets
                                                    {assetData[item.id]?.length > 0 && (
                                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                                                            {assetData[item.id].length}
                                                        </span>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 gap-2"
                                                    onClick={() => handleSaveItem(item.id, item.scheme)}
                                                    disabled={isSubmitted}
                                                >
                                                    <Save size={14} /> Save Draft
                                                </Button>
                                                {isSubmitted && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 text-sm font-medium">
                                                        <Check size={14} />
                                                        Submitted
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Section */}
                                        {isExpanded && (
                                            <div className="px-5 py-4 border-t border-slate-100 space-y-5">
                                                {/* Warning for ceiling exceed */}
                                                {exceedsCeiling && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                                                        <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                                                        <div>
                                                            <p className="text-sm font-medium text-amber-800">Budget exceeds ceiling limit</p>
                                                            <p className="text-xs text-amber-600">Ceiling: {formatCurrency(item.ceilingLimit || 0)}. Please provide justification below.</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Outcome Budgeting */}
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                                        <Target size={16} className="text-blue-500" />
                                                        Outcome Budgeting Tags
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <div>
                                                            <Label className="text-xs text-slate-500">Outcome Category</Label>
                                                            <Select
                                                                value={data.outcomeCategory}
                                                                onValueChange={(v) => updateFormData(item.id, 'outcomeCategory', v)}
                                                                disabled={isSubmitted}
                                                            >
                                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {OUTCOME_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500">SDG Goal</Label>
                                                            <Select
                                                                value={data.sdgGoal}
                                                                onValueChange={(v) => updateFormData(item.id, 'sdgGoal', v)}
                                                                disabled={isSubmitted}
                                                            >
                                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {SDG_GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500">SDG Target</Label>
                                                            <Select
                                                                value={data.sdgTarget}
                                                                onValueChange={(v) => updateFormData(item.id, 'sdgTarget', v)}
                                                                disabled={isSubmitted}
                                                            >
                                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {SDG_TARGETS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500">Gender Tag</Label>
                                                            <Select
                                                                value={data.genderTag}
                                                                onValueChange={(v) => updateFormData(item.id, 'genderTag', v)}
                                                                disabled={isSubmitted}
                                                            >
                                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {GENDER_TAGS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500">Geography</Label>
                                                            <Select
                                                                value={data.geographyTag}
                                                                onValueChange={(v) => updateFormData(item.id, 'geographyTag', v)}
                                                                disabled={isSubmitted}
                                                            >
                                                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {GEOGRAPHY_TAGS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="flex items-end">
                                                            <label className="flex items-center gap-2 h-10 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.scstTag}
                                                                    onChange={(e) => updateFormData(item.id, 'scstTag', e.target.checked)}
                                                                    disabled={isSubmitted}
                                                                    className="w-4 h-4 rounded border-slate-300"
                                                                />
                                                                <span className="text-sm text-slate-700">SC/ST Component</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remarks */}
                                                <div>
                                                    <Label className="text-xs text-slate-500">Remarks / Justification</Label>
                                                    <Textarea
                                                        value={data.creatorRemarks}
                                                        onChange={(e) => updateFormData(item.id, 'creatorRemarks', e.target.value)}
                                                        placeholder="Add any remarks or justification for this estimation..."
                                                        disabled={isSubmitted}
                                                        className="mt-1"
                                                        rows={2}
                                                    />
                                                </div>

                                                {/* Breakup Section */}
                                                {needsBreakup && (
                                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Layers className="text-blue-600" size={18} />
                                                                <span className="font-medium text-blue-800">Item-wise Breakup Required</span>
                                                                {breakupData[item.id]?.length > 0 && (
                                                                    <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                        {breakupData[item.id].length} items
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="bg-white"
                                                                onClick={() => handleBreakupClick(item)}
                                                                disabled={isSubmitted}
                                                            >
                                                                {breakupData[item.id]?.length > 0 ? 'Edit Breakup' : 'Add Breakup'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Search size={48} className="mb-4 opacity-30" />
                            <p className="text-lg font-medium text-slate-600">No budget lines found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Go to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-2 z-50 h-8 w-8 rounded-full bg-slate-400/50 text-white shadow-md hover:bg-blue-600 hover:scale-125 transition-all duration-300 flex items-center justify-center opacity-60 hover:opacity-100"
                        aria-label="Go to top"
                    >
                        <ArrowUp size={14} />
                    </button>
                )}
            </main>

            {/* Fixed Footer with Batch Submit */}
            {role === 'creator' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{getFilledCount()}</span>
                                <span className="text-slate-400"> / </span>
                                <span>{items.length}</span>
                                <span className="ml-1">budget lines filled</span>
                            </div>
                            {validateBudgetLines().length > 0 && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{validateBudgetLines().length} line(s) need attention</span>
                                </div>
                            )}
                        </div>
                        <Button
                            size="lg"
                            className="gap-2 bg-blue-600 hover:bg-blue-700 px-6"
                            onClick={handleBatchSubmit}
                            disabled={submittedItems.size === items.length}
                        >
                            <Send size={18} />
                            {submittedItems.size === items.length ? 'All Submitted' : 'Submit All to Verifier'}
                        </Button>
                    </div>
                </footer>
            )}

            {/* Footer for Verifier role */}
            {role === 'verifier' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{getFilledCount()}</span>
                                <span className="text-slate-400"> / </span>
                                <span>{items.length}</span>
                                <span className="ml-1">budget lines filled</span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="gap-2 bg-blue-600 hover:bg-blue-700 px-6"
                            onClick={handleBatchSubmit}
                            disabled={submittedItems.size === items.length}
                        >
                            <Send size={18} />
                            {submittedItems.size === items.length ? 'All Submitted' : 'Submit All to Approver'}
                        </Button>
                    </div>
                </footer>
            )}

            {/* Footer for Approver role */}
            {role === 'approver' && (
                <footer className="flex-shrink-0 bg-white border border-slate-200 mx-4 mb-4 px-4 py-3 shadow-lg rounded-xl z-40">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{getFilledCount()}</span>
                                <span className="text-slate-400"> / </span>
                                <span>{items.length}</span>
                                <span className="ml-1">budget lines filled</span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 px-6"
                            onClick={handleBatchSubmit}
                            disabled={submittedItems.size === items.length}
                        >
                            <CheckCircle2 size={18} />
                            {submittedItems.size === items.length ? 'All Approved' : 'Approve All'}
                        </Button>
                    </div>
                </footer>
            )}
        </div>
    );
}
