import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import FavoriteButton from "@/components/favoritebutton/favoriteButton";
import { useGetComponents } from "@/hooks/use-components";
import altImage from '@/assets/images/image2.png';

type ViewMode = "grid" | "list";

const allCategories = [
    "CPU",
    "CPU Cooler",
    "Case",
    "Memory",
    "Motherboard",
    "Power Supply",
    "Video Card",
    "Storage"
];
const PRICE_MIN = 0;
const PRICE_MAX = 2500;

const Marketplace = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive all filter state from URL so back-navigation restores them
    const urlSearch = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sort = searchParams.get('sort') || 'none';
    const selectedCategories = searchParams.getAll('type');
    const urlMinPrice = parseInt(searchParams.get('minPrice') || String(PRICE_MIN), 10);
    const urlMaxPrice = parseInt(searchParams.get('maxPrice') || String(PRICE_MAX), 10);

    // Local UI-only state (not needed for back-nav)
    const [view, setView] = useState<ViewMode>("grid");
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Search input with debounce to avoid rapid URL churn
    const [searchInput, setSearchInput] = useState(urlSearch);

    useEffect(() => {
        const t = setTimeout(() => {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                const current = prev.get('q') || '';
                const incoming = searchInput.trim();
                if (incoming === current) return prev; // nothing changed, don't touch the URL
                if (incoming) {
                    next.set('q', incoming);
                } else {
                    next.delete('q');
                }
                next.set('page', '1');
                return next;
            }, { replace: true });
        }, 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    // Scroll to top whenever the page number changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [page]);

    // Slider local state — committed to URL only on pointer release
    const [sliderRange, setSliderRange] = useState<[number, number]>([urlMinPrice, urlMaxPrice]);

    // Keep slider in sync if URL changes externally (e.g. reset)
    useEffect(() => {
        setSliderRange([urlMinPrice, urlMaxPrice]);
    }, [urlMinPrice, urlMaxPrice]);

    const updateParams = (
        updates: Record<string, string | string[] | null>,
        resetPage = true
    ) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (resetPage) next.set('page', '1');
            for (const [key, value] of Object.entries(updates)) {
                next.delete(key);
                if (value !== null && value !== '' && value !== 'none') {
                    if (Array.isArray(value)) {
                        value.forEach(v => next.append(key, v));
                    } else {
                        next.set(key, value);
                    }
                }
            }
            return next;
        }, { replace: true });
    };

    const setPage = (p: number) => updateParams({ page: String(p) }, false);
    const setSort = (value: string) => updateParams({ sort: value !== 'none' ? value : null });

    const toggleCategory = (cat: string) => {
        const next = selectedCategories.includes(cat)
            ? selectedCategories.filter(c => c !== cat)
            : [...selectedCategories, cat];
        updateParams({ type: next.length ? next : null });
    };

    const commitPriceRange = (range: [number, number]) => {
        updateParams({
            minPrice: range[0] !== PRICE_MIN ? String(range[0]) : null,
            maxPrice: range[1] !== PRICE_MAX ? String(range[1]) : null,
        });
    };

    const resetFilters = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('type');
            next.delete('minPrice');
            next.delete('maxPrice');
            next.set('page', '1');
            return next;
        }, { replace: true });
    };

    const activeFilterCount =
        selectedCategories.length +
        (urlMinPrice !== PRICE_MIN || urlMaxPrice !== PRICE_MAX ? 1 : 0);

    const { data, isLoading, error } = useGetComponents({
        search: urlSearch || undefined,
        type: selectedCategories[0],
        minPrice: urlMinPrice !== PRICE_MIN ? urlMinPrice : undefined,
        maxPrice: urlMaxPrice !== PRICE_MAX ? urlMaxPrice : undefined,
        page,
        limit: 20,
        sortBy: sort !== "none" ? "price" : undefined,
        order: sort === "price-asc" ? "asc" : sort === "price-desc" ? "desc" : undefined,
    });

    const products = data?.data.components ?? [];

    return (
        <div className="p-4 lg:p-8 max-w-full overflow-x-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Marketplace</h1>
                        <p className="text-sm text-muted-foreground mt-1">Browse premium components & builds</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={view === "grid" ? "default" : "outline"}
                            size="icon"
                            aria-label="Grid view"
                            aria-pressed={view === "grid"}
                            onClick={() => setView("grid")}
                            className="h-9 w-9"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === "list" ? "default" : "outline"}
                            size="icon"
                            aria-label="List view"
                            aria-pressed={view === "list"}
                            onClick={() => setView("list")}
                            className="h-9 w-9"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or brand..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10 bg-muted/50 border-border h-10"
                        />
                    </div>

                    <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-border text-foreground gap-2 h-10 relative">
                                <SlidersHorizontal className="w-4 h-4" /> Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-1 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground border-0">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[320px] sm:w-95 p-0">
                            <div className="flex items-center justify-between px-4 py-3">
                                <h3 className="text-sm font-heading font-semibold text-foreground">Filters</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    disabled={activeFilterCount === 0}
                                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Reset
                                </Button>
                            </div>
                            <Separator />
                            <ScrollArea className="max-h-[60vh]">
                                <div className="p-4 space-y-5">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                                Price range
                                            </Label>
                                            <span className="text-xs text-foreground font-medium">
                                                ${sliderRange[0]} – ${sliderRange[1]}
                                            </span>
                                        </div>
                                        <Slider
                                            min={PRICE_MIN}
                                            max={PRICE_MAX}
                                            step={50}
                                            value={sliderRange}
                                            onValueChange={(v) => setSliderRange([v[0], v[1]] as [number, number])}
                                            onValueCommit={(v) => commitPriceRange([v[0], v[1]] as [number, number])}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Sort by
                                        </Label>
                                        <Select value={sort} onValueChange={setSort}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select order" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Default</SelectItem>
                                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Component type
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {allCategories.map((cat) => {
                                                const id = `cat-${cat}`;
                                                const checked = selectedCategories.includes(cat);
                                                return (
                                                    <label
                                                        key={cat}
                                                        htmlFor={id}
                                                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            id={id}
                                                            checked={checked}
                                                            onCheckedChange={() => toggleCategory(cat)}
                                                        />
                                                        <span className="truncate">{cat}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <Separator />
                            <div className="p-3">
                                <Button
                                    onClick={() => setFiltersOpen(false)}
                                    className="w-full h-9"
                                >
                                    Show {products.length} {products.length === 1 ? "result" : "results"}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {activeFilterCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCategories.map((c) => (
                            <Badge
                                key={`c-${c}`}
                                variant="secondary"
                                className="gap-1 bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                                onClick={() => toggleCategory(c)}
                            >
                                {c} <X className="w-3 h-3" />
                            </Badge>
                        ))}
                        {(urlMinPrice !== PRICE_MIN || urlMaxPrice !== PRICE_MAX) && (
                            <Badge
                                variant="secondary"
                                className="gap-1 bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                                onClick={() => commitPriceRange([PRICE_MIN, PRICE_MAX])}
                            >
                                ${urlMinPrice} – ${urlMaxPrice} <X className="w-3 h-3" />
                            </Badge>
                        )}
                        <button
                            onClick={resetFilters}
                            className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline ml-1"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-16">
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-sm text-destructive">Failed to load products.</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">No products match your filters.</p>
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="mt-3">
                            Reset filters
                        </Button>
                    </div>
                ) : view === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="min-w-0 w-full"
                            >
                                <Link to={`/marketplace/${product.id}`} className="block w-full">
                                    <Card className="bg-card border-border hover:border-primary/30 transition-all overflow-hidden group cursor-pointer relative w-full h-full flex flex-col -p-1">
                                        <div className="absolute top-2 right-2 z-10">
                                            <FavoriteButton componentId={product.id} />
                                        </div>
                                        <div className="aspect-square overflow-hidden bg-muted w-full shrink-0">
                                            <img
                                                src={product.imageUrl || altImage}
                                                alt={product.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = altImage;
                                                }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col justify-between min-w-0">
                                            <div className="min-w-0">
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px] mb-1">
                                                    {product.type}
                                                </Badge>
                                                <h3 className="text-xs sm:text-sm font-heading font-semibold text-foreground truncate w-full">
                                                    {product.name}
                                                </h3>
                                                <p className="text-[10px] text-muted-foreground mb-2 truncate">{product.brand}</p>
                                            </div>
                                            <span className="text-sm sm:text-base font-heading font-bold gradient-text block mt-auto">
                                                {product.price ? `$${product.price}` : 'Price unavailable'}
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 w-full">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="w-full"
                            >
                                <Link to={`/marketplace/${product.id}`} className="block w-full">
                                    <Card className="bg-card border-border hover:border-primary/30 transition-all overflow-hidden group cursor-pointer relative w-full">
                                        <div className="absolute top-3 right-3 z-10">
                                            <FavoriteButton componentId={product.id} />
                                        </div>
                                        <div className="flex gap-3 sm:gap-4 p-3 min-w-0 items-center w-full">
                                            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-md overflow-hidden shrink-0 bg-muted">
                                                <img
                                                    src={product.imageUrl || altImage}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = altImage;
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                                                <div className="min-w-0">
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px] mb-1">
                                                        {product.type}
                                                    </Badge>
                                                    <h3 className="text-xs sm:text-base font-heading font-semibold text-foreground truncate w-full">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">{product.brand}</p>
                                                </div>
                                                <span className="text-sm sm:text-lg font-heading font-bold gradient-text block">
                                                    {product.price ? `$${product.price}` : 'Price unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 text-foreground bg-background"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                        Page {page} of {data?.data.pages ?? 1}
                    </span>
                    <button
                        disabled={page === data?.data.pages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 text-foreground bg-background"
                    >
                        Next
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Marketplace;
