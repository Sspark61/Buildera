import { useNavigate } from "react-router-dom";
import { Home, Monitor, ArrowLeft } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-lg w-full">
                <div className="relative mb-2">
                    <span className="text-[10rem] font-black leading-none text-foreground/5 select-none block text-center">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background border border-border rounded-xl px-4 py-2 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-primary" />
                            <span className="text-sm font-mono text-muted-foreground">
                                no_display_output
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-foreground mb-3">
                        No signal. Is your monitor plugged in?
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        We're getting power but nothing's showing up.
                        <br />
                        This page isn't sending any output.
                    </p>
                </div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-4 rounded-sm bg-muted border border-border"
                                style={{ opacity: 1 - i * 0.2 }}
                            />
                        ))}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;