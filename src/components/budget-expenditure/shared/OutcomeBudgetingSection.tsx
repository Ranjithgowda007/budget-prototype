'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SDG_GOALS, OUTCOME_CATEGORIES, GEOGRAPHY_TAGS, GENDER_TAGS } from '@/data/budget-expenditure/referenceData';

interface OutcomeBudgetingSectionProps {
    outcomeCategory?: string;
    sdgGoal?: string;
    sdgTarget?: string;
    genderTag?: 'Women' | 'Child' | 'Youth' | 'General';
    scstTag?: boolean;
    geographyTag?: string;
    onChange: (field: string, value: any) => void;
    disabled?: boolean;
    className?: string;
}

export function OutcomeBudgetingSection({
    outcomeCategory,
    sdgGoal,
    sdgTarget,
    genderTag,
    scstTag,
    geographyTag,
    onChange,
    disabled = false,
    className
}: OutcomeBudgetingSectionProps) {
    return (
        <div className={cn("bg-white rounded-xl p-6 border border-slate-200", className)}>
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Outcome-Based Budgeting</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Outcome Category */}
                <div>
                    <Label htmlFor="outcomeCategory">Outcome Category</Label>
                    <Select
                        value={outcomeCategory}
                        onValueChange={(value) => onChange('outcomeCategory', value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select outcome category" />
                        </SelectTrigger>
                        <SelectContent>
                            {OUTCOME_CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SDG Goal */}
                <div>
                    <Label htmlFor="sdgGoal">SDG Goal Mapping</Label>
                    <Select
                        value={sdgGoal}
                        onValueChange={(value) => onChange('sdgGoal', value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select SDG Goal" />
                        </SelectTrigger>
                        <SelectContent>
                            {SDG_GOALS.map(goal => (
                                <SelectItem key={goal.id} value={goal.id}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: goal.color }} />
                                        SDG {goal.id}: {goal.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SDG Target */}
                <div>
                    <Label htmlFor="sdgTarget">SDG Target</Label>
                    <Select
                        value={sdgTarget}
                        onValueChange={(value) => onChange('sdgTarget', value)}
                        disabled={disabled || !sdgGoal}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={`${sdgGoal}.1`}>Target {sdgGoal}.1</SelectItem>
                            <SelectItem value={`${sdgGoal}.2`}>Target {sdgGoal}.2</SelectItem>
                            <SelectItem value={`${sdgGoal}.3`}>Target {sdgGoal}.3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Gender Tag */}
                <div>
                    <Label htmlFor="genderTag">Gender Tag</Label>
                    <Select
                        value={genderTag}
                        onValueChange={(value) => onChange('genderTag', value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select gender tag" />
                        </SelectTrigger>
                        <SelectContent>
                            {GENDER_TAGS.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SC/ST Component */}
                <div>
                    <Label htmlFor="scstTag">SC/ST Component</Label>
                    <Select
                        value={scstTag ? 'yes' : 'no'}
                        onValueChange={(value) => onChange('scstTag', value === 'yes')}
                        disabled={disabled}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Geography Tag */}
                <div>
                    <Label htmlFor="geographyTag">Geography Tag</Label>
                    <Select
                        value={geographyTag}
                        onValueChange={(value) => onChange('geographyTag', value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select geography" />
                        </SelectTrigger>
                        <SelectContent>
                            {GEOGRAPHY_TAGS.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
