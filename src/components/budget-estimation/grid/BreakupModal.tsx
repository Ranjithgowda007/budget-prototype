'use client';

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import { BudgetLineItem } from '@/data/budget-estimation/types';
import { formatCurrency } from '@/data/budget-estimation/mockData';
import { toast } from 'sonner';

// Import configuration
import {
    BREAKUP_MAPPINGS,
    requiresBreakup,
    getBreakupConfig,
    BreakupConfig
} from '@/data/budget-estimation/breakupConfig';

// Re-export for backwards compatibility
export const BREAKUP_REQUIRED_HEADS = Object.keys(BREAKUP_MAPPINGS).map(key => {
    const [obj, det] = key.split('-');
    return `${obj}/${det}`;
});

export interface BreakupItem {
    id: string;
    // Common fields
    name?: string;
    description?: string;
    justification?: string;

    // Equipment fields
    oldQty?: number;
    newQty?: number;
    unitCost?: number;
    totalCost?: number;
    itemType?: string;

    // Salary fields
    gradePay?: string;
    employeeCount?: number;
    avgBasicPay?: number;
    rate?: number;
    monthlyAmount?: number;
    annualAmount?: number;

    // Service fields
    staffType?: string;
    staffCount?: number;
    monthlyRate?: number;
    duration?: number;
    vendorName?: string;

    // Utility fields
    meterPurpose?: string;
    actualExpenditure?: number;
    escalation?: number;
    estimatedAmount?: number;
}

// Form configurations by category
interface CategoryConfig {
    columns: string[];
    fields: string[];
    options: Record<string, string[]>;
    calculate: (item: BreakupItem) => number;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    salary: {
        columns: ['Grade Pay', 'Emp Count', 'Avg Basic (₹)', 'Rate %', 'Annual (₹)', 'Action'],
        fields: ['gradePay', 'employeeCount', 'avgBasicPay', 'rate'],
        options: {
            gradePay: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600']
        },
        calculate: (item: BreakupItem) => {
            const count = Number(item.employeeCount) || 0;
            const basicPay = Number(item.avgBasicPay) || 0;
            const rate = Number(item.rate) || 100;
            return count * basicPay * (rate / 100) * 12;
        }
    },
    equipment: {
        columns: ['Item', 'Type', 'Old Qty', 'New Qty', 'Unit Cost (₹)', 'Total (₹)', 'Action'],
        fields: ['name', 'itemType', 'oldQty', 'newQty', 'unitCost'],
        options: {
            itemType: ['Desktop', 'Laptop', 'Printer', 'Scanner', 'UPS', 'Server', 'Mobile', 'Landline', 'Broadband', 'Table', 'Chair', 'Almirah', 'Other']
        },
        calculate: (item: BreakupItem) => {
            return (Number(item.newQty) || 0) * (Number(item.unitCost) || 0);
        }
    },
    service: {
        columns: ['Type', 'Vendor', 'Count', 'Monthly (₹)', 'Months', 'Annual (₹)', 'Action'],
        fields: ['staffType', 'vendorName', 'staffCount', 'monthlyRate', 'duration'],
        options: {
            staffType: ['Peon', 'DEO', 'Security', 'Sweeper', 'Driver', 'Sedan', 'SUV', 'Other']
        },
        calculate: (item: BreakupItem) => {
            const count = Number(item.staffCount) || 0;
            const rate = Number(item.monthlyRate) || 0;
            const duration = Number(item.duration) || 12;
            return count * rate * duration;
        }
    },
    utility: {
        columns: ['Purpose', 'Last Year Actual (₹)', 'Escalation %', 'Estimated (₹)', 'Action'],
        fields: ['meterPurpose', 'actualExpenditure', 'escalation'],
        options: {},
        calculate: (item: BreakupItem) => {
            const actual = Number(item.actualExpenditure) || 0;
            const escalation = Number(item.escalation) || 10;
            return actual * (1 + escalation / 100);
        }
    }
};

interface BreakupModalProps {
    budgetLine: BudgetLineItem;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (items: BreakupItem[], total: number) => void;
    initialData?: BreakupItem[];
    isReadOnly?: boolean;
}

export function BreakupModal({ budgetLine, isOpen, onOpenChange, onSave, initialData = [], isReadOnly = false }: BreakupModalProps) {
    const [items, setItems] = useState<BreakupItem[]>(initialData.length > 0 ? initialData : []);

    // Determine breakup category from budget line
    const breakupConfig = getBreakupConfig(budgetLine.objectHead, budgetLine.detailHead);
    const category = breakupConfig?.category || 'equipment';
    const categoryConfig = CATEGORY_CONFIGS[category];

    const addItem = useCallback(() => {
        const newItem: BreakupItem = {
            id: crypto.randomUUID(),
            duration: 12, // Default duration
        };
        setItems(prev => [...prev, newItem]);
    }, []);

    const updateItem = useCallback((id: string, field: keyof BreakupItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                // Update calculated total
                updated.totalCost = categoryConfig.calculate(updated);
                updated.annualAmount = categoryConfig.calculate(updated);
                updated.estimatedAmount = categoryConfig.calculate(updated);
                return updated;
            }
            return item;
        }));
    }, [categoryConfig]);

    const deleteItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const totalAmount = items.reduce((sum, item) => sum + categoryConfig.calculate(item), 0);

    const handleSave = () => {
        if (items.length === 0) {
            toast.error('Please add at least one item');
            return;
        }
        onSave(items, totalAmount);
        onOpenChange(false);
        toast.success(`Breakup saved: ${formatCurrency(totalAmount)}`);
    };

    const renderTableRow = (item: BreakupItem) => {
        switch (category) {
            case 'salary':
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Select value={item.gradePay || ''} onValueChange={(v) => updateItem(item.id, 'gradePay', v)} disabled={isReadOnly}>
                                <SelectTrigger className="h-8 w-[120px]"><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    {categoryConfig.options.gradePay?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.employeeCount || ''} onChange={(e) => updateItem(item.id, 'employeeCount', Number(e.target.value))} className="h-8 w-20" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.avgBasicPay || ''} onChange={(e) => updateItem(item.id, 'avgBasicPay', Number(e.target.value))} className="h-8 w-28" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.rate || ''} onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))} placeholder="100" className="h-8 w-20" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell className="font-medium text-right text-emerald-700">
                            {formatCurrency(categoryConfig.calculate(item))}
                        </TableCell>
                        {!isReadOnly && (
                            <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                );

            case 'service':
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Select value={item.staffType || ''} onValueChange={(v) => updateItem(item.id, 'staffType', v)} disabled={isReadOnly}>
                                <SelectTrigger className="h-8 w-[100px]"><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    {categoryConfig.options.staffType?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Input value={item.vendorName || ''} onChange={(e) => updateItem(item.id, 'vendorName', e.target.value)} placeholder="Vendor" className="h-8 w-28" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.staffCount || ''} onChange={(e) => updateItem(item.id, 'staffCount', Number(e.target.value))} className="h-8 w-16" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.monthlyRate || ''} onChange={(e) => updateItem(item.id, 'monthlyRate', Number(e.target.value))} className="h-8 w-24" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.duration || 12} onChange={(e) => updateItem(item.id, 'duration', Number(e.target.value))} className="h-8 w-16" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell className="font-medium text-right text-emerald-700">
                            {formatCurrency(categoryConfig.calculate(item))}
                        </TableCell>
                        {!isReadOnly && (
                            <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                );

            case 'utility':
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Input value={item.meterPurpose || ''} onChange={(e) => updateItem(item.id, 'meterPurpose', e.target.value)} placeholder="Purpose" className="h-8" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.actualExpenditure || ''} onChange={(e) => updateItem(item.id, 'actualExpenditure', Number(e.target.value))} className="h-8 w-32" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.escalation || ''} onChange={(e) => updateItem(item.id, 'escalation', Number(e.target.value))} placeholder="10" className="h-8 w-20" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell className="font-medium text-right text-emerald-700">
                            {formatCurrency(categoryConfig.calculate(item))}
                        </TableCell>
                        {!isReadOnly && (
                            <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                );

            case 'equipment':
            default:
                return (
                    <TableRow key={item.id}>
                        <TableCell>
                            <Input value={item.name || ''} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Item name" className="h-8" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Select value={item.itemType || ''} onValueChange={(v) => updateItem(item.id, 'itemType', v)} disabled={isReadOnly}>
                                <SelectTrigger className="h-8 w-[100px]"><SelectValue placeholder="Type..." /></SelectTrigger>
                                <SelectContent>
                                    {categoryConfig.options.itemType?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.oldQty || ''} onChange={(e) => updateItem(item.id, 'oldQty', Number(e.target.value))} className="h-8 w-16" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.newQty || ''} onChange={(e) => updateItem(item.id, 'newQty', Number(e.target.value))} className="h-8 w-16 bg-blue-50/50" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell>
                            <Input type="number" value={item.unitCost || ''} onChange={(e) => updateItem(item.id, 'unitCost', Number(e.target.value))} className="h-8 w-24" readOnly={isReadOnly} />
                        </TableCell>
                        <TableCell className="font-medium text-right text-emerald-700">
                            {formatCurrency(categoryConfig.calculate(item))}
                        </TableCell>
                        {!isReadOnly && (
                            <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="text-blue-600" size={20} />
                        {breakupConfig?.label || 'Item'} Breakup
                    </DialogTitle>
                    <p className="text-sm text-slate-500">
                        {budgetLine.scheme} • <span className="font-mono">{budgetLine.objectHead}/{budgetLine.detailHead}</span>
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Summary Banner */}
                    <div className="bg-white p-4 rounded-lg flex justify-between items-center border border-slate-200">
                        <div>
                            <span className="text-sm text-slate-600">Category: </span>
                            <span className="text-sm font-semibold text-blue-700 capitalize">{category}</span>
                            <span className="text-slate-400 mx-2">•</span>
                            <span className="text-sm text-slate-600">{breakupConfig?.description}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase">Grand Total</p>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
                        </div>
                    </div>

                    {/* Dynamic Table */}
                    <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-white border-b border-slate-200">
                                <TableRow>
                                    {categoryConfig.columns.map((col, idx) => (
                                        <TableHead key={idx} className={idx === categoryConfig.columns.length - 2 ? 'text-right' : ''}>
                                            {col}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map(item => renderTableRow(item))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={categoryConfig.columns.length} className="text-center py-8 text-slate-500 italic">
                                            No items added. Click "Add Item" to start entering breakup details.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Add Item Button */}
                    {!isReadOnly && (
                        <Button onClick={addItem} variant="outline" className="gap-2 border-dashed border-2 text-slate-500 hover:text-blue-600 hover:border-blue-300">
                            <Plus size={16} /> Add Item
                        </Button>
                    )}
                </div>

                <DialogFooter className="gap-2 border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    {!isReadOnly && (
                        <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Save size={16} /> Save & Apply to BE1
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
