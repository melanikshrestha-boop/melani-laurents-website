"use client";

import { NeurotechBrainField } from "./NeurotechBrainField";

interface ArchiveNeuralFieldProps {
  active?: boolean;
}

/** Archive zone backdrop — full-strength brain synapse field. */
export function ArchiveNeuralField({ active = true }: ArchiveNeuralFieldProps) {
  return <NeurotechBrainField variant="archive" active={active} />;
}
