import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const EXAMPLE_PROMPTS = [
    "1440p gaming and streaming on Twitch",
    "Video editing in Premiere Pro and 3D rendering",
    "Office work, web browsing, light productivity",
    "4K AAA gaming with ray tracing maxed out",
];

export interface AIBuildFormValues {
    prompt: string;
    budget: number | null;
    allowUpgrade: boolean;
}

interface AIBuildModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerateBuild: (values: AIBuildFormValues) => Promise<void> | void;
    isLoading: boolean;
}

export const AIBuildModal = ({ open, onOpenChange, onGenerateBuild, isLoading }: AIBuildModalProps) => {
    const [prompt, setPrompt] = useState("");
    const [budget, setBudget] = useState("");
    const [allowUpgrade, setAllowUpgrade] = useState(false);

    const handleSubmit = async () => {
        await onGenerateBuild({
            prompt,
            budget: budget.trim() !== "" ? Number(budget) : null,
            allowUpgrade,
        });
    };

    return (
        <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <DialogTitle>AI Build Generator</DialogTitle>
                    </div>
                    <DialogDescription>
                        Describe your needs — we'll assemble a balanced build.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">What will you use the PC for?</Label>
                        <Textarea
                            placeholder="e.g. 1440p gaming, video editing, AI workloads..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            maxLength={500}
                            disabled={isLoading}
                            className="min-h-[100px] bg-muted/30 border-border text-sm resize-none"
                        />
                        <p className="text-[10px] text-muted-foreground text-right">{prompt.length}/500</p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Budget (USD, optional)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 1500"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            disabled={isLoading}
                            className="bg-muted/30 border-border text-sm"
                        />
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <Checkbox
                            checked={allowUpgrade}
                            onCheckedChange={(checked) => setAllowUpgrade(checked === true)}
                            disabled={isLoading}
                            className="mt-0.5"
                        />
                        <div>
                            <p className="text-sm text-foreground font-medium">Allow AI to replace selected components</p>
                            <p className="text-xs text-muted-foreground">
                                When unchecked, AI will only fill empty slots.
                            </p>
                        </div>
                    </label>

                    <div>
                        <p className="text-[11px] text-muted-foreground mb-1.5">Try an example:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {EXAMPLE_PROMPTS.map((ex) => (
                                <button
                                    key={ex}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setPrompt(ex)}
                                    className="text-[11px] px-2 py-1 rounded-md border border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || prompt.trim() === ""}
                        className="gradient-primary text-primary-foreground gap-1.5"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Generate with AI
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
