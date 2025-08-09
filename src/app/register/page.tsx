
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
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') {
      router.push('/');
    } else {
      router.push('/teacher/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <GraduationCap className="w-12 h-12 text-primary"/>
            </div>
            <CardTitle className="text-2xl text-center font-headline">Create an Account</CardTitle>
            <CardDescription className="text-center">
                Enter your information to create an account with StudyLight
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form className="grid gap-4" onSubmit={handleRegister}>
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input id="full-name" placeholder="John Doe" required />
                </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required/>
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
                    Create an account
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Sign in
                </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
