'use client';

import React from 'react';
import {
    Bell,
    Search,
    Menu,
    ChevronRight,
    LayoutGrid,
    FileText,
    Shield,
    BookOpen,
    Wallet,
    Landmark,
    Briefcase,
    Users,
    ShoppingCart,
    HardDrive,
    CreditCard,
    FileCheck,
    AlertCircle,
    Award,
    User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { NotificationsSheet } from './NotificationsSheet';

const MODULES = [
    { name: 'Budget', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'BMS', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Audit', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Book Keeping', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Debt', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Deposit', icon: Landmark, color: 'text-teal-600', bg: 'bg-teal-50' },
    { name: 'E-Accounting', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'E-Receipt', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { name: 'E-Sanction', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Grievance', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { name: 'HRMIS', icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
    { name: 'Inspection', icon: Search, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'LMS & ATS', icon: Award, color: 'text-lime-600', bg: 'bg-lime-50' },
    { name: 'Pension', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
    { name: 'Purchase', icon: ShoppingCart, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { name: 'Strong Room', icon: HardDrive, color: 'text-slate-600', bg: 'bg-slate-50' },
    { name: 'Vendor', icon: Briefcase, color: 'text-sky-600', bg: 'bg-sky-50' },
];

const TranslateIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07M18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10M15.88 17L17.5 12.67L19.12 17H15.88Z" />
    </svg>
);

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getModuleById } from '@/config/modules';

// ... (keep existing imports)

export function Navbar() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-6 pl-20 flex items-center justify-between shadow-sm">
            {/* Left Section: Breadcrumbs */}
            <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-slate-500 gap-2">
                    <Link href="/dashboard" className="hover:text-blue-700 cursor-pointer transition-colors font-medium">
                        Home
                    </Link>
                    {segments.map((segment, index) => {
                        const path = `/${segments.slice(0, index + 1).join('/')}`;
                        const isLast = index === segments.length - 1;

                        // Resolve module name if it's a module ID
                        const moduleConfig = getModuleById(segment);
                        const label = moduleConfig ? moduleConfig.name : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

                        return (
                            <React.Fragment key={path}>
                                <ChevronRight size={16} />
                                {isLast ? (
                                    <span className="text-blue-700 font-bold text-base">
                                        {label}
                                    </span>
                                ) : (
                                    <Link href={path} className="hover:text-blue-700 cursor-pointer transition-colors font-medium">
                                        {label}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-full h-9"
                    />
                </div>

                {/* Module Switcher */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                        >
                            <LayoutGrid className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-4" align="end">
                        <div className="grid grid-cols-6 gap-4">
                            {MODULES.map((module) => (
                                <button
                                    key={module.name}
                                    className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200 group/item"
                                >
                                    <div className={cn(
                                        "p-2.5 rounded-xl transition-all duration-300 group-hover/item:scale-110 shadow-sm",
                                        module.bg,
                                        module.color
                                    )}>
                                        <module.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-600 text-center leading-tight group-hover/item:text-slate-900 whitespace-nowrap">
                                        {module.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Language Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-blue-600 bg-blue-50 hover:text-blue-700 hover:bg-blue-100 transition-all duration-300">
                            <TranslateIcon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem className="cursor-pointer">
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            Hindi
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <NotificationsSheet>
                    <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-blue-600">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>
                </NotificationsSheet>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-slate-200 bg-slate-100">
                                <AvatarFallback className="bg-slate-100 text-slate-600">
                                    <User size={20} />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Rajeshwar Dongre</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    Assistant Programmer
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
