'use client';

import React from 'react';
import Link from 'next/link';
import { MODULES } from '@/config/modules';
import { LottiePlayer } from '@/components/ui/LottiePlayer';
import {
    LayoutDashboard,
    Wallet,
    FileText,
    Shield,
    BookOpen,
    CreditCard,
    Landmark,
    FileCheck,
    AlertCircle,
    Users,
    Search,
    Award,
    UserCheck,
    ShoppingCart,
    HardDrive,
    Briefcase
} from 'lucide-react';

const IconMap: any = {
    LayoutDashboard,
    Wallet,
    FileText,
    Shield,
    BookOpen,
    CreditCard,
    Landmark,
    FileCheck,
    AlertCircle,
    Users,
    Search,
    Award,
    UserCheck,
    ShoppingCart,
    HardDrive,
    Briefcase
};

export function ModuleListWidget() {
    const modules = MODULES.filter(m => m.id !== 'dashboard');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module) => {
                const IconComponent = module.icon ? IconMap[module.icon] : LayoutDashboard;
                return (
                    <Link
                        key={module.id}
                        href={module.path}
                        className="group relative flex flex-col p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors relative overflow-hidden">
                                <IconComponent size={24} className={module.animationUrl ? "opacity-0" : ""} />
                                {module.animationUrl && (
                                    <div className="absolute inset-0">
                                        <LottiePlayer animationUrl={module.animationUrl} className="w-full h-full" />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                {module.name}
                            </h3>
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 relative z-10">
                            {module.description || `Access the ${module.name} module`}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                            Open Module &rarr;
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
