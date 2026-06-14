import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Plus, TrendingUp, ShoppingBag, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import FavoriteButton from "@/components/favoritebutton/favoriteButton";
import { useGetComponentDetails } from '../../hooks/use-componentDetails'
import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer
} from "recharts"

// ---- Price History Hook ----
interface PricePoint {
    date: string
    price: number
    predicted?: number
}

const usePriceHistory = (name: string) => {
    const [data, setData] = useState<PricePoint[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!name) return

        console.log('Fetching price history for:', name)
        console.log('URL:', `https://data-gqlk.vercel.app/api/prediction?name=${encodeURIComponent(name)}`)

        setIsLoading(true)
        fetch(`https://data-gqlk.vercel.app/api/prediction?name=${encodeURIComponent(name)}`)
            .then(res => res.json())
            .then(json => {
                console.log('Price API response:', json)
                const raw: [number, number][] = json?.data?.[0]?.data ?? []
                console.log('Raw data points:', raw.length)
                if (!raw.length) return

                const PREDICTION_COUNT = 7
                const splitIndex = raw.length - PREDICTION_COUNT

                const formatted: PricePoint[] = raw.map(([timestamp, price], i) => ({
                    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    price: i < splitIndex ? price : undefined as any,
                    predicted: i >= splitIndex ? price : undefined as any,
                }))

                // make the last history point connect to first prediction
                if (splitIndex > 0) {
                    formatted[splitIndex - 1].predicted = formatted[splitIndex - 1].price
                }

                setData(formatted)
            })
            .catch(() => setError('Failed to load price history'))
            .finally(() => setIsLoading(false))
    }, [name])

    return { data, isLoading, error }
}

// ---- Custom Tooltip ----
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const value = payload[0]?.value
    const isPredicted = payload[0]?.dataKey === 'predicted'
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-bold text-foreground">${value}</span>
                {isPredicted && (
                    <Badge className="text-[10px] h-4 px-1.5 bg-primary/20 text-primary border-0">
                        forecast
                    </Badge>
                )}
            </div>
        </div>
    )
}

// ---- Price Chart ----
const PriceHistoryChart = ({ name }: { name: string }) => {
    const { data, isLoading, error } = usePriceHistory(name)

    if (isLoading) return (
        <Card className="bg-card border-border p-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading price history...</p>
        </Card>
    )

    if (error || !data.length) return (
        <Card className="bg-card border-border p-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Price history unavailable.</p>
        </Card>
    )

    const predictionStartIndex = data.findIndex(d => d.predicted !== undefined && d.price === undefined)
    const predictionStartDate = predictionStartIndex > 0 ? data[predictionStartIndex]?.date : null
    const displayData = data.slice(-37)

    const allPrices = data.flatMap(d => [d.price, d.predicted].filter(Boolean)) as number[]
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const padding = (maxPrice - minPrice) * 0.15

    // find current price and predicted price for summary
    const currentPrice = [...data].reverse().find(d => d.price)?.price
    const lastPredicted = [...data].reverse().find(d => d.predicted)?.predicted
    const priceDiff = lastPredicted && currentPrice ? lastPredicted - currentPrice : null
    const isUp = priceDiff !== null && priceDiff >= 0

    return (
        <Card className="bg-card border-border overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-heading font-semibold text-foreground">
                            Price History & Forecast
                        </h2>
                    </div>
                    {/* Summary pills */}
                    <div className="flex items-center gap-3">
                        {currentPrice && (
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground">Current</p>
                                <p className="text-sm font-heading font-bold text-foreground">${currentPrice}</p>
                            </div>
                        )}
                        {lastPredicted && (
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground">7-day forecast</p>
                                <p className={`text-sm font-heading font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                                    ${lastPredicted}
                                </p>
                            </div>
                        )}
                        {priceDiff !== null && (
                            <div className={`px-2 py-1 rounded-md text-xs font-medium ${isUp ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                                {isUp ? '▲' : '▼'} ${Math.abs(priceDiff).toFixed(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-6 h-0.5 bg-primary inline-block rounded-full" />
                        Historical
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-6 h-px border-t-2 border-dashed border-primary/60 inline-block" />
                        7-day forecast
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4 pt-6">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={displayData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.06)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontFamily: 'inherit' }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            dy={8}
                        />
                        <YAxis
                            domain={[minPrice - padding, maxPrice + padding]}
                            tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontFamily: 'inherit' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${Math.round(v)}`}
                            width={60}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        />
                        {predictionStartDate && (
                            <ReferenceLine
                                x={predictionStartDate}
                                stroke="rgba(255,255,255,0.2)"
                                strokeDasharray="4 4"
                                label={{
                                    value: '← History  |  Forecast →',
                                    position: 'top',
                                    fontSize: 10,
                                    fill: 'rgba(255,255,255,0.35)',
                                    fontFamily: 'inherit',
                                }}
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={2.5}
                            fill="url(#colorPrice)"
                            dot={false}
                            connectNulls={false}
                            activeDot={{ r: 4, fill: 'hsl(217, 91%, 60%)', stroke: 'white', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={2}
                            strokeDasharray="6 4"
                            strokeOpacity={0.6}
                            fill="url(#colorPredicted)"
                            dot={false}
                            connectNulls={false}
                            activeDot={{ r: 4, fill: 'hsl(217, 91%, 60%)', stroke: 'white', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

// 💻 ---- Retailers Dynamic Registry Map ----
const RETAILER_REGISTRY: Record<string, { name: string; initial: string; bg: string; text: string }> = {
    "nvidia.com":      { name: "NVIDIA Store", initial: "NS", bg: "bg-[#76B900]", text: "text-white" },
    "amazon.com":      { name: "Amazon",       initial: "A",  bg: "bg-[#FF9900]", text: "text-black font-bold" },
    "newegg.com":      { name: "Newegg",       initial: "N",  bg: "bg-[#F5A623]", text: "text-white" },
    "microcenter.com": { name: "Micro Center",  initial: "MC", bg: "bg-[#E01A22]", text: "text-white" },
    "bhphotovideo.com":{ name: "B&H Photo",    initial: "BP", bg: "bg-[#000000]", text: "text-white border border-border/40" },
};

const getStoreMetaFromUrl = (urlStr: string) => {
    const domain = urlStr.toLowerCase();
    const matchedKey = Object.keys(RETAILER_REGISTRY).find(key => domain.includes(key));

    if (matchedKey) {
        return {
            ...RETAILER_REGISTRY[matchedKey],
            displayDomain: matchedKey
        };
    }

    try {
        const urlObj = new URL(urlStr);
        const host = urlObj.hostname.replace("www.", "");
        return {
            name: host.split('.')[0],
            displayDomain: host,
            initial: host.substring(0, 2).toUpperCase(),
            bg: "bg-muted",
            text: "text-muted-foreground"
        };
    } catch {
        return { name: "Retailer", displayDomain: "Store Link", initial: "R", bg: "bg-muted", text: "text-muted-foreground" };
    }
};

// 💻 ---- Where To Buy Link Grid Component ----
export const WhereToBuy = ({ urls, currentPrice }: { urls: string[]; currentPrice?: number | null }) => {
    if (!urls || urls.length === 0) return null;

    return (
        <div className="space-y-4 my-10">
            <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" /> Where to buy
                </h3>
                <p className="text-xs text-muted-foreground">
                    Specsfetcher doesn't sell products directly. Compare prices from trusted retailers below.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {urls.map((url, index) => {
                    const meta = getStoreMetaFromUrl(url);
                    const isBestPrice = index === 0;

                    return (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/40 hover:bg-muted/30 hover:border-primary/30 transition-all group"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${meta.bg} ${meta.text} text-xs font-semibold`}>
                                    {meta.initial}
                                </div>
                                
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-heading font-semibold text-foreground truncate select-none capitalize">
                                            {meta.name}
                                        </span>
                                        {isBestPrice && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium border border-primary/20">
                                                Best price
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground/70 truncate block">
                                        {meta.displayDomain}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <span className="text-sm font-heading font-bold text-foreground">
                                    {currentPrice ? `$${currentPrice.toLocaleString()}` : "View"}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

// ---- Main Page ----
const ProductDetail = () => {
    const { id } = useParams()
    const { data, isLoading, error } = useGetComponentDetails(Number(id))
    const navigate = useNavigate();
    const product = data?.data

    if (isLoading) return (
        <div className="p-6 lg:p-10 flex items-center justify-center min-h-screen">
            <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="p-6 lg:p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">Failed to load product details.</p>
            <Button asChild>
                <Link to="/marketplace">
                    <ArrowLeft className="w-4 h-4" /> Back to Marketplace
                </Link>
            </Button>
        </div>
    )

    if (!product) return (
        <div className="p-6 lg:p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                Product not found
            </h1>
            <p className="text-muted-foreground mb-6">
                We couldn't find the product you're looking for.
            </p>
            <Button asChild>
                <Link to="/marketplace">
                    <ArrowLeft className="w-4 h-4" /> Back to Marketplace
                </Link>
            </Button>
        </div>
    )

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-6 text-muted-foreground hover:text-foreground"
                >
                    <Link to="/marketplace">
                        <ArrowLeft className="w-4 h-4" /> Marketplace
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    <Card className="bg-card border-border overflow-hidden -py-4">
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full object-cover"
                            />
                        </div>
                    </Card>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                                {product.type}
                            </Badge>
                        </div>
                        <h1 className="text-2xl lg:text-4xl font-heading font-bold text-foreground mb-1">
                            {product.name}
                        </h1>
                        <p className="text-sm text-muted-foreground mb-4">by {product.brand}</p>
                        <div className="flex items-baseline gap-2 mb-5">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                Starting at
                            </span>
                            <span className="text-3xl lg:text-4xl font-heading font-bold gradient-text">
                                {product.price ? `$${product.price}` : 'Price unavailable'}
                            </span>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-sm font-heading font-semibold text-foreground mb-3 uppercase tracking-wide">
                                Key Specs
                            </h2>
                            <ul className="space-y-2">
                                {Object.entries(product.specs).slice(0, 5).map(([key, value]) => (
                                    <li key={key} className="flex items-start gap-2 text-sm text-foreground">
                                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <span><span className="text-muted-foreground">{key}:</span> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-3 mt-auto w-full">
                            {/* Add to Build Button */}
                            <Button
                                size="lg"
                                className="w-full gap-2 p-5 font-heading font-semibold text-sm sm:text-base"
                                onClick={() => {
                                    const targetType = encodeURIComponent(product.type);
                                    const targetName = encodeURIComponent(product.name);
                                    navigate(`/builder?preselectId=${product.id}&preselectType=${targetType}&preselectName=${targetName}`);
                                }}
                            >
                                <Plus className="w-4 h-4" /> Add to Build
                            </Button>

                            {/* Full Width Add to Favorites Button Wrapper */}
                            <div className="w-full h-12 rounded-md border border-border bg-card text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-3 font-heading font-semibold text-sm shadow-sm relative">
                                <FavoriteButton
                                    componentId={product.id}
                                    className="bg-transparent hover:bg-transparent border-0 shadow-none h-full !w-auto px-0 flex items-center justify-center"
                                />
                                <span className="text-sm font-heading font-semibold select-none pointer-events-none">
                                    Add to Favorites
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 💻 WHERE TO BUY LINKS (Renders dynamically directly beneath top split block) */}
                <WhereToBuy urls={product.urls} currentPrice={product.price}/>

                {/* Specs table */}
                <div className="mt-10">
                    <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Specifications
                    </h2>
                    <Card className="bg-card border-border overflow-hidden -py-4">
                        <div className="divide-y divide-border">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-2 px-4 py-3 text-sm">
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="text-foreground font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Price history chart */}
                <div className="mt-10">
                    <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Price History
                    </h2>
                    <PriceHistoryChart name={product.name} />
                </div>

            </motion.div>
        </div>
    );
};

export default ProductDetail;