import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhotonData, Bit } from "@/hooks/useBB84Simulation";
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  const eveErrorsIntroduced = photons.filter(p => p.eveIntroducedError).length;

  // Calculate QBER (Quantum Bit Error Rate)
  const calculateQBER = () => {
    if (matchedPhotons.length === 0) return 0;
    const errors = matchedPhotons.filter(p => p.aliceBit !== p.bobBit).length;
    return (errors / matchedPhotons.length) * 100;
  };

  const qber = calculateQBER();
  const isChannelSecure = qber < 11;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Security Status Alert */}
        {eveEnabled && (
          <Alert variant={isChannelSecure ? "default" : "destructive"} className="border-2">
            <div className="flex items-center gap-3">
              {isChannelSecure ? (
                <Shield className="w-5 h-5 text-success" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
              <div className="flex-1">
                <AlertDescription className="text-base font-semibold">
                  {isChannelSecure 
                    ? "✓ Secure Channel - QBER within acceptable limits" 
                    : "⚠ Possible Eavesdropping Detected - QBER exceeds security threshold"}
                </AlertDescription>
                <p className="text-sm mt-1">
                  Quantum Bit Error Rate: <span className="font-bold">{qber.toFixed(2)}%</span>
                  {" "}(Threshold: 11%)
                </p>
              </div>
            </div>
          </Alert>
        )}
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Total Photons</p>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of photons transmitted by Alice</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Bases Matched</p>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Photons where Alice and Bob used the same measurement basis</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Key Length</p>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Number of bits in the final shared secret key</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of photons that contribute to the final key</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
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

        {/* QBER and Eve Statistics */}
        {eveEnabled && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Eavesdropper Statistics
              <Badge variant="destructive">Eve Active</Badge>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-muted-foreground">QBER</div>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shows how much error Eve's measurement disturbance introduces</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="text-2xl font-bold" style={{ color: isChannelSecure ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                  {qber.toFixed(2)}%
                </div>
                <Progress value={qber} className="mt-2" />
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-2">Photons Intercepted</div>
                <div className="text-2xl font-bold text-destructive">{interceptedCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((interceptedCount / photons.length) * 100).toFixed(1)}% of total
                </p>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-2">Errors Introduced</div>
                <div className="text-2xl font-bold text-destructive">{eveErrorsIntroduced}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Due to wrong basis measurements
                </p>
              </div>
            </div>
          </Card>
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
    </TooltipProvider>
  );
};

export default AnalyticsDashboard;
