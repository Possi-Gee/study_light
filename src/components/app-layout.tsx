
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookOpen,
  Home,
  LogOut,
  Puzzle,
  Settings,
  User,
  CalendarCheck,
  GraduationCap,
  Users,
  BookMarked,
  HelpCircle,
  Loader2,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { useRole } from "@/hooks/use-role";

const studentNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/schedule", label: "AI Schedule", icon: CalendarCheck },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: Puzzle },
];

const teacherNavItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "/teacher/notes", label: "Manage Notes", icon: BookMarked },
    { href: "/teacher/quizzes", label: "Manage Quizzes", icon: HelpCircle },
    { href: "/teacher/students", label: "Students", icon: Users },
]

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading: isAuthLoading } = useAuth();
  const { role, isLoading: isRoleLoading } = useRole();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged out successfully." });
        router.push('/login');
    } catch (error) {
        toast({ variant: "destructive", title: "Logout failed." });
    }
  }

  // Combined loading check:
  // If auth is loading, we must wait.
  // If auth is done but we have a user, we must also wait for the role to be loaded.
  if (isAuthLoading || (user && isRoleLoading)) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const isTeacher = role === 'teacher';
  const navItems = isTeacher ? teacherNavItems : studentNavItems;
  
  const userRoleDisplay = isTeacher ? 'Teacher' : 'Student';
  const userName = user?.displayName || userRoleDisplay;
  const userEmail = user?.email || '';

  const profileUrl = isTeacher ? '/teacher/profile' : '/profile';
  const settingsUrl = isTeacher ? '/teacher/settings' : '/settings';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <GraduationCap className="text-primary w-8 h-8"/>
                <h1 className="text-2xl font-bold text-primary font-headline">StudyLight</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <Link href={profileUrl} passHref>
            <SidebarMenuButton isActive={pathname === profileUrl} tooltip="Profile">
              <User />
              <span>Profile</span>
            </SidebarMenuButton>
          </Link>
          <Link href={settingsUrl} passHref>
            <SidebarMenuButton isActive={pathname === settingsUrl} tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>
           <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:justify-end">
          <SidebarTrigger className="sm:hidden" />
          <UserNav name={userName} email={userEmail} profileUrl={profileUrl} settingsUrl={settingsUrl} onLogout={handleLogout} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserNav({name, email, profileUrl, settingsUrl, onLogout}: {name: string, email: string, profileUrl: string, settingsUrl: string, onLogout: () => void}) {
  const { user } = useAuth();
  const { role } = useRole();
  const isTeacher = role === 'teacher';
  const actualProfileUrl = isTeacher ? '/teacher/profile' : '/profile';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.photoURL || undefined} alt="@user" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={actualProfileUrl}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={settingsUrl}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
