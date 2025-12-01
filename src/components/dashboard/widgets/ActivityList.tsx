import React from 'react';
import { MOCK_ACTIVITIES } from '@/data/mockData';
import { FileText, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ActivityList() {
    const getIcon = (type: string) => {
        switch (type) {
            case 'announcement': return <FileText className="w-5 h-5 text-blue-600" />;
            case 'transaction': return <CreditCard className="w-5 h-5 text-green-600" />;
            case 'approval': return <CheckCircle className="w-5 h-5 text-purple-600" />;
            default: return <FileText className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <Card className="shadow-sm border-slate-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-slate-900">Recent Activity</CardTitle>
                <Button variant="link" className="text-blue-600 h-auto p-0">View All</Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {MOCK_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                        <div className="mt-1 p-2 bg-slate-50 rounded-lg h-fit border border-slate-100">
                            {getIcon(activity.type)}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">{activity.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
