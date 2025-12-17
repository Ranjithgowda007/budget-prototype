'use client';

import React from 'react';
import { X, History, User, Edit3, Send, CheckCircle, RotateCcw, XCircle, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuditTrailEntry, BudgetLineItem } from '@/data/budget-expenditure/types';
import { cn } from '@/lib/utils';

interface AuditTrailModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    budgetLine: BudgetLineItem;
    auditTrail: AuditTrailEntry[];
}

const ACTION_CONFIG = {
    created: { label: 'Created', icon: FileText, color: 'bg-blue-500', textColor: 'text-blue-600' },
    modified: { label: 'Modified', icon: Edit3, color: 'bg-amber-500', textColor: 'text-amber-600' },
    submitted: { label: 'Submitted', icon: Send, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
    verified: { label: 'Verified', icon: CheckCircle, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    approved: { label: 'Approved', icon: CheckCircle, color: 'bg-green-600', textColor: 'text-green-600' },
    returned: { label: 'Returned', icon: RotateCcw, color: 'bg-orange-500', textColor: 'text-orange-600' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'bg-red-500', textColor: 'text-red-600' },
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
    ddo_creator: { label: 'DDO Creator', color: 'bg-blue-100 text-blue-700' },
    ddo_verifier: { label: 'DDO Verifier', color: 'bg-purple-100 text-purple-700' },
    ddo_approver: { label: 'DDO Approver', color: 'bg-indigo-100 text-indigo-700' },
    bco_creator: { label: 'BCO Creator', color: 'bg-cyan-100 text-cyan-700' },
    bco_verifier: { label: 'BCO Verifier', color: 'bg-teal-100 text-teal-700' },
    bco_approver: { label: 'BCO Approver', color: 'bg-emerald-100 text-emerald-700' },
};

function formatDateTime(timestamp: string): { date: string; time: string } {
    const d = new Date(timestamp);
    return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
}

function formatValue(val: string | number | null): string {
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return String(val);
}

export function AuditTrailModal({ isOpen, onOpenChange, budgetLine, auditTrail }: AuditTrailModalProps) {
    if (!isOpen) return null;

    // Sort by timestamp descending (newest first)
    const sortedTrail = [...auditTrail].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Group by level
    const ddoEntries = sortedTrail.filter(e => e.level === 'DDO');
    const bcoEntries = sortedTrail.filter(e => e.level === 'BCO');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[800px] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex-shrink-0 bg-gradient-to-r from-slate-900 to-slate-800 p-5 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <History className="text-white" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Audit Trail</h2>
                                <p className="text-sm text-slate-300 font-mono">{budgetLine.budgetHead}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                            onClick={() => onOpenChange(false)}
                        >
                            <X size={20} />
                        </Button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{budgetLine.scheme}</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {sortedTrail.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No audit trail entries yet</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* DDO Level */}
                            {ddoEntries.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 px-3 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">DDO Level</span>
                                        </div>
                                        <div className="flex-1 h-px bg-slate-200" />
                                    </div>
                                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                                        {ddoEntries.map((entry, idx) => (
                                            <AuditEntryCard key={entry.id} entry={entry} isLast={idx === ddoEntries.length - 1} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BCO Level */}
                            {bcoEntries.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 px-3 bg-emerald-600 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">BCO Level</span>
                                        </div>
                                        <div className="flex-1 h-px bg-slate-200" />
                                    </div>
                                    <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
                                        {bcoEntries.map((entry, idx) => (
                                            <AuditEntryCard key={entry.id} entry={entry} isLast={idx === bcoEntries.length - 1} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Total entries: {sortedTrail.length}</span>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuditEntryCard({ entry, isLast }: { entry: AuditTrailEntry; isLast: boolean }) {
    const config = ACTION_CONFIG[entry.action];
    const Icon = config.icon;
    const roleConfig = ROLE_LABELS[entry.performedBy.role];
    const { date, time } = formatDateTime(entry.timestamp);

    return (
        <div className={cn("relative pl-6", !isLast && "pb-4")}>
            {/* Timeline dot */}
            <div className={cn(
                "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                config.color
            )} />

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-1.5 rounded-lg", config.color.replace('bg-', 'bg-opacity-10 bg-'))}>
                            <Icon size={16} className={config.textColor} />
                        </div>
                        <div>
                            <p className={cn("font-semibold", config.textColor)}>{config.label}</p>
                            <p className="text-xs text-slate-500">{date} at {time}</p>
                        </div>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", roleConfig.color)}>
                        {roleConfig.label}
                    </span>
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                    <User size={14} />
                    <span className="font-medium">{entry.performedBy.name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{entry.performedBy.designation}</span>
                </div>

                {/* Changes */}
                {entry.changes && entry.changes.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Changes Made</p>
                        <div className="space-y-2">
                            {entry.changes.map((change, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-slate-700 min-w-[140px]">{change.fieldLabel}:</span>
                                    <span className="text-red-500 line-through">{formatValue(change.oldValue)}</span>
                                    <ArrowRight size={12} className="text-slate-400" />
                                    <span className="text-emerald-600 font-medium">{formatValue(change.newValue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Remarks */}
                {entry.remarks && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
                        <span className="font-semibold">Remarks:</span> {entry.remarks}
                    </div>
                )}
            </div>
        </div>
    );
}
