/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query'
import { motion } from "framer-motion";
import {
    Monitor, Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Fan, Box,
    Plus, Save, FileDown, Sparkles, Trash2, Search, Check, Receipt,
    Lightbulb, AlertTriangle, CheckCircle2, Wand2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { componentCategories } from "@/assets/data/pcComponents";
import type { ComponentCategory } from "@/assets/data/pcComponents";
import { useGetComponents } from "@/hooks/use-components";
import {
    useGetBuild,
    useCreateBuild,
    useDeleteBuild,
} from "@/hooks/use-builds";
import { api } from "@/api/api";

// ---- Types ----
interface ApiComponent {
    id: number
    name: string
    type: string
    brand: string
    price: number | null
    imageUrl: string
    buildComponentId?: number  // 👈 added
}

interface CompatibilityError {
    severity: string
    rule: string
    components: string[]
    message: string
    fix?: string
}

// ---- Category to API type map ----
const categoryTypeMap: Record<string, string> = {
    cpu: 'CPU',
    gpu: 'Video Card',
    motherboard: 'Motherboard',
    ram: 'Memory',
    storage: 'Storage',
    psu: 'Power Supply',
    cooling: 'CPU Cooler',
    case: 'Case',
}

const iconMap: Record<string, React.ElementType> = {
    gpu: Monitor, cpu: Cpu, motherboard: CircuitBoard, ram: MemoryStick,
    storage: HardDrive, psu: Zap, cooling: Fan, case: Box,
}

// ---- ComponentBrowser ----
const ComponentBrowser = ({
    open, onOpenChange, category, selectedId, onSelect,
}: {
    open: boolean
    onOpenChange: (o: boolean) => void
    category: ComponentCategory
    selectedId?: number
    onSelect: (c: ApiComponent) => void
}) => {
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [page, setPage] = useState(1)

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => { setPage(1) }, [debouncedSearch])

    const { data, isLoading } = useGetComponents({
        type: categoryTypeMap[category.key],
        search: debouncedSearch || undefined,
        page,
        limit: 10,
        minPrice: 1,
    })

    const components = data?.data.components ?? []
    const totalPages = data?.data.pages ?? 1

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-lg bg-background border-border overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-foreground font-heading">
                        Select {category.label}
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                    <div className="relative w-[92%] mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${category.label.toLowerCase()}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-muted/30 border-border "
                        />
                    </div>
                    <div className="space-y-2 mt-2">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                        ) : components.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No components found.</p>
                        ) : components.map((c) => {
                            const isSelected = selectedId === c.id
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => { onSelect(c); onOpenChange(false) }}
                                    className={`text-left p-3 rounded-lg border transition-all flex items-center gap-3 w-[92%] mx-auto ${isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                                        }`}
                                >
                                    <img
                                        src={c.imageUrl}
                                        alt={c.name}
                                        loading="lazy"
                                        className="w-14 h-14 rounded-md object-cover bg-muted shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-heading font-semibold text-foreground truncate">
                                                {c.name}
                                            </h4>
                                            {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                                        </div>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-border text-muted-foreground">
                                            {c.brand}
                                        </Badge>
                                    </div>
                                    <span className="text-sm font-heading font-bold gradient-text shrink-0">
                                        {c.price ? `$${c.price}` : 'N/A'}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-2">
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                Previous
                            </Button>
                            <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

// ---- BuildSummary ----
const BuildSummary = ({
    selections, onSave, isSaving, isSaved,
}: {
    selections: Record<string, ApiComponent>
    onSave: () => void
    isSaving: boolean
    isSaved: boolean
}) => {
    const items = Object.entries(selections)
    const total = items.reduce((s, [, c]) => s + (c.price ?? 0), 0)
    const completion = Math.round((items.length / componentCategories.length) * 100)

    return (
        <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-heading font-semibold text-foreground">Build Summary</h3>
            </div>
            <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Completion</span><span>{completion}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
                    <div
                        className="h-full transition-all duration-500 bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${completion}%`, minWidth: completion > 0 ? '4px' : '0px' }}
                    />
                </div>
            </div>
            <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No components selected yet.</p>
                ) : items.map(([key, c]) => (
                    <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground truncate pr-2">{c.name}</span>
                        <span className="text-foreground font-medium shrink-0">
                            {c.price ? `$${c.price}` : 'N/A'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-border mb-3">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-lg font-heading font-bold gradient-text">${total.toLocaleString()}</span>
            </div>
            <Button
                onClick={onSave}
                disabled={items.length === 0 || isSaving || isSaved}
                className="w-full gradient-primary text-primary-foreground gap-1.5 h-8 text-xs"
            >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : isSaved ? 'Saved ✓' : 'Save Build'}
            </Button>
        </Card>
    )
}

// ---- BuildTips ----
const BuildTips = ({
    selections, compatibilityErrors,
}: {
    selections: Record<string, ApiComponent>
    compatibilityErrors: CompatibilityError[]
}) => {
    const tips: { type: "warn" | "ok" | "info"; text: string }[] = []

    compatibilityErrors.forEach(err => {
        tips.push({
            type: err.severity === 'error' ? 'warn' : 'info',
            text: err.fix ? `${err.message} → ${err.fix}` : err.message
        })
    })

    const missing = componentCategories.filter((c) => !selections[c.key])
    if (missing.length > 0 && missing.length < componentCategories.length && compatibilityErrors.length === 0) {
        tips.push({ type: "info", text: `Missing: ${missing.map((m) => m.label).join(", ")}.` })
    }

    if (tips.length === 0) tips.push({ type: "info", text: "Start selecting components for smart tips." })

    return (
        <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-heading font-semibold text-foreground">Build Intelligence</h3>
            </div>
            <div className="space-y-2">
                {tips.map((tip, i) => {
                    const Icon = tip.type === "warn" ? AlertTriangle : tip.type === "ok" ? CheckCircle2 : Lightbulb
                    const color = tip.type === "warn" ? "text-destructive" : tip.type === "ok" ? "text-primary" : "text-muted-foreground"
                    return (
                        <div key={i} className="flex gap-2 items-start">
                            <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color}`} />
                            <p className="text-xs text-muted-foreground leading-relaxed">{tip.text}</p>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

// ---- AI Build Panel ----
const AIBuildPanel = ({ onApplyBuild: _onApplyBuild }: { onApplyBuild: (b: Record<string, ApiComponent>) => void }) => {
    const [needs, setNeeds] = useState("")
    const [budget, setBudget] = useState("")

    const examples = [
        "1440p gaming and streaming on Twitch",
        "Video editing in Premiere Pro and 3D rendering",
        "Office work, web browsing, light productivity",
        "4K AAA gaming with ray tracing maxed out",
    ]

    return (
        <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                    <h3 className="text-sm font-heading font-semibold text-foreground">AI Build Generator</h3>
                    <p className="text-xs text-muted-foreground">Describe your needs — we'll assemble a balanced build.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">What will you use the PC for?</Label>
                    <Textarea
                        placeholder="e.g. 1440p gaming, video editing, AI workloads..."
                        value={needs}
                        onChange={(e) => setNeeds(e.target.value)}
                        maxLength={500}
                        className="min-h-[100px] bg-muted/30 border-border text-sm resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground text-right">{needs.length}/500</p>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Budget (USD, optional)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 1500"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="bg-muted/30 border-border text-sm"
                    />
                </div>
                <div>
                    <p className="text-[11px] text-muted-foreground mb-1.5">Try an example:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {examples.map((ex) => (
                            <button key={ex} type="button" onClick={() => setNeeds(ex)}
                                className="text-[11px] px-2 py-1 rounded-md border border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors">
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>
                <Button disabled className="w-full gradient-primary text-primary-foreground gap-1.5 opacity-60">
                    <Sparkles className="w-4 h-4" /> Coming soon
                </Button>
            </div>
        </Card>
    )
}

// ---- Helper to refetch build and sync selections ----
const syncBuildSelections = async (
    buildId: number,
    setSelections: React.Dispatch<React.SetStateAction<Record<string, ApiComponent>>>
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated: any = await api(`/builds/${buildId}`)
    if (!updated?.data?.components) return

    const mapped: Record<string, ApiComponent> = {}
    updated.data.components.forEach((c: any) => {
        const catKey = Object.entries(categoryTypeMap).find(([, v]) => v === c.type)?.[0]
        if (catKey) {
            mapped[catKey] = {
                id: c.id,
                name: c.name,
                type: c.type,
                brand: c.brand,
                price: c.price,
                imageUrl: c.imageUrl,
                buildComponentId: c.buildComponentId, // 👈 always fresh
            }
        }
    })
    setSelections(mapped)
}

// ---- Main Builder ----
const Builder = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const existingBuildId = searchParams.get('buildId')
    const preselectId = searchParams.get('preselectId')
    const preselectType = searchParams.get('preselectType')
    const preselectName = searchParams.get('preselectName')
    const queryClient = useQueryClient()

    useEffect(() => {
        if (existingBuildId) {
            queryClient.invalidateQueries({ queryKey: ['builds', Number(existingBuildId)] })
        }
    }, [])
    const { data: existingBuildData, isLoading: isBuildLoading } = useGetBuild(
        existingBuildId ? Number(existingBuildId) : 0
    )

    useEffect(() => {
        setSeeded(false)
    }, [existingBuildId])

    const [selections, setSelections] = useState<Record<string, ApiComponent>>({})
    const [browserOpen, setBrowserOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<ComponentCategory | null>(null)
    const [buildName, setBuildName] = useState("My Custom Build")
    const [buildPurpose, setBuildPurpose] = useState("Gaming")
    const [budget, setBudget] = useState("")
    const [activeBuildId, setActiveBuildId] = useState<number | null>(null)
    const [_saveError, setSaveError] = useState('')
    const [isSaved, setIsSaved] = useState(false)
    const [isAddingComponent, setIsAddingComponent] = useState(false)
    const [compatibilityErrors, setCompatibilityErrors] = useState<CompatibilityError[]>([])
    const [seeded, setSeeded] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const navigate = useNavigate()

    const { mutate: createBuild, isPending: isCreating } = useCreateBuild()
    const { mutate: deleteBuild, isPending: isDeleting } = useDeleteBuild()

    // ---- Seed from existing build ----
    useEffect(() => {
        if (!existingBuildId || seeded || !existingBuildData?.data) return
        const b = existingBuildData.data
        setBuildName(b.name ?? "My Custom Build")
        setBuildPurpose(b.purpose ?? "Gaming")
        setBudget(b.budget ? String(b.budget) : "")
        setActiveBuildId(b.id)
        setIsSaved(true)

        if (b.components?.length) {
            const mapped: Record<string, ApiComponent> = {}
            b.components.forEach((c: any) => {
                const catKey = Object.entries(categoryTypeMap).find(([, v]) => v === c.type)?.[0]
                if (catKey) {
                    mapped[catKey] = {
                        id: c.id,
                        name: c.name,
                        type: c.type,
                        brand: c.brand,
                        price: c.price,
                        imageUrl: c.imageUrl,
                        buildComponentId: c.buildComponentId, // 👈 stored from the start
                    }
                }
            })
            setSelections(mapped)
        }
        setSeeded(true)
    }, [existingBuildData, existingBuildId, seeded])

    // 💡 IMPROVED HOOK: Reliably auto-select items passed from the marketplace
    useEffect(() => {
        if (!preselectId || !preselectType) return;

        const catKey = Object.entries(categoryTypeMap).find(
            ([, apiValue]) => apiValue.toLowerCase() === preselectType.toLowerCase()
        )?.[0];

        if (!catKey) return;

        const componentIdNum = Number(preselectId);

        // If we are loading an existing saved build, wait until it is fully seeded
        // This stops the URL parameter from fighting with the database data loading process
        if (existingBuildId && !seeded) {
            return;
        }

        const performPreselection = async () => {
            if (activeBuildId) {
                setIsAddingComponent(true);
                try {
                    const existing = selections[catKey];
                    if (existing) {
                        await api(`/builds/${activeBuildId}/components/${existing.id}`, {
                            method: 'DELETE',
                        });
                    }

                    await api(`/builds/${activeBuildId}/components`, {
                        method: 'POST',
                        body: JSON.stringify({ componentId: componentIdNum }),
                    });

                    await syncBuildSelections(activeBuildId, setSelections);
                    setIsSaved(true);
                } catch (err) {
                    console.error("Failed to sync preselected item to saved build:", err);
                } finally {
                    setIsAddingComponent(false);
                }
            } else {
                // If it's a completely new build configuration
                const decodedName = preselectName ? decodeURIComponent(preselectName) : "";

                // Set initial placeholder immediately so the UI is responsive
                const provisionalComponent: ApiComponent = {
                    id: componentIdNum,
                    name: decodedName || "Loading component details...",
                    type: preselectType,
                    brand: "",
                    price: null,
                    imageUrl: "",
                };

                setSelections((prev) => ({ ...prev, [catKey]: provisionalComponent }));
                setIsSaved(false);

                try {
                    // Fetch components of this specific type to narrow down search results drastically
                    const typeParam = categoryTypeMap[catKey];
                    const res = await api(`/components?type=${encodeURIComponent(typeParam)}&limit=100`);

                    // Look through the list directly for a strict ID match
                    const matchedItem = res?.data?.components?.find((c: any) => c.id === componentIdNum);

                    if (matchedItem) {
                        setSelections((prev) => ({
                            ...prev,
                            [catKey]: {
                                id: matchedItem.id,
                                name: matchedItem.name,
                                type: matchedItem.type,
                                brand: matchedItem.brand,
                                price: matchedItem.price,
                                imageUrl: matchedItem.imageUrl,
                            },
                        }));
                    } else if (decodedName) {
                        // Backup strategy: Try to query explicitly by name if ID isn't present in the type list chunk
                        const fallbackRes = await api(`/components?search=${encodeURIComponent(decodedName)}&limit=5`);
                        const fallbackMatch = fallbackRes?.data?.components?.find((c: any) => c.id === componentIdNum);
                        if (fallbackMatch) {
                            setSelections((prev) => ({
                                ...prev,
                                [catKey]: {
                                    id: fallbackMatch.id,
                                    name: fallbackMatch.name,
                                    type: fallbackMatch.type,
                                    brand: fallbackMatch.brand,
                                    price: fallbackMatch.price,
                                    imageUrl: fallbackMatch.imageUrl,
                                },
                            }));
                        }
                    }
                } catch (err) {
                    console.error("Could not fetch full component metadata details:", err);
                }
            }

            // Clean up url parameters safely
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('preselectId');
            newParams.delete('preselectType');
            newParams.delete('preselectName');
            setSearchParams(newParams, { replace: true });
        };

        performPreselection();
    }, [preselectId, preselectType, activeBuildId, seeded, existingBuildId, searchParams, setSearchParams]);

    const openBrowser = (category: ComponentCategory) => {
        setActiveCategory(category)
        setBrowserOpen(true)
    }

    const handleSelect = async (component: ApiComponent) => {
        if (!activeCategory) return

        if (activeBuildId) {
            setIsAddingComponent(true)
            setCompatibilityErrors([])

            // 1. remove existing component using component.id (not buildComponentId)
            const existing = selections[activeCategory.key]
            if (existing) {
                try {
                    await api(`/builds/${activeBuildId}/components/${existing.id}`, {
                        method: 'DELETE',
                    })
                } catch (err) {
                    console.error('Failed to remove existing component:', err)
                }
            }

            // 2. add new component
            try {
                await api(`/builds/${activeBuildId}/components`, {
                    method: 'POST',
                    body: JSON.stringify({ componentId: component.id }),
                })

                await syncBuildSelections(activeBuildId, setSelections)
                setCompatibilityErrors([])
                setIsSaved(true)

            } catch (err: any) {
                // on failure, re-add the old component back
                if (existing) {
                    try {
                        await api(`/builds/${activeBuildId}/components`, {
                            method: 'POST',
                            body: JSON.stringify({ componentId: existing.id }),
                        })
                        await syncBuildSelections(activeBuildId, setSelections)
                    } catch {
                        console.error('Failed to restore old component')
                    }
                }

                try {
                    const parsed = JSON.parse(err.message)
                    if (parsed.data?.errors?.length) {
                        setCompatibilityErrors(parsed.data.errors)
                    } else if (parsed.data?.warnings?.length) {
                        setCompatibilityErrors(parsed.data.warnings)
                    } else {
                        setCompatibilityErrors([{
                            severity: 'error',
                            rule: 'UNKNOWN',
                            components: [],
                            message: parsed.message || 'Failed to add component'
                        }])
                    }
                } catch {
                    setCompatibilityErrors([{
                        severity: 'error',
                        rule: 'UNKNOWN',
                        components: [],
                        message: err.message
                    }])
                }
            } finally {
                setIsAddingComponent(false)
            }

        } else {
            setSelections(prev => ({ ...prev, [activeCategory.key]: component }))
            setCompatibilityErrors([])
            setIsSaved(false)
        }
    }

    const removeSelection = async (key: string) => {
        const component = selections[key]

        if (activeBuildId && component) {
            setIsAddingComponent(true)
            try {
                // use component.id not buildComponentId
                await api(`/builds/${activeBuildId}/components/${component.id}`, {
                    method: 'DELETE',
                })
                await syncBuildSelections(activeBuildId, setSelections)
            } catch (err) {
                console.error('Failed to remove component:', err)
            } finally {
                setIsAddingComponent(false)
            }
        } else {
            setSelections(prev => {
                const next = { ...prev }
                delete next[key]
                return next
            })
        }

        setCompatibilityErrors([])
    }

    const handleSave = () => {
        setSaveError('')

        if (activeBuildId) {
            api(`/builds/${activeBuildId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: buildName,
                    purpose: buildPurpose,
                    budget: Number(budget) || 0,
                }),
            }).then(() => {
                setIsSaved(true)
            }).catch((err) => {
                setCompatibilityErrors([{
                    severity: 'error',
                    rule: 'UNKNOWN',
                    components: [],
                    message: err.message
                }])
            })
            return
        }

        createBuild(
            { name: buildName, purpose: buildPurpose, budget: Number(budget) || 0 },
            {
                onSuccess: async (data) => {
                    const buildId = data.data.id
                    setActiveBuildId(buildId)

                    for (const component of Object.values(selections)) {
                        try {
                            await api(`/builds/${buildId}/components`, {
                                method: 'POST',
                                body: JSON.stringify({ componentId: component.id }),
                            })
                        } catch (err) {
                            console.error(`Failed to add ${component.name}:`, err)
                        }
                    }

                    // sync to get buildComponentIds for future edits
                    await syncBuildSelections(buildId, setSelections)
                    setIsSaved(true)
                    setSaveError('')
                },
                onError: (error) => {
                    setSaveError(error.message)
                }
            }
        )
    }

    const handleNewBuild = () => {
        setSelections({})
        setBuildName("My Custom Build")
        setBuildPurpose("Gaming")
        setBudget("")
        setActiveBuildId(null)
        setSaveError('')
        setIsSaved(false)
        setCompatibilityErrors([])
        setSeeded(false)
    }

    const handleDelete = () => {
        if (!activeBuildId) return
        deleteBuild(activeBuildId, {
            onSuccess: () => navigate('/profile'),
            onError: (error) => setSaveError(error.message)
        })
    }

    const totalPrice = Object.values(selections).reduce((sum, c) => sum + (c.price ?? 0), 0)
    const isSaving = isCreating || isAddingComponent

    if (existingBuildId && isBuildLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-sm text-muted-foreground">Loading build...</p>
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex-1 min-w-0 space-y-2">
                        <Input
                            value={buildName}
                            onChange={(e) => { setBuildName(e.target.value); setIsSaved(false) }}
                            className="text-xl lg:text-2xl font-heading font-bold text-foreground bg-transparent border-none p-2 h-auto focus-visible:ring-0 max-w-md"
                        />
                        <div className="flex gap-2 flex-wrap">
                            <Input
                                placeholder="Purpose (e.g. Gaming)"
                                value={buildPurpose}
                                onChange={(e) => { setBuildPurpose(e.target.value); setIsSaved(false) }}
                                className="text-xs bg-muted/30 border-border h-7 w-40"
                            />
                            <Input
                                type="number"
                                placeholder="Budget ($)"
                                value={budget}
                                onChange={(e) => { setBudget(e.target.value); setIsSaved(false) }}
                                className="text-xs bg-muted/30 border-border h-7 w-32"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Object.keys(selections).length}/{componentCategories.length} components · ${totalPrice.toLocaleString()} total
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={handleNewBuild} className="border-border text-muted-foreground gap-1.5">
                            <FileDown className="w-3.5 h-3.5" /> New
                        </Button>
                        {activeBuildId && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={Object.keys(selections).length === 0 || isSaving || isSaved}
                            className="gradient-primary neon-glow text-primary-foreground gap-1.5"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {isCreating ? 'Creating...' : isAddingComponent ? 'Adding...' : isSaved ? 'Saved ✓' : 'Save Build'}
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue="components" className="space-y-6">
                    <TabsList className="bg-muted/50 border border-border">
                        <TabsTrigger value="components" className="gap-1.5 text-xs data-[state=active]:bg-card">
                            <Box className="w-3.5 h-3.5" /> Components
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="gap-1.5 text-xs data-[state=active]:bg-card">
                            <Sparkles className="w-3.5 h-3.5" /> AI Build
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="components">
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-3">
                                <Card className="p-4 bg-gradient-to-r from-secondary/15 via-primary/10 to-secondary/15 border-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                                            <Wand2 className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-heading font-semibold text-foreground">Let AI complete your build</h4>
                                            <p className="text-xs text-muted-foreground">Pick the parts you care about — AI fills in the rest.</p>
                                        </div>
                                    </div>
                                    <Button size="sm" disabled className="gradient-primary text-primary-foreground gap-1.5 h-9 text-xs shrink-0 opacity-60">
                                        <Wand2 className="w-3.5 h-3.5" /> Coming soon
                                    </Button>
                                </Card>

                                {componentCategories.map((cat, i) => {
                                    const selected = selections[cat.key]
                                    const Icon = iconMap[cat.key] || Box
                                    return (
                                        <motion.div key={cat.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                            <Card className={`p-3 sm:p-4 border transition-all ${selected ? "bg-card border-border" : "bg-card/50 border-dashed border-border/60"}`}>
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-primary/10" : "bg-muted/50"}`}>
                                                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-muted-foreground">{cat.label}</p>
                                                        {selected ? (
                                                            <div className="flex items-center gap-2">
                                                                <img src={selected.imageUrl} alt={selected.name} className="w-6 h-6 rounded object-cover bg-muted" />
                                                                <h4 className="text-sm font-heading font-semibold text-foreground truncate">{selected.name}</h4>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground/50 italic">Not selected</p>
                                                        )}
                                                    </div>
                                                    {selected && (
                                                        <span className="text-xs sm:text-sm font-heading font-bold gradient-text shrink-0">
                                                            {selected.price ? `$${selected.price}` : 'N/A'}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-0.5 shrink-0">
                                                        {selected && (
                                                            <Button variant="ghost" size="icon" onClick={() => removeSelection(cat.key)}
                                                                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                                                                disabled={isAddingComponent}
                                                            >
                                                                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant={selected ? "outline" : "default"}
                                                            size="sm"
                                                            onClick={() => openBrowser(cat)}
                                                            disabled={isAddingComponent}
                                                            className={selected
                                                                ? "border-border text-foreground h-7 sm:h-8 text-xs px-2 sm:px-3"
                                                                : "gradient-primary text-primary-foreground h-7 sm:h-8 gap-1 text-xs px-2 sm:px-3"
                                                            }
                                                        >
                                                            {selected ? "Change" : (<><Plus className="w-3 h-3" /> Select</>)}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            <div className="space-y-4">
                                <BuildSummary
                                    selections={selections}
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                    isSaved={isSaved}
                                />
                                <BuildTips
                                    selections={selections}
                                    compatibilityErrors={compatibilityErrors}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ai">
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <AIBuildPanel onApplyBuild={setSelections} />
                            </div>
                            <div className="space-y-4">
                                <BuildSummary
                                    selections={selections}
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                    isSaved={isSaved}
                                />
                                <BuildTips
                                    selections={selections}
                                    compatibilityErrors={compatibilityErrors}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {activeCategory && (
                <ComponentBrowser
                    open={browserOpen}
                    onOpenChange={setBrowserOpen}
                    category={activeCategory}
                    selectedId={selections[activeCategory.key]?.id}
                    onSelect={handleSelect}
                />
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this build?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{buildName}" and all its components. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete build'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Builder