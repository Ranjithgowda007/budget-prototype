'use client';

import React, { useState } from 'react';
import { AlertTriangle, Paperclip, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CeilingExceedSectionProps {
    exceedsCeiling: boolean;
    justification?: string;
    attachment?: string;
    onJustificationChange: (value: string) => void;
    onAttachmentChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

export function CeilingExceedSection({
    exceedsCeiling,
    justification,
    attachment,
    onJustificationChange,
    onAttachmentChange,
    disabled = false,
    className
}: CeilingExceedSectionProps) {
    const [fileName, setFileName] = useState(attachment || '');

    if (!exceedsCeiling) {
        return null;
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onAttachmentChange(file.name);
        }
    };

    return (
        <div className={cn("bg-red-50 border-l-4 border-red-500 rounded-lg p-6", className)}>
            <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="text-red-600 mt-1" size={24} />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900">Ceiling Limit Exceeded</h3>
                    <p className="text-sm text-red-700 mt-1">
                        You must provide justification and supporting documents as this estimation exceeds the approved ceiling limit.
                    </p>
                </div>
            </div>

            <div className="space-y-4 bg-white rounded-lg p-4">
                {/* Justification */}
                <div>
                    <Label htmlFor="justification" className="flex items-center gap-2">
                        <span>Justification for Exceeding Ceiling</span>
                        <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="justification"
                        value={justification || ''}
                        onChange={(e) => onJustificationChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Provide detailed justification for exceeding the ceiling limit..."
                        className="mt-2 min-h-[100px]"
                        required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Explain why the additional budget is necessary and how it aligns with departmental priorities
                    </p>
                </div>

                {/* Supporting Documents */}
                <div>
                    <Label htmlFor="attachment" className="flex items-center gap-2">
                        <span>Supporting Documents</span>
                        <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                        {fileName ? (
                            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <Paperclip size={16} className="text-slate-600" />
                                <span className="text-sm font-medium text-slate-700 flex-1">{fileName}</span>
                                <Button
                                    onClick={() => {
                                        setFileName('');
                                        onAttachmentChange('');
                                    }}
                                    disabled={disabled}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="attachment"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    disabled={disabled}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                />
                                <label htmlFor="attachment">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="gap-2 cursor-pointer"
                                        disabled={disabled}
                                        onClick={() => document.getElementById('attachment')?.click()}
                                    >
                                        <Paperclip size={16} />
                                        Upload Document
                                    </Button>
                                </label>
                                <span className="text-xs text-slate-500">
                                    PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Upload official documents supporting your request (approval letters, project proposals, etc.)
                    </p>
                </div>
            </div>
        </div>
    );
}
