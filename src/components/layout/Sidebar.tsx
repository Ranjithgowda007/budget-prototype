'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    ChevronRight,
    ChevronDown,
    Landmark,
    LogOut,
    Circle,
    Search,
    LayoutDashboard,
    FileText,
    Settings,
    Wallet,
    Shield,
    BookOpen,
    PieChart,
    Users,
    Bell,
    FileBarChart,
    Briefcase,
    CreditCard,
    FileCheck,
    AlertCircle,
    Award,
    UserCheck,
    ShoppingCart,
    HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { SidebarItem } from '@/data/navigation';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function Sidebar({ items = [] }: { items?: SidebarItem[] }) {
    const [isHovered, setIsHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter navigation items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;

        const lowerQuery = searchQuery.toLowerCase();

        const filterItem = (item: SidebarItem): SidebarItem | null => {
            // Check if current item matches
            const matchesSelf = item.label.toLowerCase().includes(lowerQuery);

            // Check sub-items
            let matchedSubItems: SidebarItem[] = [];
            if (item.subItems) {
                matchedSubItems = item.subItems
                    .map(filterItem)
                    .filter((sub): sub is SidebarItem => sub !== null);
            }

            // If self matches, return self with all sub-items (or filtered ones if you prefer strict)
            // Here: if self matches, show all. If children match, show self with matched children.
            if (matchesSelf) return item;

            if (matchedSubItems.length > 0) {
                return { ...item, subItems: matchedSubItems };
            }

            return null;
        };

        return items.map(filterItem).filter((item): item is SidebarItem => item !== null);
    }, [searchQuery, items]);

    // Auto-expand sidebar when searching
    const isExpanded = isHovered || searchQuery.length > 0;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full z-50 flex flex-col bg-white border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out",
                isExpanded ? "w-80" : "w-16"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                // Optional: clear search on leave? No, user might want to keep it.
                // But we need to handle the width. If search is active, we keep it expanded?
                // Or just let it collapse and hide search input content.
                // Let's stick to the hover logic for width to avoid layout shifts when not interacting.
                // Actually, if I type, I am hovering. So it stays expanded.
            }}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-slate-100 min-h-[4rem]">
                <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 w-full">
                    <div className="bg-blue-800 text-white p-1.5 rounded-lg shrink-0">
                        <Landmark size={24} />
                    </div>
                    <span className={cn(
                        "font-bold text-lg text-slate-800 transition-opacity duration-200",
                        isExpanded ? "opacity-100" : "opacity-0"
                    )}>
                        IFMIS MP
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <div className={cn(
                "px-3 py-2 transition-all duration-300 overflow-hidden",
                isExpanded ? "opacity-100 max-h-16" : "opacity-0 max-h-0 py-0"
            )}>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search menus..."
                        className="pl-8 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation Items */}
            <ScrollArea className="flex-1 py-4">
                <ul className="space-y-1 pl-4 pr-6">
                    {filteredItems.map((item, index) => (
                        <SidebarMenuItem
                            key={item.id}
                            item={item}
                            isSidebarExpanded={isExpanded}
                            forceExpand={searchQuery.length > 0}
                            isLast={index === filteredItems.length - 1}
                        />
                    ))}
                    {filteredItems.length === 0 && searchQuery && (
                        <div className="text-center text-slate-400 text-sm py-4">
                            No menus found
                        </div>
                    )}
                </ul>
            </ScrollArea>

            {/* User / Footer */}
            <div className="p-2 border-t border-slate-100">
                <Button
                    variant="ghost"
                    className="flex items-center w-full justify-start p-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-700 transition-colors h-auto"
                >
                    <LogOut size={20} className="shrink-0" />
                    <span className={cn(
                        "ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                        isExpanded ? "opacity-100" : "opacity-0"
                    )}>
                        Logout
                    </span>
                </Button>
            </div>
        </aside>
    );
}

function SidebarMenuItem({
    item,
    isSidebarExpanded,
    level = 0,
    forceExpand = false,
    isLast = false
}: {
    item: SidebarItem,
    isSidebarExpanded: boolean,
    level?: number,
    forceExpand?: boolean,
    isLast?: boolean
}) {
    const [isOpen, setIsOpen] = useState(forceExpand);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    // Visual Logic
    const showIcon = level === 0;

    // Update isOpen when forceExpand changes
    React.useEffect(() => {
        if (forceExpand) setIsOpen(true);
    }, [forceExpand]);

    // Icon Map
    const IconMap: any = {
        LayoutDashboard,
        FileText,
        Settings,
        Wallet,
        Shield,
        BookOpen,
        PieChart,
        Users,
        Bell,
        FileBarChart,
        Landmark,
        Briefcase,
        CreditCard,
        FileCheck,
        AlertCircle,
        Award,
        UserCheck,
        ShoppingCart,
        HardDrive
    };

    const ItemContent = () => {
        const IconComponent = item.icon ? IconMap[item.icon] : null;
        return (
            <>
                {showIcon && IconComponent && <IconComponent size={20} className="shrink-0 text-slate-500 group-hover:text-blue-600 transition-colors" />}

                <span className={cn(
                    "font-medium text-left leading-snug transition-all duration-300 flex-1 break-words",
                    showIcon ? "ml-3 text-sm" : "text-sm",
                    level > 0 ? "text-slate-600 font-normal group-hover:text-slate-900" : "text-slate-700 group-hover:text-blue-700",
                    isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
                )}>
                    {item.label}
                </span>
            </>
        );
    };

    // Tree Connectors for Level > 0
    const TreeConnectors = () => {
        if (level === 0) return null;
        return (
            <div className="absolute left-[-1.5rem] top-0 bottom-0 w-6 pointer-events-none flex items-center">
                {/* Vertical Line */}
                <div className={cn(
                    "absolute left-[0.75rem] w-px bg-slate-300", // Aligned with parent's icon center (approx 20px from left)
                    isLast ? "top-0 h-[22px]" : "top-0 bottom-0"
                )} />
                {/* Horizontal Line */}
                <div className="absolute left-[0.75rem] top-[22px] w-4 h-px bg-slate-300" />
            </div>
        );
    };

    if (!hasSubItems) {
        return (
            <li className={cn("relative", level > 0 && "ml-8")}>
                <TreeConnectors />

                <Button
                    asChild
                    variant="ghost"
                    className={cn(
                        "flex items-center w-full justify-start rounded-lg transition-all duration-200 group h-auto pr-4",
                        level > 0 ? "py-2 pl-2 pr-8 min-h-[36px] hover:bg-slate-100" : "py-2.5 pl-2.5 pr-8 min-h-[44px] hover:bg-blue-50",
                    )}
                >
                    <Link href={item.path || '#'}>
                        <ItemContent />
                    </Link>
                </Button>
            </li>
        );
    }

    return (
        <li className={cn("relative", level > 0 && "ml-8")}>
            <TreeConnectors />

            <Collapsible open={isOpen && isSidebarExpanded} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "flex items-center w-full justify-start rounded-lg transition-all duration-200 group h-auto pr-4",
                            level > 0 ? "py-2 pl-2 pr-8 min-h-[36px] hover:bg-slate-100" : "py-2.5 pl-2.5 pr-8 min-h-[44px] hover:bg-blue-50",
                            "data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700",
                        )}
                    >
                        <ItemContent />
                        {isSidebarExpanded && (
                            <ChevronRight size={14} className={cn("ml-2 shrink-0 text-slate-400 transition-transform duration-200", isOpen && "rotate-90 text-blue-600")} />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="relative">
                    {/* Continuous Vertical Line for Children */}
                    {/* We draw a line from the parent's bottom to the end of children? 
                        No, the children draw their own vertical lines.
                        But if this item is NOT the last one, we need a vertical line passing THROUGH it?
                        No, the vertical line is drawn by the children's container?
                        
                        If Level 0 is open, we need a line from Level 0 Icon down to the last child.
                        Level 0 Icon is at ~20px.
                        Children are indented 32px (ml-8).
                        Children's vertical line is at left-[1.15rem] of the child container.
                        Child container is at 32px.
                        1.15rem = ~18px.
                        32px - 18px = 14px.
                        This doesn't align with 20px.
                        
                        Let's adjust.
                        Level 0 Icon center: 10px (padding) + 10px (half icon) = 20px.
                        Level 1 Indent: ml-6 (24px).
                        Level 1 Vertical Line: needs to be at 20px relative to Level 0.
                        So relative to Level 1 (which is at 24px), it should be at -4px.
                        
                        Let's try ml-6 (24px) for indentation.
                        And left-[-0.25rem] (-4px) for the line.
                    */}

                    <ul className="space-y-1 pt-1 pb-2 relative">
                        {item.subItems?.map((subItem, index) => (
                            <SidebarMenuItem
                                key={subItem.id}
                                item={subItem}
                                isSidebarExpanded={isSidebarExpanded}
                                level={level + 1}
                                forceExpand={forceExpand}
                                isLast={index === (item.subItems?.length ?? 0) - 1}
                            />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    );
}
