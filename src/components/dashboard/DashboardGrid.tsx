'use client';

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';
import { StatsCard } from './widgets/StatsCard';
import { ChartCard } from './widgets/ChartCard';
import { ActivityList } from './widgets/ActivityList';
import { MOCK_STATS } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Widget Registry
const WIDGET_REGISTRY: any = {
    'stats-total': <StatsCard {...MOCK_STATS[0]} trend={MOCK_STATS[0].trend as 'up' | 'down' | 'neutral'} />,
    'stats-expenditure': <StatsCard {...MOCK_STATS[1]} trend={MOCK_STATS[1].trend as 'up' | 'down' | 'neutral'} />,
    'stats-remaining': <StatsCard {...MOCK_STATS[2]} trend={MOCK_STATS[2].trend as 'up' | 'down' | 'neutral'} />,
    'stats-pending': <StatsCard {...MOCK_STATS[3]} trend={MOCK_STATS[3].trend as 'up' | 'down' | 'neutral'} />,
    'chart-main': <ChartCard />,
    'activity-list': <ActivityList />,
};

function SortableItem({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative group h-full", className)}>
            {/* Drag Handle - visible on hover */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={16} />
            </div>
            {children}
        </div>
    );
}

export function DashboardGrid() {
    const [items, setItems] = useState([
        'stats-total',
        'stats-expenditure',
        'stats-remaining',
        'stats-pending',
        'chart-main',
        'activity-list'
    ]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
                    {items.map((id) => {
                        const isWide = id === 'chart-main' || id === 'activity-list';
                        return (
                            <SortableItem
                                key={id}
                                id={id}
                                className={isWide ? 'col-span-1 md:col-span-2' : 'col-span-1'}
                            >
                                {WIDGET_REGISTRY[id]}
                            </SortableItem>
                        );
                    })}

                    {/* Add Widget Placeholder */}
                    <div className="col-span-1 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer min-h-[200px]">
                        <Plus size={32} strokeWidth={1.5} />
                        <span className="mt-2 font-medium">Add Widget</span>
                    </div>
                </div>
            </SortableContext>

            <DragOverlay>
                {activeId ? (
                    <div className="opacity-90">
                        {WIDGET_REGISTRY[activeId]}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
