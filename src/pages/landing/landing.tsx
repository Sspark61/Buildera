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
    Users,
    Star,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroPc from "@/assets/images/hero-pc.jpg";
import pcBuild1 from "@/assets/images/pc-build-1.jpg";
import pcBuild2 from "@/assets/images/pc-build-2.jpg";
import pcBuild3 from "@/assets/images/pc-build-3.jpg";
import pcBuild4 from "@/assets/images/pc-build-4.jpg";

const featuredBuilds = [
    { name: "Neon Vanguard X-1", price: "$2,499", category: "Gaming", img: pcBuild1 },
    { name: "Alpine Mini Pro", price: "$1,299", category: "Compact", img: pcBuild2 },
    { name: "Strix GeForce 4090", price: "$3,199", category: "Extreme", img: pcBuild3 },
    { name: "Neon Strike", price: "$1,899", category: "Streaming", img: pcBuild4 },
];

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

const stats = [
    { value: "10k+", label: "Components indexed" },
    { value: "120+", label: "Verified retailers" },
    { value: "98%", label: "Compatibility accuracy" },
    { value: "4.8★", label: "Builder satisfaction" },
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
            {/* Hero */}
            <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-border"
            >
                <div className="absolute inset-0">
                    <img src={heroPc} alt="Custom gaming PC build" className="w-full h-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
                </div>
                <div className="relative z-10 p-8 lg:p-14 max-w-2xl">
                    <Badge className="bg-primary/15 text-primary border-primary/20 mb-4 hover:bg-primary/15">
                        <Zap className="w-3 h-3 mr-1" /> AI-Powered PC Builder
                    </Badge>
                    <h1 className="text-3xl lg:text-5xl font-heading font-bold text-foreground leading-tight mb-4">
                        Build your <span className="text-primary">perfect PC</span>,
                        <br />
                        without the guesswork.
                    </h1>
                    <p className="text-muted-foreground text-base lg:text-lg mb-7 max-w-lg">
                        Buildera is a calm, focused workspace for designing custom desktops. Plan your build, check
                        compatibility automatically, and compare prices from trusted retailers — all in one place.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/builder">
                            <Button size="lg" className="font-semibold gap-2 cursor-pointer">
                                <Sparkles className="w-4 h-4" />
                                Start a new build
                            </Button>
                        </Link>
                        <Link to="/marketplace">
                            <Button size="lg" variant="outline" className="gap-2 cursor-pointer">
                                Browse parts
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* Stats strip */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((s, i) => (
                    <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="rounded-xl border border-border bg-card px-5 py-4"
                    >
                        <p className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">{s.value}</p>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-1">{s.label}</p>
                    </motion.div>
                ))}
            </section>

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

            {/* Featured Builds */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-heading font-semibold text-foreground">
                            Featured build configurations
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Hand-picked starting points you can clone and customize.
                        </p>
                    </div>
                    <Link to="/marketplace" className="text-sm text-primary hover:underline shrink-0">
                        View all
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredBuilds.map((build, i) => (
                        <motion.div
                            key={build.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                        >
                            <Link to={`/build/${encodeURIComponent(build.name)}`}>
                                <Card className="overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors relative">
                                    <div className="aspect-square overflow-hidden bg-muted -m-4">
                                        <img
                                            src={build.img}
                                            alt={build.name}
                                            loading="lazy"
                                            width={512}
                                            height={512}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <Badge variant="secondary" className="text-[10px] mb-1.5">
                                            {build.category}
                                        </Badge>
                                        <h3 className="text-sm font-heading font-semibold text-foreground truncate">
                                            {build.name}
                                        </h3>
                                        <div className="mt-2">
                                            <span className="text-base font-heading font-bold text-foreground">{build.price}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
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
                    <Link to="/saved-builds">
                        <Button size="lg" variant="outline" className="cursor-pointer">View saved builds</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default landing;
