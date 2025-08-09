
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState('student');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') {
      router.push('/');
    } else {
      router.push('/teacher/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex justify-center mb-4">
              <BrainCircuit className="w-12 h-12 text-primary"/>
          </div>
          <CardTitle className="text-2xl text-center font-headline">Login to SmartStudy Lite</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
                <Label>Role</Label>
                <RadioGroup defaultValue="student" onValueChange={setRole} className="flex gap-4">
                    <Label htmlFor="student" className="flex items-center space-x-2 p-3 border rounded-md has-[input:checked]:bg-muted has-[input:checked]:border-primary transition-colors cursor-pointer flex-1 justify-center">
                        <RadioGroupItem value="student" id="student" />
                        <span>Student</span>
                    </Label>
                    <Label htmlFor="teacher" className="flex items-center space-x-2 p-3 border rounded-md has-[input:checked]:bg-muted has-[input:checked]:border-primary transition-colors cursor-pointer flex-1 justify-center">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <span>Teacher</span>
                    </Label>
                </RadioGroup>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
