import React from "react";
import { Link } from "@inertiajs/react";

export interface Candidate {
  id: number;
  name: string;
  department: string;
  image: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  isQrScanned: boolean;
  onVote: (candidateId: number) => void;
  onOpenScanner: () => void;
}

export function CandidateCard({
  candidate,
  isSelected,
  isQrScanned,
  onVote,
  onOpenScanner,
}: CandidateCardProps) {
  const handleVoteClick = () => {
    if (isQrScanned) {
      onVote(candidate.id);
    } else {
      onOpenScanner();
    }
  };

  return (
    <article
      className={`relative w-[380px] h-[450px] ${
        isSelected
          ? "border-[3px] border-solid border-[#232f9b] rounded-[20px]"
          : ""
      } ${
        !isQrScanned ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-labelledby={`candidate-name-${candidate.id}`}
    >
      <div className="w-[375px] h-[450px] rounded-[20px] bg-[linear-gradient(180deg,rgba(204,211,227,1)_0%,rgba(229,232,240,1)_42%,rgba(255,255,255,1)_100%)] shadow-[0px_4px_4px_#00000040] mx-auto" />

      <div className="absolute top-[44px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] bg-white rounded-[100px]" />

      <img
        className="absolute top-[50px] left-1/2 transform -translate-x-1/2 w-[190px] h-[190px] rounded-full object-cover"
        alt={`${candidate.name} profile picture`}
        src={candidate.image}
      />

      <h3
        id={`candidate-name-${candidate.id}`}
        className="absolute top-[265px] left-1/2 transform -translate-x-1/2 w-[230px] [font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-2xl tracking-[0] leading-[normal] whitespace-nowrap text-center"
      >
        {candidate.name}
      </h3>

      <p className="absolute top-[310px] left-1/2 transform -translate-x-1/2 w-[180px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#53599b] text-sm tracking-[0] leading-[normal] text-center">
        {candidate.department}
      </p>

      <div className="absolute top-[378px] left-1/2 transform -translate-x-1/2 flex gap-3">
        <button
          type="button"
          onClick={handleVoteClick}
          disabled={!isQrScanned}
          className={`w-[135px] h-[45px] px-[27px] py-[7px] bg-[#232f9b] flex items-center justify-center rounded-[30px] ${
            isSelected ? "ring-2 ring-white" : ""
          } ${
            !isQrScanned ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-pressed={isSelected}
          aria-label={`Vote for ${candidate.name}`}
        >
          <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[normal]">
            VOTE
          </span>
        </button>

        <Link
          href={`/user/vote/view/${candidate.id}`}
          className="w-[137px] h-[45px] px-[13px] py-[7px] bg-white border border-solid border-[#232f9b] flex items-center justify-center rounded-[30px] hover:bg-[#232f9b]/5 transition-colors"
          aria-label={`View details for ${candidate.name}`}
        >
          <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#232f9b] text-xs tracking-[0] leading-[normal]">
            VIEW DETAIL
          </span>
        </Link>
      </div>
    </article>
  );
}
