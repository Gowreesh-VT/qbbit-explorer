import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { PhotonData } from "@/hooks/useBB84Simulation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StepByStepModeProps {
  photons: PhotonData[];
  onExit: () => void;
}

const StepByStepMode = ({ photons, onExit }: StepByStepModeProps) => {
  const [currentPhotonIndex, setCurrentPhotonIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  if (photons.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No photons to step through. Run a simulation first.</p>
        <Button onClick={onExit} variant="outline">Exit Step-by-Step Mode</Button>
      </Card>
    );
  }

  const photon = photons[currentPhotonIndex];

  const steps = [
    {
      title: "Alice Prepares Photon",
      description: `Alice randomly chooses bit ${photon.aliceBit} and basis ${photon.aliceBasis}.`,
      detail: `She encodes the bit using ${photon.aliceBasis} basis, resulting in ${photon.polarization} polarization.`,
    },
    {
      title: "Photon Polarization",
      description: `The photon is polarized in the ${photon.polarization} state.`,
      detail: photon.aliceBasis === "rectilinear" 
        ? "Rectilinear basis uses vertical (|) and horizontal (—) polarizations."
        : "Diagonal basis uses diagonal (/) and anti-diagonal (\\) polarizations.",
    },
    {
      title: "Bob Chooses Measurement Basis",
      description: `Bob randomly selects the ${photon.bobBasis} basis to measure the incoming photon.`,
      detail: photon.basesMatch 
        ? "✓ This matches Alice's basis!" 
        : "✗ This differs from Alice's basis.",
    },
    {
      title: "Measurement Outcome",
      description: `Bob measures and gets bit ${photon.bobBit}.`,
      detail: photon.basesMatch
        ? `Since bases match, Bob's measurement is deterministic and accurate (${photon.aliceBit === photon.bobBit ? "correct" : "error"}).`
        : "Since bases don't match, Bob's result is random (50/50 chance).",
    },
    {
      title: "Basis Comparison",
      description: `Alice and Bob publicly compare their bases (not the bits).`,
      detail: photon.basesMatch
        ? "✓ Bases match! This bit will be kept for the secret key."
        : "✗ Bases differ. This bit is discarded.",
    },
    {
      title: "Key Extraction",
      description: photon.basesMatch 
        ? `This photon contributes bit ${photon.aliceBit} to the secret key.`
        : "This photon is discarded and doesn't contribute to the key.",
      detail: photon.eveIntercepted 
        ? "⚠ Eve intercepted this photon, which may have introduced errors."
        : "No eavesdropping detected on this photon.",
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentPhotonIndex < photons.length - 1) {
      setCurrentPhotonIndex(currentPhotonIndex + 1);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentPhotonIndex > 0) {
      setCurrentPhotonIndex(currentPhotonIndex - 1);
      setCurrentStep(steps.length - 1);
    }
  };

  const reset = () => {
    setCurrentPhotonIndex(0);
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Step-by-Step Mode</h3>
            <p className="text-sm text-muted-foreground">
              Photon {currentPhotonIndex + 1} of {photons.length}
            </p>
          </div>
          <Button onClick={onExit} variant="outline">
            Exit Mode
          </Button>
        </div>

        <Progress value={progress} className="mb-6" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={photon.basesMatch ? "default" : "secondary"}>
              Step {currentStep + 1}/{steps.length}
            </Badge>
            {photon.eveIntercepted && (
              <Badge variant="destructive">Eve Intercepted</Badge>
            )}
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">{currentStepData.title}</h4>
            <p className="text-foreground mb-2">{currentStepData.description}</p>
            <p className="text-sm text-muted-foreground">{currentStepData.detail}</p>
          </div>

          {/* Visual representation */}
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Alice's Bit</p>
                <p className="text-2xl font-bold text-primary">{photon.aliceBit}</p>
                <p className="text-xs text-muted-foreground">{photon.aliceBasis}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Polarization</p>
                <p className="text-lg font-semibold">{photon.polarization}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bob's Measurement</p>
                <p className="text-2xl font-bold text-secondary">{photon.bobBit}</p>
                <p className="text-xs text-muted-foreground">{photon.bobBasis}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={prevStep}
            disabled={currentPhotonIndex === 0 && currentStep === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentPhotonIndex === photons.length - 1 && currentStep === steps.length - 1}
            className="flex-1 bg-gradient-quantum"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StepByStepMode;