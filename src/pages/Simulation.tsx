import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Play, RotateCcw, Info, ListOrdered, Waves, HelpCircle } from "lucide-react";
import PhotonScene from "@/components/simulation/PhotonScene";
import { useSimulation } from "@/contexts/SimulationContext";
import KeyResults from "@/components/simulation/KeyResults";
import AnalyticsDashboard from "@/components/simulation/AnalyticsDashboard";
import StepByStepMode from "@/components/simulation/StepByStepMode";
import ChannelVisualization from "@/components/simulation/ChannelVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const Simulation = () => {
  const {
    photons,
    isSimulating,
    eveEnabled,
    setEveEnabled,
    startSimulation,
    resetSimulation,
    getSecretKey,
    getMatchedPhotons,
    getErrorRate,
  } = useSimulation();

  const [currentPhotonIndex, setCurrentPhotonIndex] = useState(-1);
  const [photonCount, setPhotonCount] = useState(16);
  const [stepByStepMode, setStepByStepMode] = useState(false);
  const [showChannelVisualization, setShowChannelVisualization] = useState(false);

  useEffect(() => {
    if (isSimulating && currentPhotonIndex < photons.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPhotonIndex(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSimulating, currentPhotonIndex, photons.length]);

  const handleStart = () => {
    setCurrentPhotonIndex(-1);
    startSimulation(photonCount);
  };

  const handleReset = () => {
    setCurrentPhotonIndex(-1);
    setShowChannelVisualization(false);
    resetSimulation();
  };

  const secretKey = getSecretKey();
  const matchedPhotons = getMatchedPhotons();
  const errorRate = getErrorRate();
  const simulationComplete = photons.length > 0 && currentPhotonIndex >= photons.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-quantum bg-clip-text text-transparent">
              Quantum Key Distribution Simulator
            </h1>
            <p className="text-muted-foreground">
              Interactive BB84 protocol with real-time 3D visualization and analytics
            </p>
          </div>

          {/* Simulation Controls */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Simulation Controls</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="photon-count">Number of Photons: {photonCount}</Label>
                </div>
                <Slider
                  id="photon-count"
                  min={8}
                  max={32}
                  step={4}
                  value={[photonCount]}
                  onValueChange={(value) => setPhotonCount(value[0])}
                  disabled={isSimulating}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="eve-mode" className="cursor-pointer">
                  Include Eavesdropper (Eve)
                </Label>
                <Switch
                  id="eve-mode"
                  checked={eveEnabled}
                  onCheckedChange={setEveEnabled}
                  disabled={isSimulating}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleStart}
                  disabled={(isSimulating && currentPhotonIndex < photons.length - 1) || stepByStepMode}
                  className="bg-gradient-quantum flex-1"
                >
                  <Play className="mr-2 w-4 h-4" />
                  {isSimulating ? "Running Simulation..." : "Run Simulation"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={!isSimulating && !stepByStepMode}
                >
                  <RotateCcw className="mr-2 w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={() => setStepByStepMode(!stepByStepMode)}
                  variant="secondary"
                  disabled={photons.length === 0}
                >
                  <ListOrdered className="mr-2 w-4 h-4" />
                  {stepByStepMode ? "Exit" : "Step-by-Step"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Step-by-Step Mode or Normal Visualization */}
          {photons.length > 0 && stepByStepMode ? (
            <StepByStepMode 
              photons={photons} 
              onExit={() => setStepByStepMode(false)} 
            />
          ) : photons.length > 0 && !showChannelVisualization && (
            <>
              <PhotonScene 
                photons={photons} 
                currentPhotonIndex={currentPhotonIndex}
                eveEnabled={eveEnabled}
                showBlochSphere={true}
              />

              {/* Legend */}
              <Card className="p-4">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success shadow-glow-success"></div>
                    <span>Bases Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span>Bases Differ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span>Alice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span>Bob</span>
                  </div>
                </div>
              </Card>

              {/* Channel Visualization Button */}
              {simulationComplete && (
                <Card className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setShowChannelVisualization(true)}
                            variant="outline"
                            className="bg-gradient-quantum"
                          >
                            <Waves className="mr-2 w-4 h-4" />
                            Visualize Quantum Channel
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to visualize how photons traveled through the quantum channel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to visualize how photons traveled through the quantum channel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </Card>
              )}

              {/* Results and Analytics Tabs */}
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
                  <TabsTrigger value="results">Key Generation Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analytics" className="mt-6">
                  <AnalyticsDashboard
                    photons={photons}
                    secretKey={secretKey}
                    matchedPhotons={matchedPhotons}
                    errorRate={errorRate}
                    eveEnabled={eveEnabled}
                  />
                </TabsContent>
                
                <TabsContent value="results" className="mt-6">
                  <KeyResults
                    photons={photons}
                    secretKey={secretKey}
                    errorRate={errorRate}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* Channel Visualization View */}
          {showChannelVisualization && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-quantum bg-clip-text text-transparent">
                  Quantum Channel Visualization
                </h2>
                <Button
                  onClick={() => setShowChannelVisualization(false)}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Results
                </Button>
              </div>
              <ChannelVisualization eveEnabled={eveEnabled} photonCount={photons.length} />
              <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    <strong>Channel Visualization:</strong> Watch as photons travel through the quantum channel from Alice to Bob.
                  </p>
                  {eveEnabled && (
                    <p className="text-destructive">
                      <strong>⚠️ Eve is intercepting:</strong> Notice the red flashes when photons pass through Eve's position, 
                      introducing errors into the quantum transmission.
                    </p>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Educational Info */}
          {!isSimulating && photons.length === 0 && (
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">How to Use the Simulator</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Adjust the number of photons to simulate (8-32)</li>
                    <li>• Toggle the eavesdropper to see how Eve affects the protocol</li>
                    <li>• Click "Run Simulation" to watch photons travel in 3D</li>
                    <li>• Green photons = basis match (key bit kept)</li>
                    <li>• Red photons = basis mismatch (bit discarded)</li>
                    <li>• View analytics to see key efficiency and error rates</li>
                  </ul>
                  <Link to="/theory" className="inline-block mt-4">
                    <Button variant="link" className="px-0 text-primary">
                      Learn more about BB84 Protocol →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
