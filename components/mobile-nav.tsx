"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu } from "lucide-react"
import { Flag, Palette, Download, MessageSquare, Layers, Home, Users, Settings, Zap, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Disable tooltips on touch devices
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    setShowTooltip(!isTouchDevice)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      href: "/tools/startup-flags",
      label: "Startup Flags",
      icon: <Flag className="h-5 w-5" />,
      active: pathname === "/tools/startup-flags",
    },
    {
      href: "/tools/gradient",
      label: "Gradient",
      icon: <Palette className="h-5 w-5" />,
      active: pathname === "/tools/gradient",
    },
    {
      href: "/tools/colors",
      label: "Colors",
      icon: <Layers className="h-5 w-5" />,
      active: pathname === "/tools/colors",
    },
    {
      href: "/tools/motd",
      label: "MOTD",
      icon: <MessageSquare className="h-5 w-5" />,
      active: pathname === "/tools/motd",
    },
    {
      href: "/tools/downloads",
      label: "Downloads",
      icon: <Download className="h-5 w-5" />,
      active: pathname === "/tools/downloads",
    },
    {
      href: "/tools/whitelist",
      label: "Whitelist",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/tools/whitelist",
    },
    {
      href: "/tools/server-properties",
      label: "Server Properties",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/tools/server-properties",
    },
    {
      href: "/tools/optimization",
      label: "Optimization",
      icon: <Zap className="h-5 w-5" />,
      active: pathname === "/tools/optimization",
    },
    {
      href: "/tools/plugins",
      label: "Plugins",
      icon: <Package className="h-5 w-5" />,
      active: pathname === "/tools/plugins",
    },
  ]

  // Mobile bottom navigation - show only the most important items
  const bottomNavRoutes = [
    routes[0], // Home
    routes[1], // Startup Flags
    routes[4], // MOTD
    routes[5], // Downloads
    routes[9], // Plugins
  ]

  // Tablet navigation - icon only with tooltips
  const tabletNavRoutes = routes.slice(0, 7) // Show first 7 items

  return (
    <>
      {/* Hamburger menu for mobile and tablet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetTitle className="sr-only">Main menu</SheetTitle>
          <div className="flex flex-col gap-4 py-4">
            <Link href="/" className="flex items-center px-2" onClick={() => setOpen(false)}>
              <span className="font-bold text-xl">MCTool</span>
            </Link>
            <nav className="flex flex-col gap-2">
              {routes.map((route, index) => (
                <motion.div
                  key={route.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    variant={route.active ? "default" : "ghost"}
                    className={cn(
                      "justify-start w-full",
                      route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                    asChild
                  >
                    <Link href={route.href} onClick={() => setOpen(false)}>
                      {route.icon}
                      <span className="ml-2">{route.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Tablet navigation - icon only with tooltips (visible on medium screens) */}
      <div className="hidden md:flex lg:flex">
        <TooltipProvider>
          <nav className="flex items-center space-x-1">
            {routes.map((route) => (
              <Tooltip key={route.href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant={route.active ? "default" : "ghost"}
                    size="icon"
                    className={cn(route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                    asChild
                  >
                    <Link href={route.href}>
                      {route.icon}
                      <span className="sr-only">{route.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{route.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}


          </nav>
        </TooltipProvider>
      </div>

      {/* Bottom navigation for mobile */}
      <AnimatePresence>
        {pathname && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t shadow-lg"
          >
            <div className="flex justify-around items-center h-16">
              {bottomNavRoutes.map((route) => (
                <TooltipProvider key={route.href}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={route.href}
                        className={cn(
                          "flex flex-col items-center justify-center h-full w-full",
                          route.active ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {route.icon}

                        {route.active && (
                          <motion.div
                            layoutId="bottomNavIndicator"
                            className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-md"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {showTooltip && (
                      <TooltipContent side="top" className="mb-1">
                        <p>{route.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}

              <Button
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center h-full w-full rounded-none text-muted-foreground"
                onClick={() => setOpen(true)}
              >
                <motion.div initial={{ scale: 1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
