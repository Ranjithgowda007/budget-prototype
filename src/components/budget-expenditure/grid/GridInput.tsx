'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface GridInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isEditable?: boolean;
    hasError?: boolean;
}

export function GridInput({ className, isEditable = true, hasError, ...props }: GridInputProps) {
    if (!isEditable) {
        return (
            <div className={cn(
                "px-3 py-2 text-sm text-slate-500 bg-slate-50 border border-transparent truncate font-medium",
                className
            )}>
                {props.value?.toLocaleString() || '-'}
            </div>
        );
    }

    return (
        <Input
            className={cn(
                "h-9 bg-blue-50/50 border-blue-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900 text-right",
                hasError && "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500",
                className
            )}
            {...props}
        />
    );
}
