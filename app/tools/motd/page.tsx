"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, Check } from "lucide-react"

export default function MotdGeneratorPage() {
  const [line1, setLine1] = useState("§6§lMinecraft §r§eServer")
  const [line2, setLine2] = useState("§aWelcome to our server!")
  const [copied, setCopied] = useState(false)

  const colorCodes = [
    { code: "§0", color: "#000000", name: "Black" },
    { code: "§1", color: "#0000AA", name: "Dark Blue" },
    { code: "§2", color: "#00AA00", name: "Dark Green" },
    { code: "§3", color: "#00AAAA", name: "Dark Aqua" },
    { code: "§4", color: "#AA0000", name: "Dark Red" },
    { code: "§5", color: "#AA00AA", name: "Dark Purple" },
    { code: "§6", color: "#FFAA00", name: "Gold" },
    { code: "§7", color: "#AAAAAA", name: "Gray" },
    { code: "§8", color: "#555555", name: "Dark Gray" },
    { code: "§9", color: "#5555FF", name: "Blue" },
    { code: "§a", color: "#55FF55", name: "Green" },
    { code: "§b", color: "#55FFFF", name: "Aqua" },
    { code: "§c", color: "#FF5555", name: "Red" },
    { code: "§d", color: "#FF55FF", name: "Light Purple" },
    { code: "§e", color: "#FFFF55", name: "Yellow" },
    { code: "§f", color: "#FFFFFF", name: "White" },
  ]

  const formatCodes = [
    { code: "§l", name: "Bold" },
    { code: "§o", name: "Italic" },
    { code: "§n", name: "Underline" },
    { code: "§m", name: "Strikethrough" },
    { code: "§k", name: "Obfuscated" },
    { code: "§r", name: "Reset" },
  ]

  const templates = [
    {
      name: "Classic Server",
      line1: "§6§lMinecraft §r§eServer",
      line2: "§aWelcome to our server!",
    },
    {
      name: "Survival",
      line1: "§2§lSurvival §r§aAdventure",
      line2: "§7Can you survive the night?",
    },
    {
      name: "Factions",
      line1: "§c§lFACTIONS §r§4PVP",
      line2: "§eCreate a faction and dominate!",
    },
    {
      name: "Skyblock",
      line1: "§b§lSky§f§lBlock",
      line2: "§3Build your island in the sky!",
    },
    {
      name: "Creative",
      line1: "§d§lCreative §r§5Building",
      line2: "§fLet your imagination run wild!",
    },
  ]

  const applyTemplate = (template: (typeof templates)[0]) => {
    setLine1(template.line1)
    setLine2(template.line2)
  }

  const insertCode = (code: string, lineNumber: 1 | 2) => {
    if (lineNumber === 1) {
      setLine1(line1 + code)
    } else {
      setLine2(line2 + code)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${line1}\n${line2}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderColoredText = (text: string) => {
    const result = []
    let currentColor = "#FFFFFF"
    let isBold = false
    let isItalic = false
    let isUnderline = false
    let isStrikethrough = false
    let isObfuscated = false

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "§" && i + 1 < text.length) {
        const code = text[i + 1]

        // Handle hex color codes (§xRRGGBB)
        if (code === 'x' && i + 13 < text.length) {
          let hex = '#'
          // Extract the 6 hex digits from §xRRGGBB format
          for (let j = 0; j < 6; j++) {
            hex += text[i + 3 + j * 2]
          }
          currentColor = hex
          i += 13 // Skip over §x and the 6 color code pairs
          continue
        }

        // Handle color codes
        const colorCode = colorCodes.find((c) => c.code === `§${code}`)
        if (colorCode) {
          currentColor = colorCode.color
          i++ // Skip the next character
          continue
        }

        // Handle format codes
        if (code === "l") {
          isBold = true
          i++
          continue
        }
        if (code === "o") {
          isItalic = true
          i++
          continue
        }
        if (code === "n") {
          isUnderline = true
          i++
          continue
        }
        if (code === "m") {
          isStrikethrough = true
          i++
          continue
        }
        if (code === "k") {
          isObfuscated = true
          i++
          continue
        }
        if (code === "r") {
          currentColor = "#FFFFFF"
          isBold = false
          isItalic = false
          isUnderline = false
          isStrikethrough = false
          isObfuscated = false
          i++
          continue
        }
      }

      const style: React.CSSProperties = { color: currentColor }
      if (isBold) style.fontWeight = "bold"
      if (isItalic) style.fontStyle = "italic"
      if (isUnderline) style.textDecoration = "underline"
      if (isStrikethrough) style.textDecoration = isUnderline ? "underline line-through" : "line-through"

      let char = text[i]
      if (isObfuscated) {
        char = "!@#$%^&*"[Math.floor(Math.random() * 8)]
      }

      result.push(
        <span key={i} style={style}>
          {char}
        </span>,
      )
    }

    return result
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft MOTD Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create custom Message of the Day for your Minecraft server
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MOTD Editor</CardTitle>
              <CardDescription>Create your custom server message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Line 1</label>
                <Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="First line of your MOTD" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Line 2</label>
                <Input
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Second line of your MOTD"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="formats">Formats</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Codes</CardTitle>
                  <CardDescription>Click on a color to add it to your MOTD</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {colorCodes.map((color) => (
                      <div key={color.code} className="space-y-1">
                        <button
                          className="w-full h-8 rounded-md border"
                          style={{ backgroundColor: color.color }}
                          onClick={() => insertCode(color.code, 1)}
                          title={`${color.name} (${color.code})`}
                        />
                        <div className="text-xs text-center">{color.code}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="formats" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Format Codes</CardTitle>
                  <CardDescription>Click on a format to add it to your MOTD</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {formatCodes.map((format) => (
                      <Button
                        key={format.code}
                        variant="outline"
                        className="w-full"
                        onClick={() => insertCode(format.code, 1)}
                      >
                        {format.name}
                        <span className="text-xs ml-1">({format.code})</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Choose a template to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <Button
                        key={template.name}
                        variant="outline"
                        className="justify-start h-auto py-3"
                        onClick={() => applyTemplate(template)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {renderColoredText(template.line1)}
                            <br />
                            {renderColoredText(template.line2)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your MOTD will look in-game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 text-white p-4 rounded-md font-minecraft">
                <div className="mb-1">{renderColoredText(line1)}</div>
                <div>{renderColoredText(line2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>Copy this to your server.properties file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  motd={line1}\n{line2}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={copyToClipboard} className="w-full">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" /> Copy to Clipboard
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
