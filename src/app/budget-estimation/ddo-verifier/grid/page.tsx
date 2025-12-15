'use client';

import React, { useState } from 'react';
import { SmartBudgetGrid } from '@/components/budget-estimation/grid/SmartBudgetGrid';
import { TableBudgetGrid } from '@/components/budget-estimation/grid/TableBudgetGrid';
import { MOCK_BUDGET_LINE_ITEMS, MOCK_ESTIMATIONS } from '@/data/budget-estimation/mockData';
import { toast } from 'sonner';
import { LayoutGrid, Table2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DDOVerifierGridPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Show all budget lines (entire batch is submitted together)
    const budgetLines = MOCK_BUDGET_LINE_ITEMS;

    // Create estimations for all budget lines
    const estimations = budgetLines.map(line => {
        const existing = MOCK_ESTIMATIONS.find(e => e.budgetLineItemId === line.id);
        return existing || {
            id: `TEMP_${line.id}`,
            budgetLineItemId: line.id,
            status: 'under_verification' as const,
            currentLevel: 'ddo_verifier' as const,
            reviseEstimateCY: 0,
            budgetEstimateNextYear: 0,
            forwardEstimateY2: 0,
            forwardEstimateY3: 0,
            percentageDeviation: 0,
            creatorRemarks: '',
            createdBy: 'DDO_CREATOR',
            createdAt: new Date().toISOString(),
            exceedsCeiling: false
        };
    });

    const handleSave = () => {
        toast.success("Changes saved", {
            description: "Verification progress saved locally."
        });
    };

    const handleSubmit = () => {
        toast.success("Forwarded to Approver", {
            description: "All budget estimations have been verified and forwarded."
        });
    };

    // View toggle component to render inside the header bar
    const ViewToggle = (
        <div className="bg-slate-100 rounded-lg p-1 flex gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                    "gap-2 px-3 h-8",
                    viewMode === 'grid'
                        ? "bg-white text-blue-700 shadow-sm hover:bg-white"
                        : "text-slate-600 hover:bg-slate-200"
                )}
            >
                <LayoutGrid size={16} />
                <span>Card View</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                    "gap-2 px-3 h-8",
                    viewMode === 'table'
                        ? "bg-white text-blue-700 shadow-sm hover:bg-white"
                        : "text-slate-600 hover:bg-slate-200"
                )}
            >
                <Table2 size={16} />
                <span>Table View</span>
            </Button>
        </div>
    );

    return (
        <>
            {viewMode === 'grid' ? (
                <SmartBudgetGrid
                    role="verifier"
                    items={budgetLines}
                    estimations={estimations}
                    onSave={handleSave}
                    onSubmit={handleSubmit}
                    viewToggle={ViewToggle}
                />
            ) : (
                <TableBudgetGrid
                    role="verifier"
                    items={budgetLines}
                    estimations={estimations}
                    viewToggle={ViewToggle}
                />
            )}
        </>
    );
}
