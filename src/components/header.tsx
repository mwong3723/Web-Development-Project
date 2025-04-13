"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

// Link map
const navigation = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "Activities", href: "/activities" },
    { name: "Food", href: "/food" },
    { name: "Accommodations", href: "/accommodations" },
    { name: "Itinerary Builder", href: "/itinerary-builder" },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className="bg-background border-b">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Travel Planner</span>
                        <div className="flex items-center">
                            <MapPin className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">Travel Planner</span>
                        </div>
                    </Link>
                </div>

                {/* Hamburger menu for smaller screens to open mobile menu */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* Navigation links for larger screens */}
                <div className="hidden lg:flex lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={
                                cn("text-sm font-semibold leading-6 transition-colors",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Auth buttons for larger screens */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/signup">Sign up</Link>
                    </Button>
                    <ModeToggle />
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={cn("lg:hidden", mobileMenuOpen ? "fixed inset-0 z-50" : "hidden")}>
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Travel Planner</span>
                            <div className="flex items-center">
                                <MapPin className="h-8 w-8 text-primary" />
                                <span className="ml-2 text-xl font-bold">Travel Planner</span>
                            </div>
                        </Link>
                        <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
                            <span className="sr-only">Close menu</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={
                                            cn("-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7",
                                                pathname === item.href ? "text-primary" : "text-muted-foreground hover:bg-accent"
                                            )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6 space-y-2">
                                <Button asChild variant="outline" className="w-full justify-center">
                                    <Link href="/login">Sign in</Link>
                                </Button>
                                <Button asChild className="w-full justify-center">
                                    <Link href="/signup">Sign up</Link>
                                </Button>
                                <div className="flex justify-center mt-4">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

