import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PhotonData } from "@/hooks/useBB84Simulation";
import { TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react";


interface AnalyticsDashboardProps {
  photons: PhotonData[];
  secretKey: (0 | 1)[];
  matchedPhotons: PhotonData[];
  errorRate: number;
  eveEnabled: boolean;
}

const AnalyticsDashboard = ({
  photons,
  secretKey,
  matchedPhotons,
  errorRate,
  eveEnabled,
}: AnalyticsDashboardProps) => {
  const efficiency = photons.length > 0 
    ? Math.round((matchedPhotons.length / photons.length) * 100)
    : 0;

  const interceptedCount = photons.filter(p => p.eveIntercepted).length;
  const errorCount = matchedPhotons.filter(p => p.aliceBit !== p.bobBit).length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Photons</p>
              <p className="text-3xl font-bold mt-1">{photons.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bases Matched</p>
              <p className="text-3xl font-bold mt-1 text-success">{matchedPhotons.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Key Length</p>
              <p className="text-3xl font-bold mt-1 text-accent">{secretKey.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-3xl font-bold mt-1">{efficiency}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Efficiency Bar */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Key Generation Efficiency</h3>
            <span className="text-sm text-muted-foreground">{efficiency}%</span>
          </div>
          <Progress value={efficiency} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Percentage of photons that contributed to the final key
          </p>
        </div>
      </Card>

      {/* Eve Statistics */}
      {eveEnabled && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Eavesdropping Activity</h3>
                <p className="text-2xl font-bold text-destructive mb-2">{interceptedCount}</p>
                <p className="text-sm text-muted-foreground">
                  Photons intercepted by Eve
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Error Rate</h3>
                <p className="text-2xl font-bold text-destructive mb-2">{errorRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">
                  Errors in matched bases ({errorCount} errors)
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Basis Distribution */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Basis Distribution</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Alice's Bases</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rectilinear (+)</span>
                <span className="text-sm font-semibold text-primary">
                  {photons.filter(p => p.aliceBasis === "rectilinear").length}
                </span>
              </div>
              <Progress 
                value={(photons.filter(p => p.aliceBasis === "rectilinear").length / photons.length) * 100} 
                className="h-2"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">Diagonal (×)</span>
                <span className="text-sm font-semibold text-primary">
                  {photons.filter(p => p.aliceBasis === "diagonal").length}
                </span>
              </div>
              <Progress 
                value={(photons.filter(p => p.aliceBasis === "diagonal").length / photons.length) * 100} 
                className="h-2"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Bob's Bases</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rectilinear (+)</span>
                <span className="text-sm font-semibold text-secondary">
                  {photons.filter(p => p.bobBasis === "rectilinear").length}
                </span>
              </div>
              <Progress 
                value={(photons.filter(p => p.bobBasis === "rectilinear").length / photons.length) * 100} 
                className="h-2"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">Diagonal (×)</span>
                <span className="text-sm font-semibold text-secondary">
                  {photons.filter(p => p.bobBasis === "diagonal").length}
                </span>
              </div>
              <Progress 
                value={(photons.filter(p => p.bobBasis === "diagonal").length / photons.length) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Security Assessment */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Security Assessment</h3>
        {errorRate === 0 ? (
          <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-success">Secure Key Generated</p>
              <p className="text-sm text-muted-foreground mt-1">
                No errors detected. The key is safe to use for encryption.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Security Compromised</p>
              <p className="text-sm text-muted-foreground mt-1">
                Error rate of {errorRate.toFixed(1)}% detected. Possible eavesdropping by Eve. This key should be discarded.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
