import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, Phone, Calendar, Cpu, Edit, X, Shield, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetProfile, useUpdateProfile } from "@/hooks/use-profile";
import pcBuild1 from "@/assets/images/pc-build-1.jpg";
import pcBuild2 from "@/assets/images/pc-build-2.jpg";
import pcBuild4 from "@/assets/images/pc-build-4.jpg";

const userBuilds = [
    { name: "Neon Vanguard X-1", price: "$2,499", category: "Gaming", img: pcBuild1 },
    { name: "Alpine Mini Pro", price: "$1,299", category: "Compact", img: pcBuild2 },
    { name: "Neon Strike", price: "$1,899", category: "Streaming", img: pcBuild4 },
];

const Profile = () => {
    const { data, isLoading, error } = useGetProfile()
    const { mutate: updateProfile, isPending } = useUpdateProfile()

    const [isEditing, setIsEditing] = useState(false)
    const [updateError, setUpdateError] = useState('')
    const [draft, setDraft] = useState({
        userName: '',
        phone: '',
        currentPassword: '',
        password: '',
        cPassword: '',
    })

    const profile = data?.data

    const initials = profile?.userName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "U"

    const stats = [
        { label: "My builds", value: userBuilds.length.toString() },
        { label: "Total spend", value: "$5.7k" },
    ]

    const openEdit = () => {
        setDraft({
            userName: profile?.userName ?? '',
            phone: profile?.phone ?? '',
            currentPassword: '',
            password: '',
            cPassword: '',
        })
        setUpdateError('')
        setIsEditing(true)
    }

    const saveEdit = () => {
        updateProfile(draft, {
            onSuccess: () => {
                setIsEditing(false)
                setUpdateError('')
            },
            onError: (error) => {
                setUpdateError(error.message)
            }
        })
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
    )

    if (error || !profile) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-muted-foreground">Failed to load profile.</p>
        </div>
    )

    return (
        <div className="p-4 lg:p-8 space-y-6 max-w-6xl mx-auto">
            {/* Profile header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden">
                    <div className="p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative shrink-0 mx-auto md:mx-0">
                                <div className="w-24 h-24 rounded-full bg-primary/10 border border-border flex items-center justify-center text-2xl font-heading font-semibold text-primary">
                                    {initials}
                                </div>
                                <button
                                    type="button"
                                    aria-label="Change avatar"
                                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                                >
                                    <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Identity */}
                            <div className="flex-1 min-w-0 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-xl lg:text-2xl font-heading font-semibold text-foreground truncate">
                                                {profile.userName}
                                            </h1>
                                            {profile.isConfirmed && (
                                                <Badge className="text-[10px] bg-primary/10 text-primary border-0 gap-1">
                                                    <Shield className="w-3 h-3" /> Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="mt-1 text-[10px] capitalize">
                                            {profile.role}
                                        </Badge>
                                    </div>
                                    <Button variant="outline" className="gap-2 shrink-0 self-center md:self-auto" onClick={openEdit}>
                                        <Edit className="w-4 h-4" /> Edit profile
                                    </Button>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 mt-4 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> {profile.email}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" /> {profile.phone}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-7 pt-6 border-t border-border">
                            {stats.map((s) => (
                                <div key={s.label} className="text-center md:text-left">
                                    <div className="text-lg lg:text-xl font-heading font-semibold text-foreground">
                                        {s.value}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Builds tab */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Tabs defaultValue="builds">
                    <TabsList>
                        <TabsTrigger value="builds" className="gap-1.5 text-xs">
                            <Cpu className="w-3.5 h-3.5" /> My Builds
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="builds" className="mt-4">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {userBuilds.map((build, i) => (
                                <motion.div key={build.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                    <Card className="overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors">
                                        <div className="aspect-square overflow-hidden bg-muted">
                                            <img src={build.img} alt={build.name} loading="lazy" width={512} height={512}
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                        </div>
                                        <div className="p-3">
                                            <Badge variant="secondary" className="text-[10px] mb-1.5">{build.category}</Badge>
                                            <h3 className="text-sm font-heading font-semibold text-foreground truncate">{build.name}</h3>
                                            <span className="text-base font-heading font-bold text-foreground">{build.price}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Edit profile modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Update your username, phone, or password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Username</Label>
                            <Input
                                value={draft.userName}
                                onChange={(e) => setDraft(prev => ({ ...prev, userName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <Input
                                value={draft.phone}
                                onChange={(e) => setDraft(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs text-muted-foreground">Current password</Label>
                            <Input
                                type="password"
                                placeholder="Enter current password"
                                value={draft.currentPassword}
                                onChange={(e) => setDraft(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">New password</Label>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                value={draft.password}
                                onChange={(e) => setDraft(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Confirm new password</Label>
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                value={draft.cPassword}
                                onChange={(e) => setDraft(prev => ({ ...prev, cPassword: e.target.value }))}
                            />
                        </div>
                    </div>
                    {updateError && (
                        <p className="text-sm text-destructive">{updateError}</p>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                            <X className="w-4 h-4" /> Cancel
                        </Button>
                        <Button onClick={saveEdit} disabled={isPending} className="gap-2">
                            <Save className="w-4 h-4" />
                            {isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;