import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navbar/navbar";
import MobileNav from "@/components/mobileNav/mobilenav";

const getInitialSidebarOpen = (): boolean => {
    if (typeof document === "undefined") return true;
    const match = document.cookie.match(/(?:^|;\s*)sidebar:state=([^;]+)/);
    if (!match) return true;
    return match[1] !== "false";
};

const AppLayout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider defaultOpen={getInitialSidebarOpen()}>
            <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
                <AppSidebar />
                    <div className="flex-1 flex flex-col min-h-screen">
                        <main className="flex-1 pb-20 md:pb-0">
                            {children}
                        </main>
                    </div>
                <MobileNav />
            </div>
        </SidebarProvider>
    );
};

export default AppLayout;
