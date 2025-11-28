"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";
import { particlesConfig } from "./particles-config";

export default function ParticlesBackground() {
  const initParticles = useCallback(async (engine) => {
    // Load only slim engine for performance
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Particles
        id="tsparticles"
        init={initParticles}
        options={particlesConfig}
      />
    </div>
  );
}
