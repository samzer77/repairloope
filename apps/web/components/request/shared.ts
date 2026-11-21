import type { RepairRequest } from "@/lib/types";

/** Exécute une action de l'API et met à jour la demande affichée. */
export type RunAction = (action: () => Promise<RepairRequest>) => Promise<void>;

export interface SectionProps {
  request: RepairRequest;
  isOwner: boolean;
  busy: boolean;
  run: RunAction;
}
