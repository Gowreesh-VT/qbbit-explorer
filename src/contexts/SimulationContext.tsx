import { createContext, useContext, ReactNode } from "react";
import { useBB84Simulation } from "@/hooks/useBB84Simulation";

type SimulationContextType = ReturnType<typeof useBB84Simulation>;

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const simulation = useBB84Simulation();

  return (
    <SimulationContext.Provider value={simulation}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
