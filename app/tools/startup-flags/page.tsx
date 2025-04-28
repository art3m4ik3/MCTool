"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clipboard, Check } from "lucide-react"

export default function StartupFlagsPage() {
  const [ram, setRam] = useState(4)
  const [copied, setCopied] = useState(false)
  const [useG1GC, setUseG1GC] = useState(true)
  const [useAikarFlags, setUseAikarFlags] = useState(true)
  const [useParallelGC, setUseParallelGC] = useState(false)
  const [customFlags, setCustomFlags] = useState("")
  const [jarFileName, setJarFileName] = useState("server.jar")
  const [selectedTemplate, setSelectedTemplate] = useState("aikar")
  const [activeTab, setActiveTab] = useState<"templates" | "custom">("templates")

  const aikarFlags = `-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true`
  const meowiceFlags = `--add-modules=jdk.incubator.vector -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=28 -XX:G1MaxNewSizePercent=50 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=15 -XX:G1MixedGCCountTarget=3 -XX:InitiatingHeapOccupancyPercent=20 -XX:G1MixedGCLiveThresholdPercent=90 -XX:SurvivorRatio=32 -XX:G1HeapWastePercent=5 -XX:MaxTenuringThreshold=1 -XX:+PerfDisableSharedMem -XX:G1SATBBufferEnqueueingThresholdPercent=30 -XX:G1ConcMarkStepDurationMillis=5 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:+UseNUMA -XX:-DontCompileHugeMethods -XX:MaxNodeLimit=240000 -XX:NodeLimitFudgeFactor=8000 -XX:ReservedCodeCacheSize=400M -XX:NonNMethodCodeHeapSize=12M -XX:ProfiledCodeHeapSize=194M -XX:NonProfiledCodeHeapSize=194M -XX:NmethodSweepActivity=1 -XX:+UseFastUnorderedTimeStamps -XX:+UseCriticalJavaThreadPriority -XX:AllocatePrefetchStyle=3 -XX:+AlwaysActAsServerClassMachine -XX:+UseTransparentHugePages -XX:LargePageSizeInBytes=2M -XX:+UseLargePages -XX:+EagerJVMCI -XX:+UseStringDeduplication -XX:+UseAES -XX:+UseAESIntrinsics -XX:+UseFMA -XX:+UseLoopPredicate -XX:+RangeCheckElimination -XX:+OptimizeStringConcat -XX:+UseCompressedOops -XX:+UseThreadPriorities -XX:+OmitStackTraceInFastThrow -XX:+RewriteBytecodes -XX:+RewriteFrequentPairs -XX:+UseFPUForSpilling -XX:+UseFastStosb -XX:+UseNewLongLShift -XX:+UseVectorCmov -XX:+UseXMMForArrayCopy -XX:+UseXmmI2D -XX:+UseXmmI2F -XX:+UseXmmLoadAndClearUpper -XX:+UseXmmRegToRegMoveAll -XX:+EliminateLocks -XX:+DoEscapeAnalysis -XX:+AlignVector -XX:+OptimizeFill -XX:+EnableVectorSupport -XX:+UseCharacterCompareIntrinsics -XX:+UseCopySignIntrinsic -XX:+UseVectorStubs -XX:UseAVX=2 -XX:UseSSE=4 -XX:+UseFastJNIAccessors -XX:+UseInlineCaches -XX:+SegmentedCodeCache -Djdk.nio.maxCachedBufferSize=262144 -Dgraal.UsePriorityInlining=true -Dgraal.Vectorization=true -Dgraal.OptDuplication=true -Dgraal.DetectInvertedLoopsAsCounted=true  -Dgraal.LoopInversion=true -Dgraal.VectorizeHashes=true -Dgraal.EnterprisePartialUnroll=true -Dgraal.VectorizeSIMD=true -Dgraal.StripMineNonCountedLoops=true  -Dgraal.SpeculativeGuardMovement=true -Dgraal.TuneInlinerExploration=1 -Dgraal.LoopRotation=true -Dgraal.OptWriteMotion=true -Dgraal.CompilerConfiguration=enterprise`
  const obyduxFlags = `--add-modules=jdk.incubator.vector -XX:+UseG1GC -XX:MaxGCPauseMillis=130 -XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=28 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=20 -XX:G1MixedGCCountTarget=3 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1MixedGCLiveThresholdPercent=90 -XX:SurvivorRatio=32 -XX:MaxTenuringThreshold=1 -XX:+PerfDisableSharedMem -XX:G1SATBBufferEnqueueingThresholdPercent=30 -XX:G1ConcMarkStepDurationMillis=5 -XX:G1ConcRSHotCardLimit=16 -XX:G1ConcRefinementServiceIntervalMillis=150 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:+UseNUMA -XX:-DontCompileHugeMethods -XX:MaxNodeLimit=240000 -XX:NodeLimitFudgeFactor=8000 -XX:ReservedCodeCacheSize=400M -XX:NonNMethodCodeHeapSize=12M -XX:ProfiledCodeHeapSize=194M -XX:NonProfiledCodeHeapSize=194M -XX:NmethodSweepActivity=1 -XX:+UseFastUnorderedTimeStamps -XX:+UseCriticalJavaThreadPriority -XX:AllocatePrefetchStyle=3 -XX:+AlwaysActAsServerClassMachine -XX:+UseTransparentHugePages -XX:LargePageSizeInBytes=2M -XX:+UseLargePages -XX:+EagerJVMCI -Dgraal.TuneInlinerExploration=1 -Dgraal.LoopRotation=true -Dgraal.OptWriteMotion=true -Dgraal.CompilerConfiguration=enterprise`
  const hillttyFlags = `-XX:+UseLargePages -XX:LargePageSizeInBytes=2M -XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -XX:ShenandoahGCMode=iu -XX:+UseNUMA -XX:+AlwaysPreTouch -XX:-UseBiasedLocking -XX:+DisableExplicitGC -Dfile.encoding=UTF-8`
  const etilFlags = `-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:-UseBiasedLocking -XX:UseAVX=3 -XX:+UseStringDeduplication -XX:+UseFastUnorderedTimeStamps -XX:+UseAES -XX:+UseAESIntrinsics -XX:UseSSE=4 -XX:+UseFMA -XX:AllocatePrefetchStyle=1 -XX:+UseLoopPredicate -XX:+RangeCheckElimination -XX:+EliminateLocks -XX:+DoEscapeAnalysis -XX:+UseCodeCacheFlushing -XX:+SegmentedCodeCache -XX:+UseFastJNIAccessors -XX:+OptimizeStringConcat -XX:+UseCompressedOops -XX:+UseThreadPriorities -XX:+OmitStackTraceInFastThrow -XX:+TrustFinalNonStaticFields -XX:ThreadPriorityPolicy=1 -XX:+UseInlineCaches -XX:+RewriteBytecodes -XX:+RewriteFrequentPairs -XX:+UseNUMA -XX:-DontCompileHugeMethods -XX:+UseFPUForSpilling -XX:+UseFastStosb -XX:+UseNewLongLShift -XX:+UseVectorCmov -XX:+UseXMMForArrayCopy -XX:+UseXmmI2D -XX:+UseXmmI2F -XX:+UseXmmLoadAndClearUpper -XX:+UseXmmRegToRegMoveAll -Dfile.encoding=UTF-8 -Xlog:async -Djava.security.egd=file:/dev/urandom --add-modules jdk.incubator.vector`
  const vanillaFlags = ``

  const generateFlags = () => {
    let flags = `-Xms${ram}G -Xmx${ram}G `

    if (activeTab === "custom") {
      if (useG1GC) {
        flags += "-XX:+UseG1GC "
      }
      if (useParallelGC) {
        flags += "-XX:+UseParallelGC "
      }
    } else {
      if (selectedTemplate === "aikar") {
        flags += aikarFlags
      } else if (selectedTemplate === "meowice") {
        flags += meowiceFlags
      } else if (selectedTemplate === "obydux") {
        flags += obyduxFlags
      } else if (selectedTemplate === "hilltty") {
        flags += hillttyFlags
      } else if (selectedTemplate === "etil") {
        flags += etilFlags
      } else if (selectedTemplate === "vanilla") {
        flags += vanillaFlags
      }
    }

    if (customFlags) {
      flags += ` ${customFlags}`
    }

    return flags.trim()
  }

  const getFullCommand = () => {
    return `java ${generateFlags()} -jar ${jarFileName} nogui`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFullCommand())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minecraft Startup Flags Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Optimize your Minecraft server performance with custom startup flags
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "templates" | "custom")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aikar's Flags</CardTitle>
                  <CardDescription>Highly optimized JVM flags for Minecraft servers by Aikar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ram">RAM Allocation (GB)</Label>
                      <span className="text-sm font-medium">{ram} GB</span>
                    </div>
                    <Slider
                      id="ram"
                      min={1}
                      max={32}
                      step={1}
                      value={[ram]}
                      onValueChange={(value) => setRam(value[0])}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="aikar-flags" checked={useAikarFlags} onCheckedChange={setUseAikarFlags} />
                    <Label htmlFor="aikar-flags">Use Aikar's Flags (Recommended)</Label>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="jar-filename">JAR Filename</Label>
                    <Input
                      id="jar-filename"
                      value={jarFileName}
                      onChange={(e) => setJarFileName(e.target.value)}
                      placeholder="server.jar"
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Template Selection</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={selectedTemplate === "aikar" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("aikar")}
                        className="justify-start"
                      >
                        Aikar's Flags
                        <span className="ml-auto text-xs opacity-70">Recommended</span>
                      </Button>
                      <Button
                        variant={selectedTemplate === "meowice" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("meowice")}
                        className="justify-start"
                      >
                        MeowIce's Flags
                      </Button>
                      <Button
                        variant={selectedTemplate === "obydux" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("obydux")}
                        className="justify-start"
                      >
                        Obydux's Flags
                      </Button>
                      <Button
                        variant={selectedTemplate === "hilltty" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("hilltty")}
                        className="justify-start"
                      >
                        Hilltty's Flags
                      </Button>
                      <Button
                        variant={selectedTemplate === "etil" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("etil")}
                        className="justify-start"
                      >
                        Etil's Flags
                      </Button>
                      <Button
                        variant={selectedTemplate === "vanilla" ? "default" : "outline"}
                        onClick={() => setSelectedTemplate("vanilla")}
                        className="justify-start"
                      >
                        Vanilla Flags
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="custom" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Configuration</CardTitle>
                  <CardDescription>Fine-tune your server startup flags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="custom-ram">RAM Allocation (GB)</Label>
                      <span className="text-sm font-medium">{ram} GB</span>
                    </div>
                    <Slider
                      id="custom-ram"
                      min={1}
                      max={32}
                      step={1}
                      value={[ram]}
                      onValueChange={(value) => setRam(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="g1gc" checked={useG1GC} onCheckedChange={setUseG1GC} disabled={useAikarFlags} />
                      <Label htmlFor="g1gc">Use G1GC Garbage Collector</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="parallel-gc"
                        checked={useParallelGC}
                        onCheckedChange={setUseParallelGC}
                        disabled={useAikarFlags}
                      />
                      <Label htmlFor="parallel-gc">Use Parallel Garbage Collector</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-flags">Additional Custom Flags</Label>
                    <Input
                      id="custom-flags"
                      placeholder="e.g. -XX:+DisableExplicitGC"
                      value={customFlags}
                      onChange={(e) => setCustomFlags(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Generated Flags</CardTitle>
              <CardDescription>Copy these flags to your server startup script</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">JVM Flags</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-all">{generateFlags()}</pre>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Complete Command</h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm whitespace-pre-wrap break-all">{getFullCommand()}</pre>
                </div>
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
