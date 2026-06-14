import { motion } from "framer-motion";
import {
    Sparkles,
    ArrowRight,
    Cpu,
    Shield,
    Zap,
    Search,
    Wrench,
    PackageCheck,
    CircuitBoard,
    Gauge,
    Star,
    CheckCircle2,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
const features = [
    {
        icon: Sparkles,
        title: "AI-assisted picks",
        desc: "Describe your goals and budget — our recommender suggests components that match how you actually use your PC, from competitive gaming to 3D rendering.",
    },
    {
        icon: Cpu,
        title: "Compatibility checks",
        desc: "Sockets, RAM generation, PSU wattage, GPU clearance and cooler height are all verified automatically before you commit to a part.",
    },
    {
        icon: Gauge,
        title: "Bottleneck insights",
        desc: "See where your build is balanced and where one component holds the rest back, so every dollar you spend translates into real performance.",
    },
    {
        icon: Shield,
        title: "Trusted retailers",
        desc: "We don’t sell parts — we link you to vetted stores so you can compare prices and buy from sources you already trust.",
    },
];


const steps = [
    {
        icon: Search,
        title: "Tell us your goals",
        desc: "Pick a use case and budget, or start from a template like 1440p gaming or content creation.",
    },
    {
        icon: Wrench,
        title: "Build with guardrails",
        desc: "Add components in any order — we keep parts compatible and flag issues before they become problems.",
    },
    {
        icon: PackageCheck,
        title: "Buy from trusted stores",
        desc: "Compare live prices across retailers and check out wherever you get the best deal.",
    },
];

const landing = () => {
    return (
        <div className="p-4 lg:p-8 space-y-12 overflow-hidden">
            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-gradient-to-r
        from-background
        via-background
        to-primary/5
    "
            >
                {/* Glow */}
                <div className="absolute right-0 top-0 h-full w-[55%] bg-primary/10 blur-[180px]" />

                <div className="relative z-10 grid lg:grid-cols-[1fr_0.9fr] items-center min-h-[580px]">

                    {/* LEFT */}
                    <div className="px-8 py-12 lg:px-14 lg:py-14">

                        <Badge className="mb-5 bg-primary/10 border-primary/20 text-primary">
                            <Zap className="w-3 h-3 mr-1" />
                            AI-Powered PC Builder
                        </Badge>

                        <h1 className="text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                            Build your
                            <br />
                            <span className="text-primary">perfect PC</span>,
                            <br />
                            without the
                            <br />
                            guesswork.
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-md mb-6">
                            Buildera helps you design custom desktops,
                            check compatibility automatically,
                            and compare prices from trusted retailers.
                        </p>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <Link to="/builder">
                                <Button size="lg" className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Start a new build
                                </Button>
                            </Link>

                            <Link to="/marketplace">
                                <Button size="lg" variant="outline" className="gap-2">
                                    Browse parts
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="hidden lg:flex items-center justify-center relative">

                        <motion.img
                            src="/src/assets/images/pc-hero2.png"
                            alt="Buildera PC"
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="w-[760px] relative z-10 drop-shadow-[0_0_80px_rgba(59,130,246,.5)]"
                        />

                        <div className="absolute bottom-28 w-[400px] h-[80px] rounded-full bg-primary/30 blur-3xl" />
                    </div>

                </div>

            </motion.section>


            {/* Why Buildera — extended features section */}
            <section>
                <div className="max-w-2xl mb-8">
                    <Badge variant="secondary" className="mb-3">Why Buildera</Badge>
                    <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-3">
                        A quieter, smarter way to plan your next PC.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Buying a PC online usually means juggling spreadsheets, forum threads and a dozen browser tabs.
                        Buildera brings the whole process into one focused tool — clear recommendations, honest
                        compatibility warnings, and direct links to retailers you already know. No carts, no upsells,
                        no neon marketing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                        >
                            <Card className="h-full p-6 hover:border-primary/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <f.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-base font-heading font-semibold text-foreground">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section>
                <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
                    <div className="max-w-xl">
                        <Badge variant="secondary" className="mb-3">How it works</Badge>
                        <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                            From idea to ordered, in three steps.
                        </h2>
                    </div>
                    <Link to="/builder" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        Open the builder <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                        >
                            <Card className="h-full p-6 relative">
                                <span className="absolute top-4 right-5 text-xs font-mono text-muted-foreground">
                                    0{i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                                    <step.icon className="w-5 h-5 text-foreground" />
                                </div>
                                <h3 className="text-base font-heading font-semibold text-foreground mb-1.5">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Built for everyone strip */}
            <section className="rounded-2xl border border-border bg-card p-6 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <Badge variant="secondary" className="mb-3">Who it's for</Badge>
                        <h2 className="text-2xl font-heading font-semibold text-foreground mb-3">
                            Built for first-timers and seasoned builders alike.
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Whether you’re assembling your very first rig or planning a tenth workstation, Buildera
                            adapts to your level — guided defaults when you want them, full control when you don’t.
                        </p>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { icon: Users, title: "First-time builders", desc: "Plain-language explanations next to every spec." },
                            { icon: CircuitBoard, title: "Enthusiasts", desc: "Fine-grained control over every socket and lane." },
                            { icon: Star, title: "Content creators", desc: "Templates tuned for editing, streaming and 3D." },
                            { icon: CheckCircle2, title: "Studios & labs", desc: "Save, share and reuse standardized builds." },
                        ].map((p) => (
                            <div key={p.title} className="flex items-start gap-3 rounded-lg bg-background/40 border border-border p-4">
                                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                    <p.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-8 lg:p-12 text-center">
                <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-3">
                    Ready to design your next build?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                    Start from a blank canvas or a template. You can save your work and come back to it any time.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link to="/builder">
                        <Button size="lg" className="gap-2 cursor-pointer">
                            <Sparkles className="w-4 h-4" /> Start building
                        </Button>
                    </Link>
                    <Link to="/profile">
                        <Button size="lg" variant="outline" className="cursor-pointer">View saved builds</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default landing;
