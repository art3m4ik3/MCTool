"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, ExternalLink, Search, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// API and type definitions for server cores
interface VanillaApi { type: 'vanilla'; manifestUrl: string }
interface PapermcApi { type: 'papermc'; project: string }
interface PurpurApi { type: 'purpur'; project: string; baseUrl: string }
type ApiType = VanillaApi | PapermcApi | PurpurApi | null
interface ServerType {
  name: string;
  description: string;
  logoUrl: string;
  siteUrl: string;
  api: ApiType;
  versions: string[];
}

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  // Selected version per server type
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({})
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const initialServerTypes: ServerType[] = [
    { name: "Vanilla", description: "Official Minecraft server", logoUrl: "https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon-32x32.png", siteUrl: "https://www.minecraft.net/en-us/download/server", api: { type: 'vanilla', manifestUrl: 'https://launchermeta.mojang.com/mc/game/version_manifest.json' }, versions: [] },
    { name: "Paper", description: "High performance fork", logoUrl: "https://papermc.io/favicon.ico", siteUrl: "https://papermc.io/software/paper", api: { type: 'papermc', project: 'paper' }, versions: [] },
    { name: "Purpur", description: "Configurable Paper fork", logoUrl: "https://purpurmc.org/favicon.ico", siteUrl: "https://purpurmc.org/", api: { type: 'purpur', project: 'purpur', baseUrl: 'https://api.purpurmc.org' }, versions: [] },
    { name: "Folia", description: "Async Paper fork", logoUrl: "https://papermc.io/favicon.ico", siteUrl: "https://papermc.io/software/folia", api: { type: 'papermc', project: 'folia' }, versions: [] },
    { name: "Velocity", description: "Proxy", logoUrl: "https://avatars.githubusercontent.com/u/41710604?s=32", siteUrl: "https://papermc.io/software/velocity", api: { type: 'papermc', project: 'velocity' }, versions: [] },
  ]
  const [serverTypes, setServerTypes] = useState<ServerType[]>(initialServerTypes)

  // Load versions from APIs on mount
  useEffect(() => {
    (async () => {
      const updated = await Promise.all(serverTypes.map(async (type) => {
        if (!type.api) return type
        try {
          if (type.api.type === 'vanilla') {
            const manifest: any = await fetch(type.api.manifestUrl, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
            const ids: string[] = (manifest.versions as any[])
              .filter((v: any) => v.type === 'release')
              .map((v: any) => v.id)
            ids.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
            return { ...type, versions: ids }
          } else if (type.api.type === 'papermc') {
            const proj: any = await fetch(`https://api.papermc.io/v2/projects/${type.api.project}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
            const papervers: string[] = proj.versions as string[]
            papervers.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
            return { ...type, versions: papervers }
          } else if (type.api.type === 'purpur') {
            const proj: any = await fetch(`${type.api.baseUrl}/v2/${type.api.project}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
            const purpversions: string[] = proj.versions as string[]
            purpversions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }))
            return { ...type, versions: purpversions }
          }
        } catch {
          return type
        }
        return type
      }))
      setServerTypes(updated)
      // Initialize selected version for each core
      const initMap: Record<string, string> = {}
      updated.forEach((t) => { if (t.versions.length) initMap[t.name] = t.versions[0] })
      setSelectedVersions(initMap)
    })()
  }, [])

  const filteredServerTypes = serverTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDirectDownload = async (serverType: ServerType, version: string) => {
    setIsDownloading(serverType.name)
    try {
      // If no API, open core homepage
      if (!serverType.api) {
        window.open(serverType.siteUrl, "_blank")
        return
      }
      let url: string | undefined
      if (serverType.api.type === 'vanilla') {
        const manifest: any = await fetch(serverType.api.manifestUrl, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
        const info: any = (manifest.versions as any[]).find((v: any) => v.id === version)
        if (info?.url) {
          const details: any = await fetch(info.url, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
          url = details.downloads.server.url
        }
      } else if (serverType.api.type === 'papermc') {
        const vData: any = await fetch(`https://api.papermc.io/v2/projects/${serverType.api.project}/versions/${version}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
        const build = vData.builds[vData.builds.length - 1]
        const dl: any = await fetch(`https://api.papermc.io/v2/projects/${serverType.api.project}/versions/${version}/builds/${build}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
        const downloads = dl.downloads as Record<string, { name: string }>
        const entry = (downloads.application as any) ?? Object.values(downloads)[0]
        url = `https://api.papermc.io/v2/projects/${serverType.api.project}/versions/${version}/builds/${build}/downloads/${entry.name}`
      } else if (serverType.api.type === 'purpur') {
        const pData: any = await fetch(`${serverType.api.baseUrl}/v2/${serverType.api.project}/${version}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }).then(r => r.json())
        const build = pData.builds.latest
        url = `${serverType.api.baseUrl}/v2/${serverType.api.project}/${version}/${build}/download`
      }
      if (!url) {
        window.open(serverType.siteUrl, "_blank")
        return
      }
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${serverType.name.toLowerCase()}-${version}.jar`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({ title: "Download Complete", description: `${serverType.name} ${version} downloaded.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Download Failed", description: "Error downloading server core.", action: <ToastAction altText="Try again">Try Again</ToastAction> })
    } finally {
      setIsDownloading(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Server Downloads</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Download various Minecraft server core versions</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search server types..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServerTypes.map((serverType) => (
          <Card key={serverType.name} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={serverType.logoUrl || "/icon.png"}
                  alt={`${serverType.name} logo`}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <CardTitle>{serverType.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{serverType.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Label htmlFor={`${serverType.name}-version`}>Select Version</Label>
                <Select
                  value={selectedVersions[serverType.name] || ""}
                  onValueChange={(v) => setSelectedVersions((prev) => ({ ...prev, [serverType.name]: v }))}
                >
                  <SelectTrigger id={`${serverType.name}-version`}>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {(serverType.versions || []).map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleDirectDownload(serverType, selectedVersions[serverType.name] || "")}
                disabled={isDownloading !== null}
              >
                {isDownloading === serverType.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <a href={serverType.siteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Website
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
