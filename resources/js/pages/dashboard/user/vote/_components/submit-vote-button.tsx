import React from "react";

interface SubmitVoteButtonProps {
  disabled: boolean;
  onSubmit: () => void;
}

export function SubmitVoteButton({ disabled, onSubmit }: SubmitVoteButtonProps) {
  return (
    <>
      <section aria-live="polite" aria-atomic="true" className="mb-4">
        <p className="[font-family:'Poppins-Regular',Helvetica] font-normal text-[#eb3723] text-sm tracking-[0] leading-[normal] text-center">
          Double Check Your Vote Before Submitted
        </p>
      </section>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`w-[230px] h-[45px] bg-[#232f9b] rounded-[30px] border-2 border-solid border-white shadow-[0px_4px_12px_rgba(35,47,155,0.4)] flex items-center justify-center transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#1a2470] hover:shadow-[0px_6px_16px_rgba(35,47,155,0.5)] active:scale-[0.95]"
        }`}
        aria-label="Submit your vote"
      >
        <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal]">
          SUBMIT VOTE
        </span>
      </button>
    </>
  );
}
