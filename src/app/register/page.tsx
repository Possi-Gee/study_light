
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
import { GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { addUser } from "@/services/user-service";

export default function RegisterPage() {
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('full-name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "Passwords do not match.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // We run these in parallel to make it faster
      await Promise.all([
          updateProfile(user, { displayName: fullName }),
          addUser({ 
              uid: user.uid, 
              name: fullName, 
              email: user.email!, // email is guaranteed to exist for email/password auth
              role: role,
              photoURL: user.photoURL 
          })
      ]);

      toast({
        title: "Account Created!",
        description: "You have been successfully registered.",
      });

      if (role === 'student') {
        router.push('/');
      } else {
        router.push('/teacher/dashboard');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
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
                    <Input id="full-name" name="full-name" placeholder="Possi Gee" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="possigee@96mail.com"
                    required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" required placeholder="••••••••" />
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
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
