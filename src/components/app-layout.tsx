
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { type ReactNode, useState, useEffect } from "react";
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
  Bell,
  Megaphone,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getAnnouncements, Announcement } from "@/services/announcements-service";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

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

function AnnouncementCenter({ announcements, onOpenChange, open }: { announcements: Announcement[], open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Announcements</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-4rem)] pr-6">
                    <div className="space-y-6 py-6">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="flex flex-col gap-1.5 p-4 rounded-lg bg-muted/50">
                                <p className="font-semibold">{announcement.title}</p>
                                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                                <div className="text-xs text-muted-foreground/80 mt-2 flex justify-between items-center">
                                    <span>by {announcement.authorName}</span>
                                    <span>{format(announcement.createdAt.toDate(), "MMM d, yyyy 'at' p")}</span>
                                </div>
                            </div>
                        ))}
                         {announcements.length === 0 && (
                            <div className="text-center text-muted-foreground pt-12">
                                <p>No announcements yet.</p>
                            </div>
                         )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading: isAuthLoading } = useAuth();
  const { role, isLoading: isRoleLoading } = useRole();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAnnouncementCenterOpen, setIsAnnouncementCenterOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [hasUnread, setHasUnread] = useState(false);


  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: "Logged out successfully." });
        router.push('/login');
    } catch (error) {
        toast({ variant: "destructive", title: "Logout failed." });
    }
  }

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
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:justify-end gap-4">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex items-center gap-4">
            <UserNav name={userName} email={userEmail} profileUrl={profileUrl} settingsUrl={settingsUrl} onLogout={handleLogout} />
          </div>
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

    
