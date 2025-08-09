
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const studentNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/schedule", label: "AI Schedule", icon: CalendarCheck },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: Puzzle },
];

const teacherNavItems = [
    { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "#", label: "Manage Notes", icon: BookMarked },
    { href: "#", label: "Manage Quizzes", icon: HelpCircle },
    { href: "#", label: "Students", icon: Users },
]

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith('/teacher');

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  const userRole = isTeacher ? 'Teacher' : 'Student';
  const userEmail = isTeacher ? 'teacher@example.com' : 'student@example.com';
  const profileUrl = isTeacher ? '#' : '/profile';


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
              <SidebarMenuItem key={item.href}>
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
           <Link href="/login" passHref>
            <SidebarMenuButton tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:justify-end">
          <SidebarTrigger className="sm:hidden" />
          <UserNav name={userRole} email={userEmail} profileUrl={profileUrl} />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserNav({name, email, profileUrl}: {name: string, email: string, profileUrl: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="person portrait" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
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
          <Link href={profileUrl}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
