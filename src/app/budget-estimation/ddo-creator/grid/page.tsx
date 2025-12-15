'use client';

import React, { useState } from 'react';
import { SmartBudgetGrid } from '@/components/budget-estimation/grid/SmartBudgetGrid';
import { TableBudgetGrid } from '@/components/budget-estimation/grid/TableBudgetGrid';
import { MOCK_BUDGET_LINE_ITEMS, MOCK_ESTIMATIONS } from '@/data/budget-estimation/mockData';
import { toast } from 'sonner';
import { LayoutGrid, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DDOCreatorGridPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const budgetLines = MOCK_BUDGET_LINE_ITEMS;

    const estimations = budgetLines.map(line => {
        const existing = MOCK_ESTIMATIONS.find(e => e.budgetLineItemId === line.id);
        return existing || {
            id: `TEMP_${line.id}`,
            budgetLineItemId: line.id,
            status: 'draft' as const,
            currentLevel: 'ddo_creator' as const,
            reviseEstimateCY: 0,
            budgetEstimateNextYear: 0,
            forwardEstimateY2: 0,
            forwardEstimateY3: 0,
            percentageDeviation: 0,
            creatorRemarks: '',
            createdBy: 'CURRENT_USER',
            createdAt: new Date().toISOString(),
            exceedsCeiling: false
        };
    });

    const handleSave = () => {
        toast.success("Draft saved successfully", {
            description: "Your changes have been saved locally."
        });
    };

    const handleSubmit = () => {
        toast.success("Submitted to Verifier", {
            description: "Budget estimations have been forwarded to the DDO Verifier."
        });
    };

    return (
        <div className="relative">
            {/* View Toggle - Fixed position */}
            <div className="fixed top-4 right-6 z-50 bg-white rounded-lg shadow-lg border border-slate-200 p-1 flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                        "gap-2 px-3",
                        viewMode === 'grid'
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "text-slate-600 hover:bg-slate-100"
                    )}
                >
                    <LayoutGrid size={16} />
                    <span className="hidden sm:inline">Card View</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={cn(
                        "gap-2 px-3",
                        viewMode === 'table'
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            : "text-slate-600 hover:bg-slate-100"
                    )}
                >
                    <Table2 size={16} />
                    <span className="hidden sm:inline">Table View</span>
                </Button>
            </div>

            {/* Conditional View Rendering */}
            {viewMode === 'grid' ? (
                <SmartBudgetGrid
                    role="creator"
                    items={budgetLines}
                    estimations={estimations}
                    onSave={handleSave}
                    onSubmit={handleSubmit}
                />
            ) : (
                <TableBudgetGrid
                    role="creator"
                    items={budgetLines}
                    estimations={estimations}
                />
            )}
        </div>
    );
}
