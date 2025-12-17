'use client';

import React from 'react';
import { Plus, Trash2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AssetRequirement } from '@/data/budget-expenditure/types';
import { cn } from '@/lib/utils';

interface AssetRequirementsTableProps {
    assets: AssetRequirement[];
    onChange: (assets: AssetRequirement[]) => void;
    disabled?: boolean;
    className?: string;
}

export function AssetRequirementsTable({
    assets,
    onChange,
    disabled = false,
    className
}: AssetRequirementsTableProps) {
    const addAsset = () => {
        const newAsset: AssetRequirement = {
            id: `asset-${Date.now()}`,
            itemName: '',
            oldQuantity: 0,
            employeesUsing: 0,
            newRequired: 0,
            unitCost: 0,
            totalCost: 0,
            reason: ''
        };
        onChange([...assets, newAsset]);
    };

    const removeAsset = (id: string) => {
        onChange(assets.filter(a => a.id !== id));
    };

    const updateAsset = (id: string, field: keyof AssetRequirement, value: any) => {
        const updated = assets.map(asset => {
            if (asset.id === id) {
                const updatedAsset = { ...asset, [field]: value };
                // Auto-calculate total cost
                if (field === 'newRequired' || field === 'unitCost') {
                    updatedAsset.totalCost = updatedAsset.newRequired * updatedAsset.unitCost;
                }
                return updatedAsset;
            }
            return asset;
        });
        onChange(updated);
    };

    return (
        <div className={cn("bg-white rounded-xl p-6 border border-slate-200", className)}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Asset / Capital Requirements</h3>
                </div>
                <Button
                    onClick={addAsset}
                    disabled={disabled}
                    size="sm"
                    className="gap-2"
                >
                    <Plus size={16} />
                    Add Asset
                </Button>
            </div>

            {assets.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-sm">No asset requirements added</p>
                    <p className="text-xs mt-1">Click "Add Asset" to begin</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {assets.map((asset, index) => (
                        <div key={asset.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-slate-700">Asset {index + 1}</h4>
                                <Button
                                    onClick={() => removeAsset(asset.id)}
                                    disabled={disabled}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-3">
                                    <Label>Name of Item / Asset</Label>
                                    <Input
                                        value={asset.itemName}
                                        onChange={(e) => updateAsset(asset.id, 'itemName', e.target.value)}
                                        disabled={disabled}
                                        placeholder="e.g., Desktop Computer"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Old Available Quantity</Label>
                                    <Input
                                        type="number"
                                        value={asset.oldQuantity}
                                        onChange={(e) => updateAsset(asset.id, 'oldQuantity', parseInt(e.target.value) || 0)}
                                        disabled={disabled}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Employees Using</Label>
                                    <Input
                                        type="number"
                                        value={asset.employeesUsing}
                                        onChange={(e) => updateAsset(asset.id, 'employeesUsing', parseInt(e.target.value) || 0)}
                                        disabled={disabled}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>New Required Quantity</Label>
                                    <Input
                                        type="number"
                                        value={asset.newRequired}
                                        onChange={(e) => updateAsset(asset.id, 'newRequired', parseInt(e.target.value) || 0)}
                                        disabled={disabled}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Per Unit Cost (₹)</Label>
                                    <Input
                                        type="number"
                                        value={asset.unitCost}
                                        onChange={(e) => updateAsset(asset.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                        disabled={disabled}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label>Total Cost (₹)</Label>
                                    <Input
                                        type="number"
                                        value={asset.totalCost}
                                        disabled
                                        className="mt-2 bg-slate-100 font-bold"
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <Label>Reason for New Purchase</Label>
                                    <Textarea
                                        value={asset.reason}
                                        onChange={(e) => updateAsset(asset.id, 'reason', e.target.value)}
                                        disabled={disabled}
                                        placeholder="Explain why this asset is needed..."
                                        className="mt-2"
                                        rows={2}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <Label>Remarks (Optional)</Label>
                                    <Input
                                        value={asset.remarks || ''}
                                        onChange={(e) => updateAsset(asset.id, 'remarks', e.target.value)}
                                        disabled={disabled}
                                        placeholder="Additional remarks..."
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {assets.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">Total Asset Cost</span>
                        <span className="text-2xl font-bold text-indigo-600">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0
                            }).format(assets.reduce((sum, asset) => sum + asset.totalCost, 0))}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
