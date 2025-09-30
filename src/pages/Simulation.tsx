import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, RotateCcw, Key } from "lucide-react";
import PhotonScene from "@/components/simulation/PhotonScene";
import { useSimulation } from "@/contexts/SimulationContext";

const Simulation = () => {
  const navigate = useNavigate();
  const {
    photons,
    isSimulating,
    eveEnabled,
    setEveEnabled,
    startSimulation,
    resetSimulation,
    getSecretKey,
    getMatchedPhotons,
  } = useSimulation();

  const [currentPhotonIndex, setCurrentPhotonIndex] = useState(-1);

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
    startSimulation();
  };

  const handleReset = () => {
    setCurrentPhotonIndex(-1);
    resetSimulation();
  };

  const handleViewKey = () => {
    navigate("/key-extraction");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-quantum bg-clip-text text-transparent">
              3D BB84 Simulation
            </h1>
            <p className="text-muted-foreground">
              Watch photons travel from Alice to Bob in real-time 3D visualization
            </p>
          </div>

          {/* Controls */}
          <Card className="p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleStart}
                  disabled={isSimulating && currentPhotonIndex < photons.length - 1}
                  className="bg-gradient-quantum"
                >
                  <Play className="mr-2 w-4 h-4" />
                  {isSimulating ? "Running..." : "Start Simulation"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  disabled={!isSimulating}
                >
                  <RotateCcw className="mr-2 w-4 h-4" />
                  Reset
                </Button>
                {isSimulating && currentPhotonIndex >= photons.length - 1 && (
                  <Button
                    onClick={handleViewKey}
                    className="bg-gradient-photon"
                  >
                    <Key className="mr-2 w-4 h-4" />
                    Extract Secret Key
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="eve-mode"
                  checked={eveEnabled}
                  onCheckedChange={setEveEnabled}
                  disabled={isSimulating}
                />
                <Label htmlFor="eve-mode" className="cursor-pointer">
                  Enable Eavesdropper (Eve)
                </Label>
              </div>
            </div>
          </Card>

          {/* 3D Scene */}
          <PhotonScene photons={photons} currentPhotonIndex={currentPhotonIndex} />

          {/* Legend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Legend</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-success shadow-glow-success"></div>
                <span>Bases Match → Bit Kept</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-destructive"></div>
                <span>Bases Differ → Bit Discarded</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <span>Alice (Sender)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-secondary"></div>
                <span>Bob (Receiver)</span>
              </div>
            </div>
          </Card>

          {/* Stats */}
          {isSimulating && photons.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Simulation Statistics</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{photons.length}</div>
                  <div className="text-sm text-muted-foreground">Total Photons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{getMatchedPhotons().length}</div>
                  <div className="text-sm text-muted-foreground">Bases Matched</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{getSecretKey().length}</div>
                  <div className="text-sm text-muted-foreground">Key Length</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((getMatchedPhotons().length / photons.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
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
