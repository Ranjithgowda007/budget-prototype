'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import { BudgetLineItem } from '@/data/budget-expenditure/types';
import { formatCurrency } from '@/data/budget-expenditure/mockData';
import { toast } from 'sonner';
import { getBreakupTypeConfig, BreakupFieldDef } from '@/data/budget-expenditure/breakupConfig';

// Re-export requiresBreakup for backward compatibility
export { requiresBreakup } from '@/data/budget-expenditure/breakupConfig';

// Legacy export for backwards compatibility
export const BREAKUP_REQUIRED_HEADS = [
    '11/001', '11/003', '11/004', '11/006', '11/007', '11/008', '11/009', '11/011', '11/016', '11/018', '11/021', '11/025',
    '12/000', '12/001', '12/003',
    '16/003', '16/006', '16/008', '16/009', '16/010',
    '19/001', '19/003', '19/006', '19/008', '19/009', '19/011', '19/016', '19/018',
    '22/002', '22/003', '22/005', '22/009',
    '23/001',
    '27/001',
    '31/004', '31/007'
];

export interface BreakupItem {
    id: string;
    [key: string]: string | number | undefined;
}

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

    // Get the specific configuration for this object/detail head
    const typeConfig = useMemo(() =>
        getBreakupTypeConfig(budgetLine.objectHead, budgetLine.detailHead),
        [budgetLine.objectHead, budgetLine.detailHead]
    );

    // Fallback if no config found
    if (!typeConfig) {
        return null;
    }

    const addItem = useCallback(() => {
        const newItem: BreakupItem = { id: crypto.randomUUID() };
        setItems(prev => [...prev, newItem]);
    }, []);

    const updateItem = useCallback((id: string, field: string, value: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const deleteItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    // Calculate total for a single item
    const calculateItemTotal = useCallback((item: BreakupItem): number => {
        return typeConfig.calculateTotal(item);
    }, [typeConfig]);

    // Grand total
    const grandTotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const handleSave = () => {
        if (items.length === 0) {
            toast.error('Please add at least one item');
            return;
        }
        onSave(items, grandTotal);
        onOpenChange(false);
        toast.success(`Breakup saved: ${formatCurrency(grandTotal)}`);
    };

    // Filter fields - separate main fields and remarks
    const mainFields = typeConfig.fields.filter(f => f.type !== 'textarea');
    const remarksField = typeConfig.fields.find(f => f.type === 'textarea');

    // Render a single field cell
    const renderFieldCell = (field: BreakupFieldDef, item: BreakupItem) => {
        const value = item[field.name];

        if (field.type === 'display' || field.isCalculated) {
            const calculatedValue = field.name === 'systemExpected'
                ? (Number(item.actualExpenditure) || 0) * 1.1
                : calculateItemTotal(item);

            return (
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    {formatCurrency(calculatedValue)}
                </span>
            );
        }

        if (field.type === 'dropdown') {
            return (
                <Select
                    value={String(value || '')}
                    onValueChange={(v) => updateItem(item.id, field.name, v)}
                    disabled={isReadOnly}
                >
                    <SelectTrigger className="h-8 min-w-[100px] text-xs">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        return (
            <Input
                type={field.type === 'number' ? 'number' : 'text'}
                value={value !== undefined ? value : ''}
                onChange={(e) => updateItem(
                    item.id,
                    field.name,
                    field.type === 'number' ? Number(e.target.value) : e.target.value
                )}
                placeholder={field.placeholder || (field.type === 'number' ? '0' : '')}
                className="h-8 min-w-[80px] text-xs"
                readOnly={isReadOnly}
            />
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-0">
                {/* Header */}
                <DialogHeader className="px-4 py-3 border-b bg-white pr-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calculator className="text-blue-600" size={18} />
                            <DialogTitle className="text-base">{typeConfig.label}</DialogTitle>
                            <span className="text-xs text-slate-500 font-mono ml-2">{budgetLine.objectHead}/{budgetLine.detailHead}</span>
                        </div>
                        <div className="text-right mr-4">
                            <span className="text-xs text-slate-500 uppercase mr-2">Total:</span>
                            <span className="text-lg font-bold text-slate-900">{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 overflow-auto px-4 py-3 bg-slate-50">
                    {/* Table Header */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-slate-600 uppercase w-8">#</th>
                                    {mainFields.map((field) => (
                                        <th key={field.name} className="px-2 py-2 text-left text-xs font-medium text-slate-600 uppercase whitespace-nowrap">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                        </th>
                                    ))}
                                    {remarksField && (
                                        <th className="px-2 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                                            {remarksField.label}
                                        </th>
                                    )}
                                    <th className="px-2 py-2 text-right text-xs font-medium text-slate-600 uppercase w-24">Row Total</th>
                                    {!isReadOnly && <th className="px-2 py-2 w-10"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="px-2 py-2 text-xs text-slate-500">{index + 1}</td>
                                        {mainFields.map((field) => (
                                            <td key={field.name} className="px-2 py-2">
                                                {renderFieldCell(field, item)}
                                            </td>
                                        ))}
                                        {remarksField && (
                                            <td className="px-2 py-2">
                                                <Input
                                                    value={String(item[remarksField.name] || '')}
                                                    onChange={(e) => updateItem(item.id, remarksField.name, e.target.value)}
                                                    placeholder="Notes..."
                                                    className="h-8 min-w-[120px] text-xs"
                                                    readOnly={isReadOnly}
                                                />
                                            </td>
                                        )}
                                        <td className="px-2 py-2 text-right">
                                            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(calculateItemTotal(item))}
                                            </span>
                                        </td>
                                        {!isReadOnly && (
                                            <td className="px-2 py-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => deleteItem(item.id)}
                                                    disabled={items.length <= 1}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan={mainFields.length + (remarksField ? 4 : 3)} className="text-center py-6 text-slate-400 text-sm italic">
                                            No entries. Click "Add Row" below.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Row Button */}
                    {!isReadOnly && (
                        <Button
                            onClick={addItem}
                            variant="outline"
                            size="sm"
                            className="mt-3 border-dashed text-slate-500 hover:text-blue-600 hover:border-blue-300"
                        >
                            <Plus size={14} className="mr-1" /> Add Row
                        </Button>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="px-4 py-3 border-t bg-white">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-slate-500">{typeConfig.description}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
                            {!isReadOnly && (
                                <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Save size={14} className="mr-1" /> Save to BE1
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
