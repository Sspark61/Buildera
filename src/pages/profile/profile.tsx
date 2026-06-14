import { useState, useEffect, useRef } from "react";
import { useQueryClient } from '@tanstack/react-query'
import { motion } from "framer-motion";
import { Camera, Mail, Phone, Calendar, Cpu, Edit, X, Shield, Save, Trash2, Heart, Loader2 } from "lucide-react";
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
import FavoriteButton from "@/components/favoritebutton/favoriteButton";
import { useGetProfile, useUpdateProfile, useUploadProfilePic } from "@/hooks/use-profile"; 
import { useGetBuilds, useDeleteBuild } from '@/hooks/use-builds'
import { Link } from 'react-router-dom';
import { useGetFavorites } from '@/hooks/use-favorites'

const Profile = () => {
    const { data, isLoading, error } = useGetProfile()
    const { mutate: updateProfile, isPending } = useUpdateProfile()
    const { mutate: uploadProfilePic, isPending: isUploadingPic } = useUploadProfilePic() 
    const { mutate: deleteBuild } = useDeleteBuild()
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [buildToDelete, setBuildToDelete] = useState<{ id: number, name: string | null } | null>(null)
    const { data: favoritesData, isLoading: favoritesLoading } = useGetFavorites()
    const favorites = favoritesData?.data ?? []
    const queryClient = useQueryClient()
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['builds'] })
    }, [queryClient])

    const { data: buildsData, isLoading: buildsLoading } = useGetBuilds({
        refetchOnMount: true,
        staleTime: 0
    })
    const builds = buildsData?.data ?? []

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
        ? profile.userName
            .split(" ")
            .map((n) => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U"

    const stats = [
        { label: "My builds", value: builds.length.toString() },
        { label: "Wishlist", value: favorites.length.toString() },
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
            onError: (error: any) => {
                setUpdateError(error.message || "Failed to update profile configurations")
            }
        })
    }

    const handleDelete = () => {
        if (!buildToDelete) return
        setDeletingId(buildToDelete.id)
        deleteBuild(buildToDelete.id, {
            onSuccess: () => {
                setDeletingId(null)
                setBuildToDelete(null)
            },
            onError: () => setDeletingId(null)
        })
    }

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("image", file)

        uploadProfilePic(formData, {
            onError: (err: any) => {
                alert(err?.message || "Failed to upload profile picture")
            }
        })
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground ml-2">Loading profile...</p>
        </div>
    )

    if (error || !profile) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-sm text-destructive font-medium">Failed to load profile. Please check your authentication.</p>
        </div>
    )

    return (
        <div className="p-4 lg:p-8 space-y-6 max-w-6xl mx-auto">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {/* Profile header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="overflow-hidden">
                    <div className="p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                            {/* Avatar Wrapper */}
                            <div className="relative shrink-0 mx-auto md:mx-0">
                                <div className="w-24 h-24 rounded-full bg-primary/10 border border-border flex items-center justify-center text-2xl font-heading font-semibold text-primary overflow-hidden">
                                    {isUploadingPic ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    ) : profile.imageUrl ? (
                                        <img src={profile.imageUrl} alt={profile.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAvatarButtonClick}
                                    disabled={isUploadingPic}
                                    aria-label="Change avatar"
                                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Identity */}
                            <div className="flex-1 min-w-0 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 justify-center md:justify-start">
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
                                    {profile.phone && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" /> {profile.phone}
                                        </span>
                                    )}
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

            {/* Builds and Wishlist Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Tabs defaultValue="builds">
                    <TabsList>
                        <TabsTrigger value="builds" className="gap-1.5 text-xs">
                            <Cpu className="w-3.5 h-3.5" /> My Builds
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" className="gap-1.5 text-xs">
                            <Heart className="w-3.5 h-3.5" /> Wishlist
                            {favorites.length > 0 && (
                                <span className="ml-1 bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                                    {favorites.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="builds" className="mt-4">
                        {buildsLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-10">Loading builds...</p>
                        ) : builds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-xl">
                                <p className="text-sm text-foreground font-medium">No builds yet</p>
                                <p className="text-xs text-muted-foreground mt-1 mb-4">Start building your dream PC.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {builds.map((build, i) => (
                                    <motion.div key={build.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                        <Card className="overflow-hidden group hover:border-primary/30 transition-colors relative">
                                            <Link to={`/builder?buildId=${build.id}`}>
                                                <div className="p-4 flex flex-col gap-2">
                                                    <Badge variant="secondary" className="text-[10px] w-fit -mx-1">{build.purpose}</Badge>
                                                    <h3 className="text-sm font-heading font-semibold text-foreground truncate">
                                                        {build.name ?? 'Unnamed Build'}
                                                    </h3>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-xs text-muted-foreground">{build.componentCount} components</span>
                                                        <span className="text-sm font-heading font-bold gradient-text">
                                                            ${build.totalPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            Budget: ${build.budget.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(build.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => setBuildToDelete({ id: build.id, name: build.name })}
                                                disabled={deletingId === build.id}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="wishlist" className="mt-4">
                        {favoritesLoading ? (
                            <p className="text-sm text-muted-foreground text-center py-10">Loading wishlist...</p>
                        ) : favorites.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <Heart className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-foreground font-medium">Your wishlist is empty</p>
                                <p className="text-xs text-muted-foreground mt-1 mb-4">
                                    Tap the heart icon on any component to save it here.
                                </p>
                                <Button asChild size="sm">
                                    <Link to="/marketplace">Browse parts</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {favorites.map((item, i) => (
                                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                        <Link to={`/marketplace/${item.id}`}>
                                            <Card className="overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors relative">
                                                <div className="absolute top-2 right-2 z-10">
                                                    <FavoriteButton componentId={item.id} />
                                                </div>
                                                <div className="aspect-square overflow-hidden bg-muted">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <Badge variant="secondary" className="text-[10px] mb-1.5">{item.type}</Badge>
                                                    <h3 className="text-sm font-heading font-semibold text-foreground truncate">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                                                    <span className="text-sm font-heading font-bold gradient-text">
                                                        {item.price ? `$${item.price}` : 'Price unavailable'}
                                                    </span>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
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

            {/* Delete Alert Dialog */}
            <AlertDialog open={!!buildToDelete} onOpenChange={(o) => { if (!o) setBuildToDelete(null) }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this build?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{buildToDelete?.name ?? 'Unnamed Build'}". This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={!!deletingId}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingId ? 'Deleting...' : 'Delete build'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Profile;