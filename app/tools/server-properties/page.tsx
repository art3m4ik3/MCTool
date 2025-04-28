"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Clipboard, Check, Download, Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

interface ServerProperty {
  key: string
  value: string
  type: "text" | "boolean" | "number" | "select"
  options?: string[]
  min?: number
  max?: number
  step?: number
  category: string
  description: string
}

export default function ServerPropertiesPage() {
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const defaultProperties: ServerProperty[] = [
    {
      key: "server-port",
      value: "25565",
      type: "number",
      min: 1,
      max: 65535,
      category: "network",
      description: "The port your server will listen on",
    },
    {
      key: "server-ip",
      value: "",
      type: "text",
      category: "network",
      description: "The IP address your server will bind to. Leave blank to bind to all addresses.",
    },
    {
      key: "max-players",
      value: "20",
      type: "number",
      min: 1,
      max: 2000,
      category: "gameplay",
      description: "The maximum number of players allowed on the server at once",
    },
    {
      key: "gamemode",
      value: "survival",
      type: "select",
      options: ["survival", "creative", "adventure", "spectator"],
      category: "gameplay",
      description: "The default game mode for new players",
    },
    {
      key: "difficulty",
      value: "easy",
      type: "select",
      options: ["peaceful", "easy", "normal", "hard"],
      category: "gameplay",
      description: "The difficulty level of the server",
    },
    {
      key: "pvp",
      value: "true",
      type: "boolean",
      category: "gameplay",
      description: "Whether players can fight each other",
    },
    {
      key: "hardcore",
      value: "false",
      type: "boolean",
      category: "gameplay",
      description: "If true, players are banned upon death",
    },
    {
      key: "allow-nether",
      value: "true",
      type: "boolean",
      category: "world",
      description: "Whether the Nether is allowed",
    },
    {
      key: "allow-flight",
      value: "false",
      type: "boolean",
      category: "gameplay",
      description: "Whether flying is allowed in survival mode",
    },
    {
      key: "spawn-npcs",
      value: "true",
      type: "boolean",
      category: "world",
      description: "Whether NPCs (villagers) can spawn",
    },
    {
      key: "spawn-animals",
      value: "true",
      type: "boolean",
      category: "world",
      description: "Whether animals can spawn",
    },
    {
      key: "spawn-monsters",
      value: "true",
      type: "boolean",
      category: "world",
      description: "Whether monsters can spawn",
    },
    {
      key: "generate-structures",
      value: "true",
      type: "boolean",
      category: "world",
      description: "Whether structures (villages, strongholds, etc.) are generated",
    },
    {
      key: "view-distance",
      value: "10",
      type: "number",
      min: 3,
      max: 32,
      category: "performance",
      description: "The number of chunks sent to players (radius)",
    },
    {
      key: "simulation-distance",
      value: "10",
      type: "number",
      min: 3,
      max: 32,
      category: "performance",
      description: "The number of chunks that are being tick updated (radius)",
    },
    {
      key: "spawn-protection",
      value: "16",
      type: "number",
      min: 0,
      max: 100,
      category: "protection",
      description: "Radius of spawn area protected from non-ops (0 to disable)",
    },
    {
      key: "max-world-size",
      value: "29999984",
      type: "number",
      min: 1,
      max: 29999984,
      category: "world",
      description: "Maximum radius of the world in blocks",
    },
    {
      key: "level-name",
      value: "world",
      type: "text",
      category: "world",
      description: "The name of your world",
    },
    {
      key: "level-seed",
      value: "",
      type: "text",
      category: "world",
      description: "Seed for world generation (leave blank for random)",
    },
    {
      key: "level-type",
      value: "minecraft\\:normal",
      type: "select",
      options: [
        "minecraft\\:normal",
        "minecraft\\:flat",
        "minecraft\\:large_biomes",
        "minecraft\\:amplified",
        "minecraft\\:single_biome_surface",
      ],
      category: "world",
      description: "The type of world to generate",
    },
    {
      key: "enable-command-block",
      value: "false",
      type: "boolean",
      category: "gameplay",
      description: "Whether command blocks are enabled",
    },
    {
      key: "motd",
      value: "A Minecraft Server",
      type: "text",
      category: "network",
      description: "Message of the day (server description shown in the server list)",
    },
    {
      key: "query.port",
      value: "25565",
      type: "number",
      min: 1,
      max: 65535,
      category: "network",
      description: "Port for GameSpy4 protocol server query",
    },
    {
      key: "enable-status",
      value: "true",
      type: "boolean",
      category: "network",
      description: "Whether the server appears in the server list",
    },
    {
      key: "enable-query",
      value: "false",
      type: "boolean",
      category: "network",
      description: "Whether GameSpy4 protocol server query is enabled",
    },
    {
      key: "player-idle-timeout",
      value: "0",
      type: "number",
      min: 0,
      max: 60,
      category: "gameplay",
      description: "Kick players after inactivity in minutes (0 to disable)",
    },
    {
      key: "force-gamemode",
      value: "false",
      type: "boolean",
      category: "gameplay",
      description: "Force players to join in the default gamemode",
    },
    {
      key: "white-list",
      value: "false",
      type: "boolean",
      category: "protection",
      description: "Whether the whitelist is enabled",
    },
    {
      key: "enforce-whitelist",
      value: "false",
      type: "boolean",
      category: "protection",
      description: "Enforce the whitelist even after the server has started",
    },
    {
      key: "online-mode",
      value: "true",
      type: "boolean",
      category: "protection",
      description: "Whether the server checks connecting players against Minecraft account database",
    },
    {
      key: "prevent-proxy-connections",
      value: "false",
      type: "boolean",
      category: "protection",
      description: "Whether to prevent users from connecting through VPNs or proxies",
    },
    {
      key: "use-native-transport",
      value: "true",
      type: "boolean",
      category: "performance",
      description: "Whether to use optimized packet sending (Linux only)",
    },
    {
      key: "enable-rcon",
      value: "false",
      type: "boolean",
      category: "network",
      description: "Whether to enable remote access to the server console",
    },
    {
      key: "rcon.port",
      value: "25575",
      type: "number",
      min: 1,
      max: 65535,
      category: "network",
      description: "Port for RCON",
    },
    {
      key: "rcon.password",
      value: "",
      type: "text",
      category: "network",
      description: "Password for RCON (required if RCON is enabled)",
    },
    {
      key: "resource-pack",
      value: "",
      type: "text",
      category: "gameplay",
      description: "URL to a resource pack that players will be prompted to download",
    },
    {
      key: "resource-pack-sha1",
      value: "",
      type: "text",
      category: "gameplay",
      description: "SHA-1 digest of the resource pack (leave blank if not using a resource pack)",
    },
    {
      key: "require-resource-pack",
      value: "false",
      type: "boolean",
      category: "gameplay",
      description: "Whether players must accept the resource pack to join",
    },
    {
      key: "network-compression-threshold",
      value: "256",
      type: "number",
      min: -1,
      max: 1024,
      category: "performance",
      description: "Threshold for compression in bytes (-1 to disable)",
    },
    {
      key: "rate-limit",
      value: "0",
      type: "number",
      min: 0,
      max: 1000,
      category: "protection",
      description: "Maximum number of login attempts per IP (0 to disable)",
    },
    {
      key: "entity-broadcast-range-percentage",
      value: "100",
      type: "number",
      min: 10,
      max: 1000,
      category: "performance",
      description: "Entity tracking range percentage (lower values improve performance)",
    },
  ]

  const [properties, setProperties] = useState<ServerProperty[]>(defaultProperties)

  const categories = [
    { id: "all", name: "All Settings" },
    { id: "gameplay", name: "Gameplay" },
    { id: "world", name: "World Generation" },
    { id: "network", name: "Network" },
    { id: "performance", name: "Performance" },
    { id: "protection", name: "Protection" },
  ]

  const updateProperty = (key: string, value: string) => {
    setProperties((prev) => prev.map((prop) => (prop.key === key ? { ...prop, value } : prop)))
  }

  const generateServerProperties = () => {
    return properties.map((prop) => `${prop.key}=${prop.value}`).join("\n")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateServerProperties())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadServerProperties = () => {
    const content = generateServerProperties()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "server.properties"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "File Downloaded",
      description: "server.properties has been downloaded successfully.",
    })
  }

  const resetToDefault = () => {
    setProperties(defaultProperties)
    toast({
      title: "Reset Complete",
      description: "All settings have been reset to default values.",
    })
  }

  const filterProperties = (category: string) => {
    if (searchTerm) {
      return properties.filter(
        (prop) =>
          (category === "all" || prop.category === category) &&
          (prop.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prop.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    return properties.filter((prop) => category === "all" || prop.category === category)
  }

  const renderPropertyInput = (property: ServerProperty) => {
    switch (property.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={property.key}
              checked={property.value === "true"}
              onCheckedChange={(checked) => updateProperty(property.key, checked ? "true" : "false")}
            />
            <Label htmlFor={property.key}>{property.value === "true" ? "Enabled" : "Disabled"}</Label>
          </div>
        )

      case "number":
        if (property.min !== undefined && property.max !== undefined) {
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{property.value}</span>
                <Input
                  type="number"
                  id={property.key}
                  value={property.value}
                  onChange={(e) => updateProperty(property.key, e.target.value)}
                  min={property.min}
                  max={property.max}
                  step={property.step || 1}
                  className="w-20 ml-2"
                />
              </div>
              <Slider
                value={[Number.parseInt(property.value)]}
                min={property.min}
                max={property.max}
                step={property.step || 1}
                onValueChange={(value) => updateProperty(property.key, value[0].toString())}
              />
            </div>
          )
        }
        return (
          <Input
            type="number"
            id={property.key}
            value={property.value}
            onChange={(e) => updateProperty(property.key, e.target.value)}
            min={property.min}
            max={property.max}
            step={property.step || 1}
          />
        )

      case "select":
        return (
          <Select value={property.value} onValueChange={(value) => updateProperty(property.key, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {property.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace("minecraft\\:", "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            type="text"
            id={property.key}
            value={property.value}
            onChange={(e) => updateProperty(property.key, e.target.value)}
          />
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Server.properties Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure your Minecraft server settings with an easy-to-use interface
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  {filterProperties(category.id).map((property) => (
                    <AccordionItem key={property.key} value={property.key}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <span className="font-mono text-sm">{property.key}</span>
                          <span className="text-xs text-muted-foreground">{property.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">{renderPropertyInput(property)}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>server.properties</CardTitle>
              <CardDescription>Preview of your configuration file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md overflow-x-auto max-h-[400px] overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">{generateServerProperties()}</pre>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" /> Copy
                  </>
                )}
              </Button>
              <Button onClick={downloadServerProperties} className="flex-1">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
