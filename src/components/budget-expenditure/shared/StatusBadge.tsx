'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'draft' | 'submitted' | 'under_verification' | 'verified' | 'under_approval' | 'approved' | 'rejected' | 'returned';

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string; icon: string }> = {
    draft: {
        label: 'Draft',
        color: 'text-slate-700',
        bgColor: 'bg-slate-100',
        icon: '✏️'
    },
    submitted: {
        label: 'Submitted',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        icon: '📤'
    },
    under_verification: {
        label: 'Under Verification',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        icon: '🔍'
    },
    verified: {
        label: 'Verified',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-100',
        icon: '✓'
    },
    under_approval: {
        label: 'Under Approval',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        icon: '⏳'
    },
    approved: {
        label: 'Approved',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        icon: '✅'
    },
    rejected: {
        label: 'Rejected',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: '❌'
    },
    returned: {
        label: 'Returned',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: '↩️'
    }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
            config.bgColor,
            config.color,
            className
        )}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </div>
    );
}
