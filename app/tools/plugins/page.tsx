"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Star, Filter, Loader2, AlertCircle, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Plugin {
  id: string
  slug: string
  title: string
  description: string
  categories: string[]
  downloads: number
  icon_url?: string
  author: string
  versions: string[]
  latest_version: string
  date_created: string
  date_modified: string
  project_type: string
  server_side: string
  client_side: string
  gallery?: string[]
  featured_gallery?: string
  license?: string
  website_url?: string
  donation_urls?: { id: string; platform: string; url: string }[]
  source_url?: string
}

interface Version {
  id: string
  project_id: string
  author_id: string
  featured: boolean
  name: string
  version_number: string
  changelog: string
  changelog_url: string | null
  date_published: string
  downloads: number
  version_type: string
  files: {
    hashes: {
      sha1: string
      sha512: string
    }
    url: string
    filename: string
    primary: boolean
    size: number
    file_type: string | null
  }[]
  dependencies: any[]
  game_versions: string[]
  loaders: string[]
}

export default function PluginsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("downloads")
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>("")
  const [pluginVersions, setPluginVersions] = useState<Version[]>([])
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [gameVersion, setGameVersion] = useState("1.20.4")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const gameVersions = [
    "1.20.4",
    "1.20.2",
    "1.20.1",
    "1.19.4",
    "1.19.3",
    "1.19.2",
    "1.18.2",
    "1.18.1",
    "1.17.1",
    "1.16.5",
  ]

  useEffect(() => {
    const fetchPlugins = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch plugins from Modrinth API
        const response = await fetch(
          `https://api.modrinth.com/v2/search?query=${searchTerm}&facets=[["project_type:plugin"],["versions:${gameVersion}"]]&limit=20&offset=${(currentPage - 1) * 20}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch plugins")
        }

        const data = await response.json()
        setPlugins(data.hits)
        setFilteredPlugins(data.hits)
        setTotalPages(data.total_hits ? Math.ceil(data.total_hits / 20) : 1)
      } catch (err) {
        console.error("Error fetching plugins:", err)
        setError("Failed to load plugins. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlugins()
  }, [searchTerm, gameVersion, currentPage])

  useEffect(() => {
    if (plugins.length > 0) {
      let filtered = [...plugins]

      // Sort plugins
      filtered.sort((a, b) => {
        if (sortBy === "downloads") {
          return b.downloads - a.downloads
        } else if (sortBy === "newest") {
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        } else if (sortBy === "updated") {
          return new Date(b.date_modified).getTime() - new Date(a.date_modified).getTime()
        } else if (sortBy === "name") {
          return a.title.localeCompare(b.title)
        }
        return 0
      })

      setFilteredPlugins(filtered)
    }
  }, [plugins, sortBy])

  const fetchPluginVersions = async (pluginSlug: string) => {
    setIsLoadingVersions(true)
    try {
      const response = await fetch(`https://api.modrinth.com/v2/project/${pluginSlug}/version`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } })
      if (!response.ok) {
        throw new Error("Failed to fetch plugin versions")
      }
      const data = await response.json()

      // Filter versions compatible with selected game version
      const compatibleVersions = data.filter((version: Version) => version.game_versions.includes(gameVersion))

      setPluginVersions(compatibleVersions)

      // Set default selected version to the latest one
      if (compatibleVersions.length > 0) {
        setSelectedVersion(compatibleVersions[0].id)
      } else {
        setSelectedVersion("")
      }
    } catch (err) {
      console.error("Error fetching plugin versions:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load plugin versions. Please try again.",
      })
    } finally {
      setIsLoadingVersions(false)
    }
  }

  const handlePluginSelect = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    fetchPluginVersions(plugin.slug)
  }

  const downloadPlugin = async () => {
    if (!selectedPlugin || !selectedVersion) return

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      // Find the selected version
      const version = pluginVersions.find((v) => v.id === selectedVersion)
      if (!version) throw new Error("Version not found")

      // Get the primary file to download
      const primaryFile = version.files.find((f) => f.primary) || version.files[0]
      if (!primaryFile) throw new Error("No download file found")

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      // Fetch the file
      const response = await fetch(primaryFile.url, { headers: { 'User-Agent': "McTool.pro Client/1.0" } })
      if (!response.ok) throw new Error("Failed to download file")

      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", primaryFile.filename)
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Complete the progress
      clearInterval(progressInterval)
      setDownloadProgress(100)

      toast({
        title: "Download Complete",
        description: `${selectedPlugin.title} has been downloaded successfully.`,
      })
    } catch (err) {
      console.error("Error downloading plugin:", err)
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error downloading the plugin.",
      })
    } finally {
      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
      }, 1000)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Plugins</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and download plugins directly from Modrinth for your Minecraft server
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={gameVersion} onValueChange={setGameVersion}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Game Version" />
            </SelectTrigger>
            <SelectContent>
              {gameVersions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downloads">Most Downloads</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="flex justify-center items-center gap-4 mb-6">
        <Button size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          First
        </Button>
        <Button size="sm" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button size="sm" onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </Button>
        <Button size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </Button>
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-16 rounded-full" />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full rounded-md" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredPlugins.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No plugins found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPlugins.map((plugin) => (
                <motion.div key={plugin.id} variants={itemVariants}>
                  <Card className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        {plugin.icon_url ? (
                          <img
                            src={plugin.icon_url || "/icon.png"}
                            alt={`${plugin.title} logo`}
                            className="w-12 h-12 object-contain rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-base">{plugin.title}</CardTitle>
                          <CardDescription className="line-clamp-1">by {plugin.author}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm line-clamp-3 mb-2">{plugin.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plugin.categories.slice(0, 3).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {formatNumber(plugin.downloads)}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {formatDate(plugin.date_modified)}
                        </div>
                      </div>

                      <Button size="sm" onClick={() => handlePluginSelect(plugin)}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                    <Skeleton className="w-12 h-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredPlugins.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No plugins found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {filteredPlugins.map((plugin) => (
                <motion.div key={plugin.id} variants={itemVariants}>
                  <Card>
                    <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                      {plugin.icon_url ? (
                        <img
                          src={plugin.icon_url || "/icon.png"}
                          alt={`${plugin.title} logo`}
                          className="w-12 h-12 object-contain rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold">{plugin.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{plugin.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plugin.categories.slice(0, 3).map((cat) => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {formatNumber(plugin.downloads)}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {formatDate(plugin.date_modified)}
                          </div>
                        </div>

                        <Button size="sm" onClick={() => handlePluginSelect(plugin)}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button size="sm" onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button size="sm" onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
      {/* Plugin download dialog */}
      {selectedPlugin && (
        <Dialog open={!!selectedPlugin} onOpenChange={(open) => !open && setSelectedPlugin(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Download {selectedPlugin?.title}</DialogTitle>
              <DialogDescription>Select a version to download for Minecraft {gameVersion}</DialogDescription>
            </DialogHeader>

            {isLoadingVersions ? (
              <div className="py-4 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : pluginVersions.length === 0 ? (
              <Alert className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No compatible versions</AlertTitle>
                <AlertDescription>No versions compatible with Minecraft {gameVersion} were found.</AlertDescription>
              </Alert>
            ) : (
              <div className="py-4">
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {pluginVersions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        {version.name} ({version.version_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedVersion && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Version Details</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pluginVersions.find((v) => v.id === selectedVersion)?.changelog || "No changelog available"}
                    </p>
                    <div className="text-sm">
                      <span className="font-medium">Published: </span>
                      {formatDate(pluginVersions.find((v) => v.id === selectedVersion)?.date_published || "")}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Supported Versions: </span>
                      {pluginVersions.find((v) => v.id === selectedVersion)?.game_versions.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isDownloading && (
              <div className="mb-4">
                <Progress value={downloadProgress} className="h-2" />
                <p className="text-xs text-center mt-1 text-muted-foreground">
                  {downloadProgress < 100 ? "Downloading..." : "Download complete!"}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={downloadPlugin}
                disabled={isDownloading || isLoadingVersions || !selectedVersion || pluginVersions.length === 0}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
