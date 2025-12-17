'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, calculatePercentageDeviation } from '@/data/budget-expenditure/mockData';

interface EstimationInputsProps {
    reviseEstimateCY: number;
    budgetEstimateNextYear: number;
    forwardEstimateY2?: number;
    forwardEstimateY3?: number;
    ceilingLimit: number;
    currentYearBE: number;
    onChange: (field: string, value: number) => void;
    disabled?: boolean;
    className?: string;
}

export function EstimationInputs({
    reviseEstimateCY,
    budgetEstimateNextYear,
    forwardEstimateY2,
    forwardEstimateY3,
    ceilingLimit,
    currentYearBE,
    onChange,
    disabled = false,
    className
}: EstimationInputsProps) {
    const deviation = calculatePercentageDeviation(budgetEstimateNextYear, reviseEstimateCY);
    const exceedsCeiling = budgetEstimateNextYear > ceilingLimit;

    const handleInputChange = (field: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        onChange(field, numValue);
    };

    return (
        <div className={cn("bg-white rounded-xl p-6 border border-slate-200", className)}>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Budget Estimation</h3>

            <div className="space-y-5">
                {/* Reference: Current Year BE */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm text-blue-700 font-semibold">Current Year Budget Estimate (Reference)</Label>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{formatCurrency(currentYearBE)}</p>
                </div>

                {/* Revised Estimate (Current Year) */}
                <div>
                    <Label htmlFor="revisedEstimate" className="flex items-center gap-2">
                        <span>Revised Estimate (Current Year)</span>
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="revisedEstimate"
                        type="number"
                        value={reviseEstimateCY}
                        onChange={(e) => handleInputChange('reviseEstimateCY', e.target.value)}
                        disabled={disabled}
                        className="mt-2 text-lg font-semibold"
                    />
                </div>

                {/* Budget Estimate (Next Year) */}
                <div>
                    <Label htmlFor="budgetEstimate" className="flex items-center gap-2">
                        <span>Budget Estimate (Next Year)</span>
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="budgetEstimate"
                        type="number"
                        value={budgetEstimateNextYear}
                        onChange={(e) => handleInputChange('budgetEstimateNextYear', e.target.value)}
                        disabled={disabled}
                        className={cn(
                            "mt-2 text-lg font-semibold",
                            exceedsCeiling && "border-red-500 focus-visible:ring-red-500"
                        )}
                    />
                    {exceedsCeiling && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                            <AlertCircle size={16} />
                            <span>Exceeds ceiling limit by {formatCurrency(budgetEstimateNextYear - ceilingLimit)}</span>
                        </div>
                    )}
                </div>

                {/* Percentage Deviation */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <Label className="text-sm text-slate-600">Percentage Deviation</Label>
                    <div className="flex items-center gap-2 mt-1">
                        {deviation > 0 ? (
                            <TrendingUp size={20} className="text-emerald-600" />
                        ) : deviation < 0 ? (
                            <TrendingDown size={20} className="text-red-600" />
                        ) : null}
                        <p className={cn(
                            "text-2xl font-bold",
                            deviation > 0 && "text-emerald-600",
                            deviation < 0 && "text-red-600",
                            deviation === 0 && "text-slate-600"
                        )}>
                            {deviation > 0 ? '+' : ''}{deviation.toFixed(2)}%
                        </p>
                    </div>
                </div>

                {/* Forward Estimates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="forwardY2">Forward Estimate (Y+2)</Label>
                        <Input
                            id="forwardY2"
                            type="number"
                            value={forwardEstimateY2 || ''}
                            onChange={(e) => handleInputChange('forwardEstimateY2', e.target.value)}
                            disabled={disabled}
                            placeholder="Optional"
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="forwardY3">Forward Estimate (Y+3)</Label>
                        <Input
                            id="forwardY3"
                            type="number"
                            value={forwardEstimateY3 || ''}
                            onChange={(e) => handleInputChange('forwardEstimateY3', e.target.value)}
                            disabled={disabled}
                            placeholder="Optional"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
