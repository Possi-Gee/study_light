
'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import { updateUserProfile, uploadAvatar } from "@/services/user-service";
import { useAuthStore } from "@/hooks/use-auth-store";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
    const { user, isUpdating } = useAuthStore();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user]);
    
    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && user) {
            try {
                const photoURL = await uploadAvatar(user.uid, file);
                await updateUserProfile(user, { photoURL });
                toast({ title: "Success", description: "Profile picture updated!" });
            } catch (error) {
                console.error("Failed to upload avatar", error);
                toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload your new picture." });
            }
        }
    };
    
    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in to save changes." });
            return;
        }

        // Disable button if no changes have been made
        if (displayName === user.displayName) {
            return;
        }
        
        try {
            await updateUserProfile(user, { displayName });
            toast({ title: "Success!", description: "Your settings have been saved." });
        } catch (error: any) {
            console.error("Failed to save settings:", error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Could not save your changes." });
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8 max-w-3xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>
                <form onSubmit={handleSaveChanges} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>This is how others will see you on the site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user?.photoURL || undefined} />
                                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                                </Avatar>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    disabled={isUpdating}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUpdating}>
                                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
                                    {isUpdating ? "Uploading..." : "Change Photo"}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isUpdating} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                                <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password here. This is a placeholder and is not functional yet.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" disabled/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" disabled/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" disabled/>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating || displayName === user?.displayName}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
