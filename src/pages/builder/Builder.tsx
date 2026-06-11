import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Monitor, Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Fan, Box,
    Plus, Save, FolderOpen, FileDown, Sparkles, ChevronDown, Trash2,
    Search, Check, Receipt, Lightbulb, AlertTriangle, CheckCircle2,
    Wand2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";


export default function Builder() {
    return (
        <div className="p-4 lg:p-8 space-y-6 max-w-3xl">
            <h1 className="font-heading text-2xl lg:text-3xl text-foreground text-bold mb-1">My Custom Build</h1>
        </div>
    )
}
