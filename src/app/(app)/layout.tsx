"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import {
  Recycle,
  LayoutDashboard,
  FilePlus2,
  Users,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { auth } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const allSidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin"] },
    { href: "/data-entry", label: "Data Entry", icon: FilePlus2, roles: ["Admin", "Data Collector"] },
    { href: "/admin", label: "Admin Tools", icon: Users, roles: ["Admin"] },
  ];

  const sidebarLinks = allSidebarLinks.filter(link => 
    user?.role && link.roles.includes(user.role)
  );

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading) {
     return (
      <div className="flex h-screen w-full">
        <div className="hidden md:flex flex-col w-64 border-r p-4 space-y-4 bg-sidebar">
             <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-lg bg-sidebar-accent" />
                <Skeleton className="h-6 w-32 bg-sidebar-accent" />
            </div>
            <div className="space-y-2 mt-4">
                <Skeleton className="h-10 w-full bg-sidebar-accent" />
                <Skeleton className="h-10 w-full bg-sidebar-accent" />
                <Skeleton className="h-10 w-full bg-sidebar-accent" />
            </div>
        </div>
        <div className="flex-1 flex flex-col">
            <header className="flex h-16 items-center justify-end border-b px-6">
                 <Skeleton className="h-8 w-8 rounded-full" />
            </header>
            <main className="flex-1 p-6">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
    </div>
     )
  }
  
  if (!user) {
    // AuthProvider handles redirecting, so we can just return null or a loader
    // to prevent flashing the layout.
    return null; 
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Recycle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">WasteWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  onClick={() => router.push(link.href)}
                  isActive={pathname.startsWith(link.href)}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
