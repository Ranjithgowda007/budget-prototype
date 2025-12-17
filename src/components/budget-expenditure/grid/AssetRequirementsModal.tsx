'use client';

import React, { useState } from 'react';
import { Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypedAsset } from '@/data/budget-expenditure/types';
import { CapitalRequirementsSection } from '../shared/CapitalRequirementsSection';

interface AssetRequirementsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    assets: TypedAsset[];
    onSave: (assets: TypedAsset[]) => void;
    disabled?: boolean;
}

export function AssetRequirementsModal({
    isOpen,
    onOpenChange,
    assets,
    onSave,
    disabled = false
}: AssetRequirementsModalProps) {
    const [localAssets, setLocalAssets] = useState<TypedAsset[]>(assets);

    // Sync local state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setLocalAssets(assets);
        }
    }, [isOpen, assets]);

    const handleSave = () => {
        onSave(localAssets);
        onOpenChange(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600"
                    onClick={() => onOpenChange(false)}
                >
                    <X size={20} />
                </Button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <CapitalRequirementsSection
                        assets={localAssets}
                        onChange={setLocalAssets}
                        disabled={disabled}
                    />
                </div>

                {/* Footer with Actions */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white flex justify-end gap-3 rounded-b-2xl">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={disabled}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        Save Requirements
                    </Button>
                </div>
            </div>
        </div>
    );
}
