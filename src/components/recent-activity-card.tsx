
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon, Loader2 } from "lucide-react";

type RecentActivityCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    loading: boolean;
    children: React.ReactNode;
}

export function RecentActivityCard({ title, description, icon: Icon, loading, children }: RecentActivityCardProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="text-primary"/>
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                           <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
