'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CarRentalAsset } from '@/data/budget-expenditure/types';

interface CarRentalFormProps {
    asset: CarRentalAsset;
    onChange: (asset: CarRentalAsset) => void;
    disabled?: boolean;
}

export function CarRentalForm({ asset, onChange, disabled = false }: CarRentalFormProps) {
    const handleChange = (field: keyof CarRentalAsset, value: any) => {
        const updated = { ...asset, [field]: value };
        // Auto-calculate yearly total
        if (field === 'oldQuantity' || field === 'newRequired' || field === 'monthlyRentalCharge') {
            const totalQty = (field === 'oldQuantity' ? value : updated.oldQuantity) +
                (field === 'newRequired' ? value : updated.newRequired);
            const monthly = field === 'monthlyRentalCharge' ? value : updated.monthlyRentalCharge;
            updated.yearlyTotal = totalQty * monthly * 12;
        }
        onChange(updated);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label className="text-slate-700 font-medium">Type of Vehicle <span className="text-red-500">*</span></Label>
                <select
                    value={asset.vehicleType}
                    onChange={(e) => handleChange('vehicleType', e.target.value)}
                    disabled={disabled}
                    className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                    <option value="">Select Vehicle Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                </select>
            </div>

            <div className="md:col-span-2">
                <Label className="text-slate-700 font-medium">Description</Label>
                <Input
                    value={asset.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={disabled}
                    placeholder="Purpose (inspection, official visits, etc.)"
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
                <Label className="text-slate-700 font-medium">Monthly Rental Charge (₹) <span className="text-red-500">*</span></Label>
                <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={asset.monthlyRentalCharge}
                    onChange={(e) => handleChange('monthlyRentalCharge', parseFloat(e.target.value) || 0)}
                    disabled={disabled}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-slate-700 font-medium">Yearly Total (₹)</Label>
                <Input
                    type="text"
                    value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(asset.yearlyTotal)}
                    disabled
                    className="mt-2 bg-emerald-50 border-emerald-200 font-bold text-emerald-700"
                />
                <p className="text-xs text-slate-500 mt-1">(Old + New) × Monthly × 12</p>
            </div>

            <div className="md:col-span-3">
                <Label className="text-slate-700 font-medium">Reason for New Requirement <span className="text-red-500">*</span></Label>
                <Textarea
                    value={asset.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    disabled={disabled}
                    placeholder="Justify why additional rental cars are needed..."
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
