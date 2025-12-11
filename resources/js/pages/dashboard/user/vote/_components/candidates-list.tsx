import React from "react";
import { CandidateCard } from "./candidate-card";
import type { Candidate } from "./candidate-card";

export type { Candidate };

interface CandidatesListProps {
  candidates: Candidate[];
  selectedCandidate: number | null;
  isQrScanned: boolean;
  onVote: (candidateId: number) => void;
  onOpenScanner: () => void;
}

export function CandidatesList({
  candidates,
  selectedCandidate,
  isQrScanned,
  onVote,
  onOpenScanner,
}: CandidatesListProps) {
  return (
    <section aria-label="Candidates" className="mb-16">
      <div className="flex flex-wrap justify-center gap-8">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidate === candidate.id}
            isQrScanned={isQrScanned}
            onVote={onVote}
            onOpenScanner={onOpenScanner}
          />
        ))}
      </div>
    </section>
  );
}
