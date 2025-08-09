
'use client';

import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "https://placehold.co/100x100.png");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
                // In a real app, you'd upload to storage and update the user profile URL
                toast({ title: "Profile picture updated locally." });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in to save changes." });
            return;
        }

        setIsSaving(true);
        
        try {
            // Update display name
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }

            // Password change logic would go here.
            // It often requires re-authentication for security and is more complex.
            // For this prototype, we'll focus on the name and picture.
            
            toast({ title: "Success!", description: "Your settings have been saved." });

        } catch (error: any) {
            console.error("Failed to save settings:", error);
            toast({ variant: "destructive", title: "Error", description: error.message || "Could not save your changes." });
        } finally {
            setIsSaving(false);
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
                                    <AvatarImage src={avatarUrl} data-ai-hint="person portrait" />
                                    <AvatarFallback>{displayName?.charAt(0) || 'S'}</AvatarFallback>
                                </Avatar>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Change Photo
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
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
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
