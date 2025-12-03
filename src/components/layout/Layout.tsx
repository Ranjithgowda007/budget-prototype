import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SidebarItem } from '@/data/navigation';

export function Layout({ children, sidebarItems = [] }: { children: React.ReactNode, sidebarItems?: SidebarItem[] }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <Sidebar items={sidebarItems} />
            <main className="pl-16 pt-16 min-h-screen transition-all duration-300">
                <div className="px-8 pb-8 pt-4 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
