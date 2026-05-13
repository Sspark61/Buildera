import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Bookmark, Settings, LogIn, User, Wrench } from "lucide-react";
import builderaLogo from "@/assets/buildera-new-logo.png";
import smallLogo from "@/assets/buildera-new-logo-small.png";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar";

const mainLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { to: "/builder", label: "PC Builder", icon: Wrench },
    { to: "/saved", label: "Saved Builds", icon: Bookmark },
];

const bottomLinks = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/login", label: "Log In", icon: LogIn },
];

export function AppSidebar() {
    const location = useLocation();
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link
                    to="/"
                    className={`flex items-center gap-2.5 py-2 ${collapsed ? "justify-center px-0" : "px-2"}`}
                >
                {!collapsed && (
                    <img
                    src={builderaLogo}
                    alt="Buildera logo"
                    className={`${collapsed ? "w-7 h-7" : "w-50 h-8"} rounded-lg shrink-0 object-contain`}
                    />
                )}
                {collapsed && (
                    <img
                    src={smallLogo}
                    alt="Buildera logo"
                    className={`${collapsed ? "w-7 h-7" : "w-50 h-8"} rounded-lg shrink-0 object-contain`}
                    />
                )}
                
                
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainLinks.map((link) => (
                                <SidebarMenuItem key={link.to}>
                                    <SidebarMenuButton asChild isActive={location.pathname === link.to} tooltip={link.label}>
                                    <Link to={link.to}>
                                        <link.icon className="w-4 h-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {bottomLinks.map((link) => (
                        <SidebarMenuItem key={link.to}>
                            <SidebarMenuButton asChild tooltip={link.label}>
                                <Link to={link.to}>
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
