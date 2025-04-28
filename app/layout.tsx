import type React from "react"
import type { Metadata } from 'next'
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "MCTool",
  description: "A collection of useful tools for Minecraft server administrators and players",
  keywords: [
    "minecraft",
    "server",
    "tools",
    "utilities",
    "admin",
    "player",
    "server management",
    "minecraft server",
    "minecraft tools",
    "minecraft utilities",
    "mctool",
    "mctool.pro",
    "mc",
    "tools",
    "mctool.pro",
    "servers",
    "admins",
    "op",
    "ops",
    "permissions",
    "server list",
    "server management",
    "server tools",
    "server utilities",
  ],
  authors: [{ name: "art3m4ik3", url: "https://ll-u.pro" }],
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.ico'
  },
  openGraph: {
    title: 'MCTool',
    description: 'A collection of useful tools for Minecraft server administrators and players',
    url: 'https://mctool.pro',
    siteName: 'MC Tool',
    images: [
      { url: 'https://mctool.pro/favicon.png', width: 1024, height: 1024, alt: 'MCTool' }
    ],
    locale: 'en-US',
    type: 'website'
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}

import './globals.css'