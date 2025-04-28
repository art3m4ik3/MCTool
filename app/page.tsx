"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronRight,
  Flag,
  Palette,
  Download,
  MessageSquare,
  Layers,
  Users,
  Settings,
  Zap,
  Package,
} from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const tools = [
    {
      title: "Startup Flags Generator",
      description: "Generate and customize startup flags for your Minecraft server",
      icon: <Flag className="h-6 w-6" />,
      href: "/tools/startup-flags",
    },
    {
      title: "Gradient Generator",
      description: "Create custom color gradients for in-game elements or server branding",
      icon: <Palette className="h-6 w-6" />,
      href: "/tools/gradient",
    },
    {
      title: "Color Palette",
      description: "Access Minecraft-specific colors with codes and visual representations",
      icon: <Layers className="h-6 w-6" />,
      href: "/tools/colors",
    },
    {
      title: "MOTD Generator",
      description: "Design engaging server messages with custom formatting",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/tools/motd",
    },
    {
      title: "Minecraft Core Downloads",
      description: "Download various Minecraft server core versions",
      icon: <Download className="h-6 w-6" />,
      href: "/tools/downloads",
    },
    {
      title: "Whitelist Generator",
      description: "Generate whitelist.json files with player UUIDs",
      icon: <Users className="h-6 w-6" />,
      href: "/tools/whitelist",
    },
    {
      title: "Server Properties",
      description: "Configure your server.properties file with an easy interface",
      icon: <Settings className="h-6 w-6" />,
      href: "/tools/server-properties",
    },
    {
      title: "Optimization Guide",
      description: "Comprehensive guide to optimize your Minecraft server",
      icon: <Zap className="h-6 w-6" />,
      href: "/tools/optimization",
    },
    {
      title: "Plugins",
      description: "Discover and download popular Minecraft server plugins",
      icon: <Package className="h-6 w-6" />,
      href: "/tools/plugins",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">MCTool</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of useful tools for Minecraft server administrators and players
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool, index) => (
          <motion.div key={tool.title} variants={itemVariants}>
            <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col card-hover-effect">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {tool.icon}
                  </motion.div>
                  <CardTitle>{tool.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full justify-between group ">
                  <Link href={tool.href}>
                    Access Tool
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
