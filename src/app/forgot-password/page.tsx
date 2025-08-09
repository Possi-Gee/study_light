
'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;

        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password.",
            });
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast({
                variant: "destructive",
                title: "Error Sending Email",
                description: error.message || "An unknown error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <GraduationCap className="w-12 h-12 text-primary"/>
            </div>
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
                Enter your email and we'll send you a link to reset your password.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleReset}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="possigee@96mail.com"
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline">
                    Sign in
                </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
