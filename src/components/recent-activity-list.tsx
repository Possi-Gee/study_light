
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';

type ActivityItem = {
    id: string;
    title: string;
    subtitle: string;
    timestamp: Date;
    link: string;
};

type RecentActivityListProps = {
    items: ActivityItem[];
    emptyStateText?: string;
};

export function RecentActivityList({ items, emptyStateText = "No recent activity." }: RecentActivityListProps) {
    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                <p>{emptyStateText}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <Link href={item.link} key={item.id} className="block hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{getInitials(item.title)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
