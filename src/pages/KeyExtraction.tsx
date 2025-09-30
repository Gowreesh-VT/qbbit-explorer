import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { useSimulation } from "@/contexts/SimulationContext";

const KeyExtraction = () => {
  const { photons, getSecretKey, getMatchedPhotons, getErrorRate, resetSimulation } = useSimulation();
  
  const secretKey = getSecretKey();
  const matchedPhotons = getMatchedPhotons();
  const errorRate = getErrorRate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/simulation">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Simulation
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-quantum bg-clip-text text-transparent">
              Secret Key Extraction
            </h1>
            <p className="text-muted-foreground">
              Results from basis reconciliation and key generation
            </p>
          </div>

          {/* Secret Key Display */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-success" />
              Generated Secret Key
            </h2>
            <div className="bg-background/50 p-4 rounded-lg font-mono text-xl tracking-wider">
              {secretKey.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {secretKey.map((bit, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-primary/20 text-primary rounded"
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">No key generated yet. Run simulation first.</span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Key Length: {secretKey.length} bits</span>
              <span className="text-accent">Binary Format</span>
            </div>
          </Card>

          {/* Error Rate */}
          {errorRate > 0 && (
            <Card className="p-6 bg-destructive/10 border-destructive/30">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                Eavesdropping Detected!
              </h2>
              <p className="text-foreground/90 mb-2">
                Error rate: <span className="font-bold text-destructive">{errorRate.toFixed(1)}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                A high error rate indicates possible eavesdropping by Eve. In a real implementation, 
                this key would be discarded and the protocol restarted.
              </p>
            </Card>
          )}

          {/* Detailed Photon Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basis Reconciliation Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Alice Bit</th>
                    <th className="text-left p-2">Alice Basis</th>
                    <th className="text-left p-2">Bob Basis</th>
                    <th className="text-left p-2">Bob Bit</th>
                    <th className="text-left p-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {photons.map((photon) => (
                    <tr
                      key={photon.id}
                      className={`border-b border-border/50 ${
                        photon.basesMatch ? "bg-success/5" : "bg-destructive/5"
                      }`}
                    >
                      <td className="p-2">{photon.id + 1}</td>
                      <td className="p-2 font-mono">{photon.aliceBit}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                          {photon.aliceBasis === "rectilinear" ? "+" : "×"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs">
                          {photon.bobBasis === "rectilinear" ? "+" : "×"}
                        </span>
                      </td>
                      <td className="p-2 font-mono">{photon.bobBit}</td>
                      <td className="p-2">
                        {photon.basesMatch ? (
                          <span className="text-success flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Kept
                          </span>
                        ) : (
                          <span className="text-destructive flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Discarded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Summary Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {photons.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Photons Transmitted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-1">
                  {matchedPhotons.length}
                </div>
                <div className="text-sm text-muted-foreground">Bases Matched</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round((matchedPhotons.length / photons.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Key Efficiency</div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4 justify-center">
            <Link to="/simulation">
              <Button
                onClick={resetSimulation}
                size="lg"
                className="bg-gradient-quantum"
              >
                <RotateCcw className="mr-2 w-5 h-5" />
                Run New Simulation
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyExtraction;
