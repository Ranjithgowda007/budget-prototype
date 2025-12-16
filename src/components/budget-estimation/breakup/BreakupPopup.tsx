'use client';

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, Save, X } from 'lucide-react';
import { BreakupConfig, BreakupFormType } from '@/data/budget-estimation/breakupConfig';
import { formatCurrency } from '@/data/budget-estimation/mockData';
import { toast } from 'sonner';

interface BreakupItem {
    id: string;
    [key: string]: string | number;
}

interface BreakupPopupProps {
    open: boolean;
    onClose: () => void;
    onSave: (total: number, items: BreakupItem[]) => void;
    config: BreakupConfig;
    budgetLineId: string;
    existingItems?: BreakupItem[];
}

// Form field configurations based on category
const FORM_CONFIGS: Record<string, { fields: FormField[]; totalFormula: (item: BreakupItem) => number }> = {
    salary: {
        fields: [
            { name: 'gradePay', label: 'Grade Pay Code', type: 'dropdown', required: true, options: ['GP1800', 'GP2400', 'GP2800', 'GP4200', 'GP4600', 'GP5400', 'GP6600', 'GP7600'] },
            { name: 'employeeCount', label: 'Employee Count', type: 'number', required: true },
            { name: 'avgBasicPay', label: 'Avg Basic Pay (₹)', type: 'number', required: true },
            { name: 'rate', label: 'Rate/Percentage', type: 'number', required: false },
            { name: 'monthlyAmount', label: 'Monthly Amount (₹)', type: 'calculated', required: false },
            { name: 'annualAmount', label: 'Annual Amount (₹)', type: 'calculated', required: false },
        ],
        totalFormula: (item) => {
            const count = Number(item.employeeCount) || 0;
            const basicPay = Number(item.avgBasicPay) || 0;
            const rate = Number(item.rate) || 100; // Default 100% if no rate
            return count * basicPay * (rate / 100) * 12;
        }
    },
    equipment: {
        fields: [
            { name: 'itemName', label: 'Item Name', type: 'text', required: true },
            { name: 'itemType', label: 'Type', type: 'dropdown', required: true, options: ['Desktop', 'Laptop', 'Printer', 'Scanner', 'UPS', 'Server', 'Mobile', 'Landline', 'Broadband', 'Table', 'Chair', 'Almirah', 'Other'] },
            { name: 'oldQuantity', label: 'Old Qty', type: 'number', required: true },
            { name: 'newQuantity', label: 'New Qty', type: 'number', required: true },
            { name: 'unitCost', label: 'Unit Cost (₹)', type: 'number', required: true },
            { name: 'totalCost', label: 'Total Cost (₹)', type: 'calculated', required: false },
        ],
        totalFormula: (item) => {
            const qty = Number(item.newQuantity) || 0;
            const cost = Number(item.unitCost) || 0;
            return qty * cost;
        }
    },
    service: {
        fields: [
            { name: 'staffType', label: 'Staff Type', type: 'dropdown', required: true, options: ['Peon', 'DEO', 'Security', 'Sweeper', 'Driver', 'Sedan', 'SUV', 'Other'] },
            { name: 'vendorName', label: 'Vendor/Provider', type: 'text', required: false },
            { name: 'staffCount', label: 'Count', type: 'number', required: true },
            { name: 'monthlyRate', label: 'Monthly Rate (₹)', type: 'number', required: true },
            { name: 'duration', label: 'Months', type: 'number', required: true },
            { name: 'annualCost', label: 'Annual Cost (₹)', type: 'calculated', required: false },
        ],
        totalFormula: (item) => {
            const count = Number(item.staffCount) || 0;
            const rate = Number(item.monthlyRate) || 0;
            const duration = Number(item.duration) || 12;
            return count * rate * duration;
        }
    },
    utility: {
        fields: [
            { name: 'meterPurpose', label: 'Meter/Purpose', type: 'text', required: true },
            { name: 'actualExpenditure', label: 'Last Year Actual (₹)', type: 'number', required: true },
            { name: 'escalation', label: 'Escalation %', type: 'number', required: false },
            { name: 'estimatedAmount', label: 'Estimated Amount (₹)', type: 'calculated', required: false },
        ],
        totalFormula: (item) => {
            const actual = Number(item.actualExpenditure) || 0;
            const escalation = Number(item.escalation) || 10; // Default 10%
            return actual * (1 + escalation / 100);
        }
    }
};

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'dropdown' | 'calculated';
    required: boolean;
    options?: string[];
}

export function BreakupPopup({ open, onClose, onSave, config, budgetLineId, existingItems = [] }: BreakupPopupProps) {
    const [items, setItems] = useState<BreakupItem[]>(
        existingItems.length > 0 ? existingItems : [createEmptyItem()]
    );

    function createEmptyItem(): BreakupItem {
        return {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
    }

    const formConfig = FORM_CONFIGS[config.category] || FORM_CONFIGS.equipment;

    const addItem = useCallback(() => {
        setItems(prev => [...prev, createEmptyItem()]);
    }, []);

    const removeItem = useCallback((itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const updateItem = useCallback((itemId: string, field: string, value: string | number) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    }, []);

    const calculateItemTotal = useCallback((item: BreakupItem): number => {
        return formConfig.totalFormula(item);
    }, [formConfig]);

    const grandTotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const handleSave = () => {
        // Validate required fields
        const hasEmptyRequired = items.some(item =>
            formConfig.fields
                .filter(f => f.required)
                .some(f => !item[f.name] && item[f.name] !== 0)
        );

        if (hasEmptyRequired) {
            toast.error('Please fill all required fields');
            return;
        }

        onSave(grandTotal, items);
        toast.success(`Breakup saved: ${formatCurrency(grandTotal)}`);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="text-blue-600" size={20} />
                        {config.label} - Item Breakup
                    </DialogTitle>
                    <p className="text-sm text-slate-500">{config.description}</p>
                </DialogHeader>

                <div className="flex-1 overflow-auto py-4">
                    {/* Items Table */}
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-slate-700">Item {index + 1}</span>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {formConfig.fields.map((field) => (
                                        <div key={field.name} className="space-y-1">
                                            <Label className="text-xs text-slate-600">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>

                                            {field.type === 'calculated' ? (
                                                <div className="h-9 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-sm font-medium text-emerald-700">
                                                    {formatCurrency(calculateItemTotal(item))}
                                                </div>
                                            ) : field.type === 'dropdown' ? (
                                                <Select
                                                    value={String(item[field.name] || '')}
                                                    onValueChange={(value) => updateItem(item.id, field.name, value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map(opt => (
                                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    type={field.type}
                                                    value={item[field.name] || ''}
                                                    onChange={(e) => updateItem(
                                                        item.id,
                                                        field.name,
                                                        field.type === 'number' ? Number(e.target.value) : e.target.value
                                                    )}
                                                    className="h-9"
                                                    placeholder={field.type === 'number' ? '0' : ''}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Item Button */}
                    <Button
                        variant="outline"
                        className="w-full mt-4 border-dashed border-2 text-slate-500 hover:text-blue-600 hover:border-blue-300"
                        onClick={addItem}
                    >
                        <Plus size={16} className="mr-2" />
                        Add Another Item
                    </Button>
                </div>

                {/* Footer with Total */}
                <DialogFooter className="border-t pt-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">Grand Total:</span>
                            <span className="text-xl font-bold text-emerald-600">
                                {formatCurrency(grandTotal)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                <X size={16} className="mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                                <Save size={16} className="mr-2" />
                                Save Breakup
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default BreakupPopup;
