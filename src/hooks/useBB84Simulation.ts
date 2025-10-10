import { useState, useCallback } from "react";

export type Basis = "rectilinear" | "diagonal";
export type Bit = 0 | 1;
export type Polarization = "vertical" | "horizontal" | "diagonal" | "antidiagonal";


export interface PhotonData {
  id: number;
  aliceBit: Bit;
  aliceBasis: Basis;
  bobBasis: Basis;
  bobBit: Bit | null;
  basesMatch: boolean;
  polarization: Polarization;
  eveIntercepted?: boolean;
  eveIntroducedError?: boolean;
}

const getPolarization = (bit: Bit, basis: Basis): Polarization => {
  if (basis === "rectilinear") {
    return bit === 0 ? "vertical" : "horizontal";
  } else {
    return bit === 0 ? "diagonal" : "antidiagonal";
  }
};

const measurePhoton = (polarization: Polarization, measurementBasis: Basis): Bit => {
  const photonBasis: Basis = 
    (polarization === "vertical" || polarization === "horizontal") 
      ? "rectilinear" 
      : "diagonal";

  if (photonBasis === measurementBasis) {
    // Correct basis - deterministic measurement
    return (polarization === "vertical" || polarization === "diagonal") ? 0 : 1;
  } else {
    // Wrong basis - random result (50/50)
    return Math.random() < 0.5 ? 0 : 1;
  }
};

export const useBB84Simulation = () => {
  const [photons, setPhotons] = useState<PhotonData[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [eveEnabled, setEveEnabled] = useState(false);

  const generatePhotons = useCallback((count: number = 16) => {
    const newPhotons: PhotonData[] = [];

    for (let i = 0; i < count; i++) {
      const aliceBit: Bit = Math.random() < 0.5 ? 0 : 1;
      const aliceBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
      const bobBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
      
      let polarization = getPolarization(aliceBit, aliceBasis);
      let eveIntercepted = false;
      let eveIntroducedError = false;

      // Eve's interception
      if (eveEnabled) {
        if (Math.random() < 0.5) { // 50% chance Eve intercepts
          eveIntercepted = true;
          const eveBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
          const eveMeasurement = measurePhoton(polarization, eveBasis);
          
          // Eve resends with her measured bit and random basis
          const eveResendBasis: Basis = Math.random() < 0.5 ? "rectilinear" : "diagonal";
          polarization = getPolarization(eveMeasurement, eveResendBasis);
          
          // Check if Eve introduced an error
          if (eveBasis !== aliceBasis) {
            eveIntroducedError = true;
          }
        }
      }

      const bobBit = measurePhoton(polarization, bobBasis);
      const basesMatch = aliceBasis === bobBasis;

      newPhotons.push({
        id: i,
        aliceBit,
        aliceBasis,
        bobBasis,
        bobBit,
        basesMatch,
        polarization,
        eveIntercepted,
        eveIntroducedError,
      });
    }

    setPhotons(newPhotons);
  }, [eveEnabled]);

  const startSimulation = useCallback((count: number = 16) => {
    setIsSimulating(true);
    generatePhotons(count);
  }, [generatePhotons]);

  const resetSimulation = useCallback(() => {
    setPhotons([]);
    setIsSimulating(false);
  }, []);

  const getSecretKey = useCallback(() => {
    return photons
      .filter((p) => p.basesMatch)
      .map((p) => p.aliceBit);
  }, [photons]);

  const getMatchedPhotons = useCallback(() => {
    return photons.filter((p) => p.basesMatch);
  }, [photons]);

  const getErrorRate = useCallback(() => {
    const matchedPhotons = photons.filter((p) => p.basesMatch);
    if (matchedPhotons.length === 0) return 0;

    const errors = matchedPhotons.filter(
      (p) => p.aliceBit !== p.bobBit
    ).length;

    return (errors / matchedPhotons.length) * 100;
  }, [photons]);

  return {
    photons,
    isSimulating,
    eveEnabled,
    setEveEnabled,
    startSimulation,
    resetSimulation,
    getSecretKey,
    getMatchedPhotons,
    getErrorRate,
  };
};
