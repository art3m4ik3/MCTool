"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface MinecraftUser {
  name: string
  uuid: string
  error?: string
}

export default function WhitelistGeneratorPage() {
  const [usernames, setUsernames] = useState("")
  const [users, setUsers] = useState<MinecraftUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUUID = async (username: string): Promise<MinecraftUser> => {
    try {
      const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`, { headers: { 'User-Agent': "McTool.pro Client/1.0" } })

      if (!response.ok) {
        if (response.status === 404) {
          return { name: username, uuid: "", error: "User not found" }
        }
        throw new Error(`Error fetching UUID: ${response.statusText}`)
      }

      const data = await response.json()

      const uuid = data.uuid

      return { name: data.username, uuid }
    } catch (error) {
      console.error(`Error fetching UUID for ${username}:`, error)
      return {
        name: username,
        uuid: "",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const names = usernames
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0)

      if (names.length === 0) {
        setError("Please enter at least one username")
        setIsLoading(false)
        return
      }

      // Mojang API has rate limits, so we need to process usernames with a delay
      const results: MinecraftUser[] = []

      for (const name of names) {
        const user = await fetchUUID(name)
        results.push(user)
        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setUsers(results)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    // Filter out users with errors
    const validUsers = users.filter((user) => !user.error)

    if (validUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "No valid users",
        description: "There are no valid users to include in the whitelist file.",
      })
      return
    }

    // Create the whitelist.json content
    const whitelistContent = validUsers.map((user) => ({
      uuid: user.uuid,
      name: user.name,
    }))

    // Create a Blob with the JSON content
    const blob = new Blob([JSON.stringify(whitelistContent, null, 2)], { type: "application/json" })

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "whitelist.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Whitelist Generated",
      description: `whitelist.json with ${validUsers.length} users has been downloaded.`,
    })
  }

  const removeUser = (index: number) => {
    setUsers((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Whitelist.json Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate a whitelist.json file for your Minecraft server
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Minecraft Usernames</CardTitle>
              <CardDescription>Enter one username per line</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter Minecraft usernames here, one per line..."
                className="min-h-[200px]"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                disabled={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching UUIDs...
                  </>
                ) : (
                  "Generate Whitelist"
                )}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Whitelist Preview</CardTitle>
              <CardDescription>Users to be included in whitelist.json</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead className="hidden md:table-cell">UUID</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index} className={user.error ? "bg-destructive/10" : ""}>
                        <TableCell className="font-medium">
                          {user.name}
                          {user.error && <span className="text-destructive text-xs block">Error: {user.error}</span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs">{user.uuid || "—"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeUser(index)} className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No users added yet</div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDownload}
                disabled={users.length === 0 || users.every((user) => !!user.error)}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" /> Download whitelist.json
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
