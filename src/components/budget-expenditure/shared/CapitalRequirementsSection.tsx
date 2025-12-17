'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    TypedAsset,
    AssetCategory,
    ASSET_CATEGORY_CONFIG,
    TelephoneAsset,
    FurnitureAsset,
    VehicleFuelAsset,
    OfficeEquipmentAsset,
    ITAssetItem,
    CarRentalAsset
} from '@/data/budget-expenditure/types';
import {
    TelephoneForm,
    FurnitureForm,
    VehicleFuelForm,
    OfficeEquipmentForm,
    ITAssetForm,
    CarRentalForm
} from './asset-forms';
import { cn } from '@/lib/utils';

interface CapitalRequirementsSectionProps {
    assets: TypedAsset[];
    onChange: (assets: TypedAsset[]) => void;
    disabled?: boolean;
    className?: string;
}

// Factory function to create default asset based on category
function createDefaultAsset(category: AssetCategory): TypedAsset {
    const baseAsset = {
        id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category,
        description: '',
        oldQuantity: 0,
        employeesUsing: 0,
        newRequired: 0,
        reason: '',
        remarks: ''
    };

    switch (category) {
        case 'telephone':
            return {
                ...baseAsset,
                category: 'telephone',
                connectionType: 'Mobile',
                monthlyCharge: 0,
                yearlyTotal: 0
            } as TelephoneAsset;
        case 'furniture':
            return {
                ...baseAsset,
                category: 'furniture',
                itemName: '',
                perUnitCost: 0,
                totalCost: 0
            } as FurnitureAsset;
        case 'vehicleFuel':
            return {
                ...baseAsset,
                category: 'vehicleFuel',
                vehicleType: 'Car',
                monthlyFuelCost: 0,
                yearlyTotal: 0
            } as VehicleFuelAsset;
        case 'officeEquipment':
            return {
                ...baseAsset,
                category: 'officeEquipment',
                equipmentName: '',
                perUnitCost: 0,
                totalCost: 0
            } as OfficeEquipmentAsset;
        case 'itAsset':
            return {
                ...baseAsset,
                category: 'itAsset',
                assetType: 'Desktop',
                perUnitCost: 0,
                totalCost: 0
            } as ITAssetItem;
        case 'carRental':
            return {
                ...baseAsset,
                category: 'carRental',
                vehicleType: 'Sedan',
                monthlyRentalCharge: 0,
                yearlyTotal: 0
            } as CarRentalAsset;
    }
}

// Get cost from asset based on type
function getAssetCost(asset: TypedAsset): number {
    switch (asset.category) {
        case 'telephone':
        case 'vehicleFuel':
        case 'carRental':
            return (asset as TelephoneAsset | VehicleFuelAsset | CarRentalAsset).yearlyTotal;
        case 'furniture':
        case 'officeEquipment':
        case 'itAsset':
            return (asset as FurnitureAsset | OfficeEquipmentAsset | ITAssetItem).totalCost;
    }
}

export function CapitalRequirementsSection({
    assets,
    onChange,
    disabled = false,
    className
}: CapitalRequirementsSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState<AssetCategory | ''>('');
    const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());

    const addAsset = () => {
        if (!selectedCategory) return;
        const newAsset = createDefaultAsset(selectedCategory);
        onChange([...assets, newAsset]);
        setExpandedAssets(prev => new Set([...prev, newAsset.id]));
        setSelectedCategory('');
    };

    const removeAsset = (id: string) => {
        onChange(assets.filter(a => a.id !== id));
        setExpandedAssets(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const updateAsset = (id: string, updatedAsset: TypedAsset) => {
        onChange(assets.map(a => a.id === id ? updatedAsset : a));
    };

    const toggleExpand = (id: string) => {
        setExpandedAssets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderAssetForm = (asset: TypedAsset) => {
        switch (asset.category) {
            case 'telephone':
                return <TelephoneForm asset={asset as TelephoneAsset} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
            case 'furniture':
                return <FurnitureForm asset={asset as FurnitureAsset} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
            case 'vehicleFuel':
                return <VehicleFuelForm asset={asset as VehicleFuelAsset} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
            case 'officeEquipment':
                return <OfficeEquipmentForm asset={asset as OfficeEquipmentAsset} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
            case 'itAsset':
                return <ITAssetForm asset={asset as ITAssetItem} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
            case 'carRental':
                return <CarRentalForm asset={asset as CarRentalAsset} onChange={(a) => updateAsset(asset.id, a)} disabled={disabled} />;
        }
    };

    const totalCost = assets.reduce((sum, asset) => sum + getAssetCost(asset), 0);

    // Group assets by category for display
    const groupedAssets = assets.reduce((acc, asset) => {
        if (!acc[asset.category]) {
            acc[asset.category] = [];
        }
        acc[asset.category].push(asset);
        return acc;
    }, {} as Record<AssetCategory, TypedAsset[]>);

    return (
        <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm", className)}>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-lg shadow-sm">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Asset / Capital Requirements</h3>
                            <p className="text-sm text-slate-600 mt-0.5">Add item-wise breakup for capital requirements</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Asset Section */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <Label className="text-slate-700 font-medium mb-2 block">Select Asset Type to Add</Label>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as AssetCategory)}
                        disabled={disabled}
                        className="flex-1 min-w-[280px] rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-sm"
                    >
                        <option value="">-- Select Asset Category --</option>
                        {Object.entries(ASSET_CATEGORY_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.code} - {config.label}
                            </option>
                        ))}
                    </select>
                    <Button
                        onClick={addAsset}
                        disabled={disabled || !selectedCategory}
                        className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                    >
                        <Plus size={16} />
                        Add Item
                    </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Select from: Telephone (22/002), Furniture (22/003), Vehicle Fuel (22/009), Office Equipment (23/001), IT Assets (27/001), Car Rental (31/007)
                </p>
            </div>

            {/* Assets List */}
            <div className="p-6">
                {assets.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No asset requirements added</p>
                        <p className="text-sm text-slate-400 mt-1">Select an asset type above and click "Add Item" to begin</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assets.map((asset, index) => {
                            const config = ASSET_CATEGORY_CONFIG[asset.category];
                            const isExpanded = expandedAssets.has(asset.id);
                            const cost = getAssetCost(asset);

                            return (
                                <div
                                    key={asset.id}
                                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Asset Header */}
                                    <div
                                        className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => toggleExpand(asset.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                        {config.code}
                                                    </span>
                                                    <span className="font-semibold text-slate-800">{config.label}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5">{config.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Total Cost</p>
                                                <p className="font-bold text-indigo-700">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(cost)}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={(e) => { e.stopPropagation(); removeAsset(asset.id); }}
                                                disabled={disabled}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Asset Form */}
                                    {isExpanded && (
                                        <div className="p-5 border-t border-slate-100">
                                            {renderAssetForm(asset)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Total Footer */}
            {assets.length > 0 && (
                <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-600 font-medium">Total Asset/Capital Requirements</span>
                            <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                                {assets.length} {assets.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-indigo-700">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(totalCost)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
