'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FurnitureAsset } from '@/data/budget-expenditure/types';

interface FurnitureFormProps {
    asset: FurnitureAsset;
    onChange: (asset: FurnitureAsset) => void;
    disabled?: boolean;
}

export function FurnitureForm({ asset, onChange, disabled = false }: FurnitureFormProps) {
    const handleChange = (field: keyof FurnitureAsset, value: any) => {
        const updated = { ...asset, [field]: value };
        // Auto-calculate total cost
        if (field === 'newRequired' || field === 'perUnitCost') {
            const qty = field === 'newRequired' ? value : updated.newRequired;
            const cost = field === 'perUnitCost' ? value : updated.perUnitCost;
            updated.totalCost = qty * cost;
        }
        onChange(updated);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
                <Label className="text-slate-700 font-medium">Name of Furniture Item <span className="text-red-500">*</span></Label>
                <Input
                    value={asset.itemName}
                    onChange={(e) => handleChange('itemName', e.target.value)}
                    disabled={disabled}
                    placeholder="e.g., Table, Chair, Almirah, etc."
                    className="mt-2"
                />
            </div>

            <div className="md:col-span-3">
                <Label className="text-slate-700 font-medium">Description</Label>
                <Input
                    value={asset.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={disabled}
                    placeholder="Usage or purpose description"
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Old Available Quantity <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    min="0"
                    value={asset.oldQuantity}
                    onChange={(e) => handleChange('oldQuantity', parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Employees Using</Label>
                <Input
                    type="number"
                    min="0"
                    value={asset.employeesUsing}
                    onChange={(e) => handleChange('employeesUsing', parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">New Required Quantity <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    min="0"
                    value={asset.newRequired}
                    onChange={(e) => handleChange('newRequired', parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Per Unit Cost (₹) <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={asset.perUnitCost}
                    onChange={(e) => handleChange('perUnitCost', parseFloat(e.target.value) || 0)}
                    disabled={disabled}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Total Cost (₹)</Label>
                <Input
                    type="text"
                    value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(asset.totalCost)}
                    disabled
                    className="mt-2 bg-emerald-50 border-emerald-200 font-bold text-emerald-700"
                />
                <p className="text-xs text-slate-500 mt-1">New Qty × Unit Cost</p>
            </div>

            <div className="md:col-span-3">
                <Label className="text-slate-700 font-medium">Reason for New Purchase <span className="text-red-500">*</span></Label>
                <Textarea
                    value={asset.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    disabled={disabled}
                    placeholder="Explain why this furniture is needed..."
                    className="mt-2"
                    rows={2}
                />
            </div>

            <div className="md:col-span-3">
                <Label className="text-slate-700 font-medium">Remarks</Label>
                <Input
                    value={asset.remarks || ''}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    disabled={disabled}
                    placeholder="Additional remarks (optional)"
                    className="mt-2"
                />
            </div>
        </div>
    );
}
