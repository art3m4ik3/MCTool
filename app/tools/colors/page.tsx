"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, Check, Search } from "lucide-react"

export default function ColorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const minecraftColors = [
    { name: "Black", code: "§0", hex: "#000000" },
    { name: "Dark Blue", code: "§1", hex: "#0000AA" },
    { name: "Dark Green", code: "§2", hex: "#00AA00" },
    { name: "Dark Aqua", code: "§3", hex: "#00AAAA" },
    { name: "Dark Red", code: "§4", hex: "#AA0000" },
    { name: "Dark Purple", code: "§5", hex: "#AA00AA" },
    { name: "Gold", code: "§6", hex: "#FFAA00" },
    { name: "Gray", code: "§7", hex: "#AAAAAA" },
    { name: "Dark Gray", code: "§8", hex: "#555555" },
    { name: "Blue", code: "§9", hex: "#5555FF" },
    { name: "Green", code: "§a", hex: "#55FF55" },
    { name: "Aqua", code: "§b", hex: "#55FFFF" },
    { name: "Red", code: "§c", hex: "#FF5555" },
    { name: "Light Purple", code: "§d", hex: "#FF55FF" },
    { name: "Yellow", code: "§e", hex: "#FFFF55" },
    { name: "White", code: "§f", hex: "#FFFFFF" },
  ]

  const formatCodes = [
    { name: "Bold", code: "§l", description: "Makes text bold" },
    { name: "Italic", code: "§o", description: "Makes text italic" },
    { name: "Underline", code: "§n", description: "Underlines text" },
    { name: "Strikethrough", code: "§m", description: "Adds strikethrough to text" },
    { name: "Obfuscated", code: "§k", description: "Makes text appear randomly changing (obfuscated)" },
    { name: "Reset", code: "§r", description: "Resets all formatting" },
  ]

  const filteredColors = minecraftColors.filter((color) => color.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredFormats = formatCodes.filter((format) => format.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Color Palette</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Access Minecraft color codes and formatting options</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search colors and formats..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="colors">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="colors">Color Codes</TabsTrigger>
          <TabsTrigger value="formats">Format Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredColors.map((color) => (
              <Card key={color.code} className="overflow-hidden">
                <div className="h-16 w-full" style={{ backgroundColor: color.hex }} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{color.name}</CardTitle>
                  <CardDescription>{color.hex}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-mono bg-muted px-2 py-1 rounded text-sm">{color.code}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => copyToClipboard(color.code)}>
                    {copied === color.code ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" /> Copy Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formats" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFormats.map((format) => (
              <Card key={format.code}>
                <CardHeader>
                  <CardTitle className="text-lg">{format.name}</CardTitle>
                  <CardDescription>{format.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-mono bg-muted px-2 py-1 rounded text-sm">{format.code}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => copyToClipboard(format.code)}>
                    {copied === format.code ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" /> Copy Code
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
