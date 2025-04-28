"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/mobile-nav"
import {
  Flag,
  Palette,
  Download,
  MessageSquare,
  Layers,
  Home,
  Users,
  Settings,
  Zap,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

export function MainNav() {
  const pathname = usePathname()
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-4 w-4" />,
      active: pathname === "/",
    },
    {
      href: "/tools/startup-flags",
      label: "Startup Flags",
      icon: <Flag className="h-4 w-4" />,
      active: pathname === "/tools/startup-flags",
    },
    {
      href: "/tools/gradient",
      label: "Gradient",
      icon: <Palette className="h-4 w-4" />,
      active: pathname === "/tools/gradient",
    },
    {
      href: "/tools/colors",
      label: "Colors",
      icon: <Layers className="h-4 w-4" />,
      active: pathname === "/tools/colors",
    },
    {
      href: "/tools/motd",
      label: "MOTD",
      icon: <MessageSquare className="h-4 w-4" />,
      active: pathname === "/tools/motd",
    },
    {
      href: "/tools/downloads",
      label: "Downloads",
      icon: <Download className="h-4 w-4" />,
      active: pathname === "/tools/downloads",
    },
    {
      href: "/tools/whitelist",
      label: "Whitelist",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/tools/whitelist",
    },
    {
      href: "/tools/server-properties",
      label: "Server Properties",
      icon: <Settings className="h-4 w-4" />,
      active: pathname === "/tools/server-properties",
    },
    {
      href: "/tools/optimization",
      label: "Optimization",
      icon: <Zap className="h-4 w-4" />,
      active: pathname === "/tools/optimization",
    },
    {
      href: "/tools/plugins",
      label: "Plugins",
      icon: <Package className="h-4 w-4" />,
      active: pathname === "/tools/plugins",
    },
  ]

  // Check if we need scroll buttons on medium screens
  useEffect(() => {
    const checkScroll = () => {
      const navElement = document.getElementById("desktop-nav")
      if (navElement) {
        setShowScrollButtons(navElement.scrollWidth > navElement.clientWidth)
        setCanScrollLeft(navElement.scrollLeft > 0)
        setCanScrollRight(navElement.scrollLeft < navElement.scrollWidth - navElement.clientWidth)
      }
    }

    // Initial check
    checkScroll()

    // Check on resize
    window.addEventListener("resize", checkScroll)

    // Check when nav scrolls
    const navElement = document.getElementById("desktop-nav")
    if (navElement) {
      navElement.addEventListener("scroll", checkScroll)
    }

    return () => {
      window.removeEventListener("resize", checkScroll)
      if (navElement) {
        navElement.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  const scrollNav = (direction: "left" | "right") => {
    const navElement = document.getElementById("desktop-nav")
    if (navElement) {
      const scrollAmount = 200 // Adjust as needed
      navElement.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 md:sticky md:top-0 md:z-50 md:block fixed bottom-0 left-0 right-0 md:static md:bottom-auto md:left-auto md:right-auto md:w-full md:border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <motion.span
              className="font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              MCTool
            </motion.span>
          </Link>
        </div>

        {/* Mobile title */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <motion.span
              className="font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              MCTool
            </motion.span>
          </Link>
        </div>

        {/* Right side items */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <MobileNav />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
