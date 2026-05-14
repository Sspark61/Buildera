import { Bell, Shield, Palette, LogOut } from 'lucide-react';
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
export default function Settings() {
    const { theme, setTheme } = useTheme();
    return (
        <div className="p-4 lg:p-8 space-y-6 max-w-3xl">
            <h1 className="font-heading text-2xl lg:text-3xl text-foreground text-bold mb-1">Settings</h1>
            <p className="text-sm text-muted-foreground mb-6">Manage your account preferences</p>
            {/* NOTIFICATIONS */}
            <div className='mb-6'>
                <div className='flex items-center gap-x-2'>
                    <Bell size={14} className='text-primary' />
                    <h2 className='font-heading text-sm'>Notifications</h2>
                </div>
                <div className='mt-2'>
                    <FieldGroup className="w-full flex  ">
                        <FieldLabel htmlFor="build-status">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Build status updates</FieldTitle>
                                </FieldContent>
                                <Switch id="build-status" defaultChecked />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="price-alerts">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Price drop alerts</FieldTitle>
                                </FieldContent>
                                <Switch id="price-alerts" defaultChecked />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="new-releases">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>New component releases</FieldTitle>
                                </FieldContent>
                                <Switch id="new-releases" />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="marketing-emails">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Marketing emails</FieldTitle>
                                </FieldContent>
                                <Switch id="marketing-emails" />
                            </Field>
                        </FieldLabel>
                    </FieldGroup>
                </div>
            </div>
            {/* Privacy and security */}
            <div className='mb-6'>
                <div className='flex items-center gap-x-2'>
                    <Shield size={14} className='text-primary' />
                    <h2 className='font-heading text-sm'>Privacy & Security </h2>
                </div>
                <div className='mt-2'>
                    <FieldGroup className="w-full flex  ">
                        <FieldLabel htmlFor="2FA">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Two-factor authentication</FieldTitle>
                                </FieldContent>
                                <Switch id="2FA" />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="public-profile">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Public profile</FieldTitle>
                                </FieldContent>
                                <Switch id="public-profile" defaultChecked />
                            </Field>
                        </FieldLabel>
                        <FieldLabel htmlFor="show-builds">
                            <Field orientation="horizontal">
                                <FieldContent>
                                    <FieldTitle>Show builds publicly</FieldTitle>
                                </FieldContent>
                                <Switch id="show-builds" defaultChecked />
                            </Field>
                        </FieldLabel>
                    </FieldGroup>
                </div>
            </div>
            {/* Theme */}
            <div className='mb-6'>
                <div className='flex items-center gap-x-2'>
                    <Palette size={14} className='text-primary' />
                    <h2 className='font-heading text-sm'>Appearance </h2>
                </div>
                <div className='mt-2'>
                    <FieldGroup className="w-full flex">
                        <FieldLabel htmlFor="theme" className='flex items-center justify-between'>
                            <Field orientation="horizontal" className='flex items-center!'>
                                <FieldContent>
                                    <FieldTitle>Theme</FieldTitle>
                                </FieldContent>
                                <div className="flex gap-2">
                                    <button onClick={() => setTheme("dark")} className={`w-8 h-8 rounded-lg bg-black ${theme === "dark" ? "border-primary ring-2 ring-primary/30" : "border-border"} cursor-pointer`} title='Dark'></button>
                                    <button onClick={() => setTheme("light")} className={`w-8 h-8 rounded-lg bg-white ${theme === "light" ? "border-primary ring-2 ring-primary/30" : "border-border"} cursor-pointer`} title="Light"></button>
                                </div>
                            </Field>
                        </FieldLabel>
                    </FieldGroup>
                </div>
            </div>
            {/* Logout */}
            <div className='flex items-center gap-x-2 rounded-lg border text-card-foreground shadow-sm bg-destructive/5 border-destructive/20 p-4'>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h3 className='text-destructive text-sm text-bold font-heading'>Log Out</h3>
                        <p className='text-xs text-muted-foreground'>Sign out of your account</p>
                    </div>
                    <Button size="sm" variant="destructive" className="cursor-pointer text-destructive font-heading bg-background hover:text-accent-foreground border-destructive/30">
                        <LogOut className="w-4 h-4" />
                        <a href='' className='hidden sm:block'> Log Out</a>
                    </Button>
                </div>
            </div>
            {/* Save */}

            <Button size="lg" variant="outline" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:text-primary-foreground! disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 py-2 gradient-primary neon-glow text-primary-foreground font-semibold w-full ">
                <span className=''>Save Changes</span>
            </Button>

        </div >
    )
}
