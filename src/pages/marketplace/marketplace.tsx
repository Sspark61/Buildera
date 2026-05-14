import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { marketplaceProducts as products } from "@/assets/data/marketplaceProducts";

type ViewMode = "grid" | "list";

const parsePrice = (price: string) => Number(price.replace(/[^0-9.]/g, "")) || 0;

const allCategories = Array.from(new Set(products.map((p) => p.category))).sort();
const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
const prices = products.map((p) => parsePrice(p.price));
const PRICE_MIN = Math.floor(Math.min(...prices) / 50) * 50;
const PRICE_MAX = Math.ceil(Math.max(...prices) / 50) * 50;

const Marketplace = () => {
    const [search, setSearch] = useState("");
    const [view, setView] = useState<ViewMode>("grid");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

    const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
        setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([PRICE_MIN, PRICE_MAX]);
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedBrands.length +
        (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return products.filter((p) => {
            const price = parsePrice(p.price);
            if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
            if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
            if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
            if (price < priceRange[0] || price > priceRange[1]) return false;
            return true;
        });
    }, [search, selectedCategories, selectedBrands, priceRange]);

    return (
        <div className="p-4 lg:p-8">
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                        <PopoverContent align="end" className="w-[320px] sm:w-[380px] p-0">
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
                                                ${priceRange[0]} – ${priceRange[1]}
                                            </span>
                                        </div>
                                        <Slider
                                            min={PRICE_MIN}
                                            max={PRICE_MAX}
                                            step={50}
                                            value={priceRange}
                                            onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                                        />
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
                                                            onCheckedChange={() =>
                                                            toggle(selectedCategories, cat, setSelectedCategories)
                                                            }
                                                        />
                                                        <span className="truncate">{cat}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Manufacturer
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {allBrands.map((brand) => {
                                                const id = `brand-${brand}`;
                                                const checked = selectedBrands.includes(brand);
                                                return (
                                                    <label
                                                        key={brand}
                                                        htmlFor={id}
                                                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                                                    >
                                                        <Checkbox
                                                            id={id}
                                                            checked={checked}
                                                            onCheckedChange={() =>
                                                                toggle(selectedBrands, brand, setSelectedBrands)
                                                            }
                                                        />
                                                        <span className="truncate">{brand}</span>
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
                                    Show {filtered.length} {filtered.length === 1 ? "result" : "results"}
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
                            onClick={() => toggle(selectedCategories, c, setSelectedCategories)}
                            >
                                {c} <X className="w-3 h-3" />
                            </Badge>
                        ))}
                        {selectedBrands.map((b) => (
                            <Badge
                            key={`b-${b}`}
                            variant="secondary"
                            className="gap-1 bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                            onClick={() => toggle(selectedBrands, b, setSelectedBrands)}
                            >
                                {b} <X className="w-3 h-3" />
                            </Badge>
                        ))}
                        {(priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
                            <Badge
                            variant="secondary"
                            className="gap-1 bg-muted text-foreground hover:bg-muted/80 cursor-pointer"
                            onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                            >
                                ${priceRange[0]} – ${priceRange[1]} <X className="w-3 h-3" />
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
                {filtered.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground">No products match your filters.</p>
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="mt-3">
                            Reset filters
                        </Button>
                    </div>
                ) : view === "grid" ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <Link to={`/marketplace/${product.slug}`} className="block">
                                    <Card className="bg-card border-border hover:border-primary/30 transition-all overflow-hidden group cursor-pointer relative">
                                        <div className="aspect-square overflow-hidden -m-4">
                                            <img
                                            src={product.img}
                                            alt={product.name}
                                            loading="lazy"
                                            width={512}
                                            height={512}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px] mb-1">
                                                {product.category}
                                            </Badge>
                                            <h3 className="text-sm font-heading font-semibold text-foreground truncate">{product.name}</h3>
                                            <p className="text-[10px] text-muted-foreground mb-3">{product.brand}</p>
                                            <span className="text-base font-heading font-bold gradient-text">{product.price}</span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Link to={`/marketplace/${product.slug}`} className="block">
                                    <Card className="bg-card border-border hover:border-primary/30 transition-all overflow-hidden group cursor-pointer">
                                        <div className="flex gap-4 p-3">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden shrink-0 bg-muted">
                                                <img
                                                    src={product.img}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    width={256}
                                                    height={256}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col">
                                                <div className="flex items-start justify-between gap-3 mb-1">
                                                    <div className="min-w-0">
                                                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 text-[10px] mb-1.5">
                                                            {product.category}
                                                        </Badge>
                                                        <h3 className="text-sm sm:text-base font-heading font-semibold text-foreground truncate">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                                                    </div>
                                                    <span className="text-base sm:text-lg font-heading font-bold gradient-text shrink-0">
                                                        {product.price}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Marketplace;
