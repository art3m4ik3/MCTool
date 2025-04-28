"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, AlertTriangle, Zap, Server, HardDrive, Cpu, MemoryStickIcon as Memory } from "lucide-react"

export default function OptimizationGuidePage() {
  const [serverType, setServerType] = useState<string>("paper")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Server Optimization Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guide to optimize your Minecraft server for better performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Server Type</CardTitle>
              <CardDescription>Select your server software</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={serverType} onValueChange={setServerType} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="paper">Paper</TabsTrigger>
                  <TabsTrigger value="spigot">Spigot</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="purpur">Purpur</TabsTrigger>
                  <TabsTrigger value="vanilla">Vanilla</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Jump to Section:</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#pre-checklist" className="text-primary hover:underline">
                      Pre-Optimization Checklist
                    </a>
                  </li>
                  <li>
                    <a href="#startup-flags" className="text-primary hover:underline">
                      Startup Flags
                    </a>
                  </li>
                  <li>
                    <a href="#server-properties" className="text-primary hover:underline">
                      Server Properties
                    </a>
                  </li>
                  <li>
                    <a href="#world-settings" className="text-primary hover:underline">
                      World Settings
                    </a>
                  </li>
                  <li>
                    <a href="#plugins" className="text-primary hover:underline">
                      Plugin Recommendations
                    </a>
                  </li>
                  <li>
                    <a href="#hardware" className="text-primary hover:underline">
                      Hardware Considerations
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              This guide provides general optimization advice. Your specific server may require different settings based
              on your hardware, player count, and installed plugins/mods.
            </AlertDescription>
          </Alert>

          {/* Pre-Optimization Checklist */}
          <section id="pre-checklist" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Optimization Checklist</CardTitle>
                <CardDescription>Essential steps before tuning your server</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Use legitimate software; avoid pirated jars or cracked plugins.</li>
                  <li>Run the latest stable Minecraft and Java 17+ releases.</li>
                  <li>Prefer server-optimized plugins over datapacks.</li>
                  <li>Automate backups for worlds and configuration files.</li>
                  <li>Choose reliable hosting with fast I/O and sufficient RAM/CPU.</li>
                  <li>Use maintained forks (Paper, Purpur, Pufferfish).</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="startup-flags" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Startup Flags Optimization</CardTitle>
                </div>
                <CardDescription>Java Virtual Machine (JVM) flags to improve server performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Recommended Flags</h3>
                  <div className="bg-muted p-3 rounded-md overflow-x-auto">
                    <pre className="text-sm whitespace-pre-wrap">
                      {serverType === "paper" || serverType === "purpur"
                        ? "java -Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -jar server.jar nogui"
                        : serverType === "spigot"
                          ? "java -Xms2G -Xmx2G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -jar server.jar nogui"
                          : "java -Xms2G -Xmx2G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -jar server.jar nogui"}
                    </pre>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="memory">
                    <AccordionTrigger>Memory Allocation</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>-Xms</code> and <code>-Xmx</code> control the minimum and maximum memory allocation.
                          Setting them to the same value prevents the JVM from having to resize the heap.
                        </p>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Important</AlertTitle>
                          <AlertDescription>
                            Don't allocate more RAM than your system has available. For most servers, 4-8GB is
                            sufficient. More RAM isn't always better!
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="garbage-collector">
                    <AccordionTrigger>Garbage Collection</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>-XX:+UseG1GC</code> enables the Garbage-First (G1) Garbage Collector, which is designed
                          to provide a good balance between latency and throughput.
                        </p>
                        <p>
                          The G1GC settings are tuned to minimize lag spikes during garbage collection, which is crucial
                          for a smooth gameplay experience.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="aikar">
                    <AccordionTrigger>About Aikar's Flags</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          Aikar's flags are a set of JVM arguments developed by Aikar after extensive research and
                          testing. They're designed specifically for Minecraft servers and have become the standard for
                          optimal performance.
                        </p>
                        <p>
                          These flags work best with Paper, Purpur, and other Paper forks, but can also benefit Spigot
                          servers.
                        </p>
                        <p>
                          <a
                            href="https://aikar.co/2018/07/02/tuning-the-jvm-g1gc-garbage-collector-flags-for-minecraft/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Read Aikar's detailed explanation
                          </a>
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="other-flags">
                    <AccordionTrigger>Other JVM Flags</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p><code>-XX:+DisableExplicitGC</code> prevents unwanted full GC calls initiated by code.</p>
                        <p><code>-XX:+AlwaysPreTouch</code> pre-touches memory pages on startup to avoid page faults.</p>
                        <p><code>-XX:+UnlockExperimentalVMOptions</code> enables experimental VM options for advanced tuning.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          <section id="server-properties" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <CardTitle>Server Properties Optimization</CardTitle>
                </div>
                <CardDescription>Recommended settings for server.properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="view-distance">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>View Distance</span>
                        <Badge variant="outline">Performance Impact: High</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>view-distance=8</code> - Controls how many chunks are sent to players.
                        </p>
                        <p>
                          This setting has one of the biggest impacts on server performance. Lower values mean better
                          performance but reduced visibility for players. A value between 6-10 is recommended for most
                          servers.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="simulation-distance">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>Simulation Distance</span>
                        <Badge variant="outline">Performance Impact: High</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>simulation-distance=6</code> - Controls how many chunks are being tick updated.
                        </p>
                        <p>
                          This setting determines how far from players the server will process redstone, mobs, and other
                          game mechanics. Setting this lower than view-distance can significantly improve performance
                          while still allowing players to see farther.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="entity-broadcast-range-percentage">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>Entity Broadcast Range</span>
                        <Badge variant="outline">Performance Impact: Medium</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>entity-broadcast-range-percentage=100</code> - Controls entity tracking range.
                        </p>
                        <p>
                          Reducing this value (e.g., to 50) can improve performance by sending fewer entity updates to
                          clients. However, it may cause entities to appear/disappear more suddenly for players.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="network-compression-threshold">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <span>Network Compression</span>
                        <Badge variant="outline">Performance Impact: Low</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <code>network-compression-threshold=256</code> - Controls packet compression.
                        </p>
                        <p>
                          The default value of 256 is good for most servers. Setting this to -1 disables compression
                          entirely, which can reduce CPU usage but increases bandwidth usage significantly.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          <section id="world-settings" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <CardTitle>World Settings Optimization</CardTitle>
                </div>
                <CardDescription>
                  {serverType === "vanilla"
                    ? "Vanilla doesn't have specific world optimization settings"
                    : `Recommended settings for ${serverType}.yml or bukkit.yml`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {serverType === "vanilla" ? (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Vanilla Limitations</AlertTitle>
                    <AlertDescription>
                      Vanilla Minecraft doesn't offer many configuration options for world optimization. Consider using
                      Paper or Purpur for better performance and more configuration options.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="mob-spawning">
                      <AccordionTrigger>Mob Spawning Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="font-medium">In paper.yml or purpur.yml:</p>
                          <pre className="bg-muted p-3 rounded-md text-sm">
                            {`spawn-limits:
  monsters: 50  # Default: 70
  animals: 10   # Default: 15
  water-animals: 5  # Default: 5
  water-ambient: 10  # Default: 20
  ambient: 5  # Default: 15`}
                          </pre>
                          <p>
                            Reducing mob spawn limits can significantly improve performance, especially on servers with
                            many players spread across the world.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    {(serverType === "paper" || serverType === "purpur") && (
                      <AccordionItem value="paper-settings">
                        <AccordionTrigger>Paper-Specific Optimizations</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="font-medium">In paper.yml:</p>
                            <pre className="bg-muted p-3 rounded-md text-sm">
                              {`max-auto-save-chunks-per-tick: 6
per-player-mob-spawns: true
optimize-explosions: true
mob-spawner-tick-rate: 2
container-update-tick-rate: 3
grass-spread-tick-rate: 4
despawn-ranges:
  soft: 28
  hard: 96`}
                            </pre>
                            <p>
                              These settings optimize various game mechanics to reduce server load without significantly
                              affecting gameplay.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {serverType === "purpur" && (
                      <AccordionItem value="purpur-settings">
                        <AccordionTrigger>Purpur-Specific Optimizations</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="font-medium">In purpur.yml:</p>
                            <pre className="bg-muted p-3 rounded-md text-sm">
                              {`settings:
  use-alternate-keepalive: true
  dont-send-useless-entity-packets: true
  
mobs:
  villager:
    brain-ticks: 4  # Default: 1
  zombie:
    aggressive-towards-villager-when-lagging: false`}
                            </pre>
                            <p>
                              Purpur offers many additional optimizations beyond Paper, particularly for entity behavior
                              and mob AI.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    <AccordionItem value="chunk-loading">
                      <AccordionTrigger>Chunk Loading Optimization</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="font-medium">In bukkit.yml:</p>
                          <pre className="bg-muted p-3 rounded-md text-sm">
                            {`chunk-gc:
  period-in-ticks: 400
  load-threshold: 300
  
ticks-per:
  animal-spawns: 400
  monster-spawns: 100
  water-spawns: 400
  water-ambient-spawns: 400
  ambient-spawns: 400`}
                          </pre>
                          <p>
                            These settings control how frequently the server attempts to spawn mobs and unload chunks.
                            Increasing these values reduces server load but may make mob spawning less predictable.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </section>

          <section id="plugins" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle>Plugin Recommendations</CardTitle>
                </div>
                <CardDescription>Plugins that can help improve server performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {serverType === "vanilla" ? (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Vanilla Limitations</AlertTitle>
                    <AlertDescription>
                      Vanilla Minecraft doesn't support plugins. Consider using Paper or Purpur to take advantage of
                      these optimization plugins.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Spark</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Performance profiler for Minecraft servers. Helps identify lag sources and performance
                          bottlenecks.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Chunky</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Pre-generates chunks to prevent lag when players explore new areas.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Lithium</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          General-purpose optimization mod that improves a variety of systems without changing vanilla
                          mechanics.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">FeatherBoard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Lightweight scoreboard plugin that's more efficient than many alternatives.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">EntityTrackerFixer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Prevents entity tracking issues that can cause severe lag in certain situations.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Clearlag</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Removes excessive entities and items to prevent lag from entity buildup.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section id="hardware" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Memory className="h-5 w-5 text-primary" />
                  <CardTitle>Hardware Considerations</CardTitle>
                </div>
                <CardDescription>Hardware recommendations for optimal server performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">CPU</h3>
                  <p>
                    Minecraft servers primarily rely on single-thread performance. A CPU with high clock speeds
                    (3.5GHz+) is more important than having many cores. However, having at least 4 cores is recommended
                    for modern servers.
                  </p>
                  <p>
                    Recommended: Recent Intel Core i7/i9 or AMD Ryzen 7/9 processors with high single-thread
                    performance.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">RAM</h3>
                  <p>
                    For small servers (1-5 players), 4GB is usually sufficient. Medium servers (5-20 players) should
                    have 8-16GB. Large servers with many plugins or mods may need 16GB or more.
                  </p>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      More RAM isn't always better! Allocating too much RAM can lead to longer garbage collection
                      pauses. Only allocate what you need.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Storage</h3>
                  <p>
                    SSD storage is strongly recommended for Minecraft servers. The faster disk I/O significantly
                    improves chunk loading/saving and overall server performance.
                  </p>
                  <p>
                    For world storage, plan for at least 5-10GB per world, more if you have many players exploring far
                    distances.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Network</h3>
                  <p>
                    Upload speed is the most important factor for hosting a server. You'll need approximately 0.5-1 Mbps
                    upload bandwidth per player for a smooth experience.
                  </p>
                  <p>A wired connection is strongly recommended over WiFi for stability.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
