"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clipboard, Check, Plus, Trash2 } from "lucide-react"

export default function GradientGeneratorPage() {
  const [colors, setColors] = useState(["#ff5555", "#55ffff"])
  const [steps, setSteps] = useState(10)
  const [gradientColors, setGradientColors] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [outputFormat, setOutputFormat] = useState<"hex" | "minecraft">("minecraft")
  const [textInput, setTextInput] = useState("")
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  useEffect(() => {
    generateGradient()
  }, [colors, steps])

  const generateGradient = () => {
    const result: string[] = []
    const n = colors.length
    for (let i = 0; i < steps; i++) {
      const t = steps === 1 ? 0 : i / (steps - 1)
      const segmentCount = Math.max(n - 1, 1)
      const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1)
      const t0 = segment / segmentCount
      const t1 = (segment + 1) / segmentCount
      const localT = (t - t0) / (t1 - t0)
      const startColor = colors[segment]
      const endColor = colors[segment + 1] || colors[segment]
      const r = Math.round(
        interpolate(
          parseInt(startColor.slice(1, 3), 16),
          parseInt(endColor.slice(1, 3), 16),
          localT
        )
      )
      const g = Math.round(
        interpolate(
          parseInt(startColor.slice(3, 5), 16),
          parseInt(endColor.slice(3, 5), 16),
          localT
        )
      )
      const b = Math.round(
        interpolate(
          parseInt(startColor.slice(5, 7), 16),
          parseInt(endColor.slice(5, 7), 16),
          localT
        )
      )
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
      result.push(hex)
    }
    setGradientColors(result)
  }

  const interpolate = (a: number, b: number, ratio: number) => {
    return a + (b - a) * ratio
  }

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, "#ffffff"])
    }
  }

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = [...colors]
      newColors.splice(index, 1)
      setColors(newColors)
    }
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const hexToMinecraftCode = (hex: string) => {
    // Simple mapping of hex colors to Minecraft color codes
    const colorMap: Record<string, string> = {
      "#000000": "§0", // Black
      "#0000AA": "§1", // Dark Blue
      "#00AA00": "§2", // Dark Green
      "#00AAAA": "§3", // Dark Aqua
      "#AA0000": "§4", // Dark Red
      "#AA00AA": "§5", // Dark Purple
      "#FFAA00": "§6", // Gold
      "#AAAAAA": "§7", // Gray
      "#555555": "§8", // Dark Gray
      "#5555FF": "§9", // Blue
      "#55FF55": "§a", // Green
      "#55FFFF": "§b", // Aqua
      "#FF5555": "§c", // Red
      "#FF55FF": "§d", // Light Purple
      "#FFFF55": "§e", // Yellow
      "#FFFFFF": "§f", // White
    }

    // Find the closest color
    let closestColor = "#FFFFFF"
    let minDistance = Number.MAX_VALUE

    Object.keys(colorMap).forEach((mapHex) => {
      const distance = colorDistance(hex, mapHex)
      if (distance < minDistance) {
        minDistance = distance
        closestColor = mapHex
      }
    })

    return colorMap[closestColor] || "§f"
  }

  const hexToMinecraftHexCode = (hex: string) => {
    return '§x' + hex
      .slice(1)
      .split("")
      .map((c) => `§${c}`)
      .join("")
  }

  const colorDistance = (hex1: string, hex2: string) => {
    const r1 = Number.parseInt(hex1.slice(1, 3), 16)
    const g1 = Number.parseInt(hex1.slice(3, 5), 16)
    const b1 = Number.parseInt(hex1.slice(5, 7), 16)

    const r2 = Number.parseInt(hex2.slice(1, 3), 16)
    const g2 = Number.parseInt(hex2.slice(3, 5), 16)
    const b2 = Number.parseInt(hex2.slice(5, 7), 16)

    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
  }

  const getOutputText = () => {
    if (outputFormat === "hex") {
      if (textInput) {
        return textInput
          .split("")
          .map((char, index) => {
            const idx = Math.floor(
              (index / Math.max(textInput.length - 1, 1)) *
              (gradientColors.length - 1)
            )
            return gradientColors[idx] + char
          })
          .join("")
      }
      return gradientColors.join(", ")
    } else {
      if (textInput) {
        return textInput
          .split("")
          .map((char, index) => {
            const idx = Math.floor(
              (index / Math.max(textInput.length - 1, 1)) *
              (gradientColors.length - 1)
            )
            const color = gradientColors[idx]
            return hexToMinecraftHexCode(color) + char
          })
          .join("")
      }
      return gradientColors.map(hexToMinecraftHexCode).join("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getOutputText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (error) {
      console.error("Copy failed", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Gradient Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautiful color gradients for your Minecraft server or projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Selection</CardTitle>
              <CardDescription>Choose colors for your gradient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: color }} />
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1"
                  />
                  {colors.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeColor(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {colors.length < 5 && (
                <Button variant="outline" onClick={addColor} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Color
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gradient Options</CardTitle>
              <CardDescription>Customize your gradient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="steps">Number of Steps</Label>
                  <span className="text-sm font-medium">{steps}</span>
                </div>
                <Slider
                  id="steps"
                  min={2}
                  max={30}
                  step={1}
                  value={[steps]}
                  onValueChange={(value) => setSteps(value[0])}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-20 w-full rounded-md flex overflow-hidden">
                {gradientColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => copyColor(color)}
                    className="relative cursor-pointer"
                    style={{ backgroundColor: color, width: `${100 / gradientColors.length}%` }}
                  >
                    {copiedColor === color && (
                      <Check className="absolute inset-0 m-auto text-white" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {gradientColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => copyColor(color)}
                    className="relative w-8 h-8 rounded-md border cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={`Click to copy ${color}`}
                  >
                    {copiedColor === color && (
                      <Check className="absolute inset-0 m-auto text-white opacity-75" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <Tabs defaultValue="minecraft" onValueChange={(v) => setOutputFormat(v as "hex" | "minecraft")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="minecraft">Minecraft</TabsTrigger>
                  <TabsTrigger value="hex">Hex</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Enter text to apply gradient"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="mb-2 w-full"
              />
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-all">{getOutputText()}</pre>
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
