import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProductBySlug } from "@/assets/data/marketplaceProducts";

const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const product = slug ? getProductBySlug(slug) : undefined;

    if (!product) {
        return (
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
        );
    }

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
                            src={product.img}
                            alt={product.name}
                            className="h-full object-cover"
                            />
                        </div>
                    </Card>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                                {product.category}
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
                                {product.price}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                            {product.description}
                        </p>
                        <div className="mb-6">
                            <h2 className="text-sm font-heading font-semibold text-foreground mb-3 uppercase tracking-wide">
                                Key Features
                            </h2>
                            <ul className="space-y-2">
                                {product.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                            <Button
                                size="lg"
                                className="flex-1 gap-2 p-2"
                                onClick={() => navigate("/builder")}
                            >
                                <Plus className="w-4 h-4" /> Add to Build
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Specifications
                    </h2>
                    <Card className="bg-card border-border overflow-hidden -py-4">
                        <div className="divide-y divide-border">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="grid grid-cols-2 px-4 py-3 text-sm"
                                >
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="text-foreground font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetail;
