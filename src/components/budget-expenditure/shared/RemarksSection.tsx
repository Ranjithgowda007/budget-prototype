'use client';

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Remark {
    id: string;
    author: string;
    role: string;
    content: string;
    timestamp: string;
}

interface RemarksSectionProps {
    remarks: Remark[];
    canAddRemark?: boolean;
    onAddRemark?: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function RemarksSection({
    remarks,
    canAddRemark = false,
    onAddRemark,
    placeholder = "Enter your remarks...",
    className
}: RemarksSectionProps) {
    const [newRemark, setNewRemark] = useState('');

    const handleSubmit = () => {
        if (newRemark.trim() && onAddRemark) {
            onAddRemark(newRemark);
            setNewRemark('');
        }
    };

    return (
        <div className={cn("bg-white rounded-xl p-6 border border-slate-200", className)}>
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={20} className="text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Remarks & Comments</h3>
            </div>

            <div className="space-y-4">
                {remarks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No remarks yet</p>
                    </div>
                ) : (
                    remarks.map(remark => (
                        <div key={remark.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-slate-900">{remark.author}</p>
                                    <p className="text-xs text-slate-500">{remark.role}</p>
                                </div>
                                <p className="text-xs text-slate-400">{remark.timestamp}</p>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{remark.content}</p>
                        </div>
                    ))
                )}
            </div>

            {canAddRemark && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <Textarea
                        value={newRemark}
                        onChange={(e) => setNewRemark(e.target.value)}
                        placeholder={placeholder}
                        className="min-h-[100px] mb-3"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={!newRemark.trim()}
                            className="gap-2"
                        >
                            <Send size={16} />
                            Add Remark
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
