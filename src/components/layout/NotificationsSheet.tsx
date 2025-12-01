'use client';

import React from 'react';
import {
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    XCircle,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription
} from "@/components/ui/sheet"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: NotificationType;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Budget Approved',
        message: 'The budget estimate for Dept of Finance has been approved.',
        time: '2 mins ago',
        type: 'success',
        read: false,
    },
    {
        id: '2',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.',
        time: '1 hour ago',
        type: 'warning',
        read: false,
    },
    {
        id: '3',
        title: 'New Policy Update',
        message: 'Please review the updated financial policy document.',
        time: '3 hours ago',
        type: 'info',
        read: true,
    },
    {
        id: '4',
        title: 'Submission Failed',
        message: 'Failed to submit report for Q3. Please retry.',
        time: '5 hours ago',
        type: 'error',
        read: true,
    },
    {
        id: '5',
        title: 'Budget Approved',
        message: 'The budget estimate for Dept of Health has been approved.',
        time: '1 day ago',
        type: 'success',
        read: true,
    },
];

export function NotificationsSheet({ children }: { children: React.ReactNode }) {
    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[640px] flex flex-col p-0">
                <SheetHeader className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-bold text-slate-900">Notifications</SheetTitle>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                {unreadCount} New
                            </Badge>
                        )}
                    </div>
                    <SheetDescription>
                        Stay updated with the latest alerts and activities.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="all" className="flex-1 flex flex-col">
                    <div className="px-6 pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="flex-1 flex flex-col mt-0 h-full overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col p-6 gap-4">
                                {MOCK_NOTIFICATIONS.map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread" className="flex-1 flex flex-col mt-0 h-full overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col p-6 gap-4">
                                {MOCK_NOTIFICATIONS.filter(n => !n.read).map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))}
                                {MOCK_NOTIFICATIONS.filter(n => !n.read).length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                                        <CheckCircle className="w-10 h-10 mb-2 text-slate-300" />
                                        <p>No unread notifications</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <Button variant="outline" className="w-full">
                        Mark all as read
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function NotificationItem({ notification }: { notification: Notification }) {
    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case 'success': return 'bg-green-50';
            case 'warning': return 'bg-amber-50';
            case 'error': return 'bg-red-50';
            default: return 'bg-blue-50';
        }
    };

    return (
        <div className={cn(
            "flex gap-5 p-5 rounded-xl transition-all duration-200 hover:bg-slate-50 border border-transparent hover:border-slate-100 group",
            !notification.read && "bg-blue-50/50 border-blue-100"
        )}>
            <div className={cn("p-2.5 rounded-full h-fit shrink-0 transition-transform duration-200 group-hover:scale-105", getBgColor(notification.type))}>
                {getIcon(notification.type)}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                    <h4 className={cn("text-sm font-semibold text-slate-900", !notification.read && "text-blue-900")}>
                        {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock size={10} />
                        {notification.time}
                    </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {notification.message}
                </p>
            </div>
            {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
            )}
        </div>
    );
}
