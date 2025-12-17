'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
    id: string;
    label: string;
    role: string;
    date?: string;
    status: 'pending' | 'current' | 'completed';
}

interface WorkflowTimelineProps {
    steps: WorkflowStep[];
    className?: string;
}

export function WorkflowTimeline({ steps, className }: WorkflowTimelineProps) {
    return (
        <div className={cn("bg-white rounded-xl p-6 border border-slate-200", className)}>
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Approval Workflow</h3>

            <div className="relative">
                {steps.map((step, index) => (
                    <div key={step.id} className="relative pb-8 last:pb-0">
                        {index !== steps.length - 1 && (
                            <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-200">
                                <div
                                    className={cn(
                                        "w-full transition-all duration-500",
                                        step.status === 'completed' ? 'bg-emerald-500' : 'bg-transparent'
                                    )}
                                    style={{ height: step.status === 'completed' ? '100%' : '0%' }}
                                />
                            </div>
                        )}

                        <div className="relative flex items-start gap-4">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0",
                                step.status === 'completed' && "bg-emerald-500 border-emerald-500",
                                step.status === 'current' && "bg-blue-500 border-blue-500 shadow-lg shadow-blue-200 animate-pulse",
                                step.status === 'pending' && "bg-white border-slate-300"
                            )}>
                                {step.status === 'completed' ? (
                                    <Check size={16} className="text-white" />
                                ) : step.status === 'current' ? (
                                    <div className="w-3 h-3 bg-white rounded-full" />
                                ) : (
                                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                )}
                            </div>

                            <div className="flex-1 pt-0.5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className={cn(
                                            "font-semibold transition-colors",
                                            step.status === 'completed' && "text-emerald-700",
                                            step.status === 'current' && "text-blue-700",
                                            step.status === 'pending' && "text-slate-500"
                                        )}>
                                            {step.label}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-0.5">{step.role}</p>
                                    </div>
                                    {step.date && (
                                        <p className="text-xs text-slate-400">{step.date}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
