import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Wrench, Bookmark, MoreHorizontal, User, Settings, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/marketplace", label: "Market", icon: ShoppingBag },
    { to: "/builder", label: "Builder", icon: Wrench },
    { to: "/saved", label: "Saved", icon: Bookmark },
];

const moreItems = [
    { to: "/profile", label: "Profile", icon: User, desc: "Your account info" },
    { to: "/settings", label: "Settings", icon: Settings, desc: "App preferences and theme" },
    { to: "/login", label: "Login", icon: LogIn, desc: "Sign in to your account" },
];

const MobileNav = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const moreActive = moreItems.some((m) => location.pathname === m.to);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background glass border-t border-border">
            <div className="flex items-center justify-around h-16 px-2">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.to;
                    return (
                        <Link
                            key={tab.to}
                            to={tab.to}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </Link>
                    );
                })}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                            moreActive ? "text-primary" : "text-muted-foreground"
                            }`}
                            aria-label="More"
                        >
                        <MoreHorizontal className="w-5 h-5" />
                        <span className="text-[10px] font-medium">More</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="bg-background border-border rounded-t-2xl">
                        <SheetHeader>
                            <SheetTitle className="text-foreground font-heading text-left">More</SheetTitle>
                        </SheetHeader>
                        <div className="grid grid-cols-1 gap-2 mt-4 pb-4">
                            {moreItems.map((item) => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                        isActive ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:border-primary/30"
                                        }`}
                                    >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-primary/10" : "bg-muted"}`}>
                                        <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-heading font-semibold text-foreground">{item.label}</div>
                                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                                    </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
};

export default MobileNav;
