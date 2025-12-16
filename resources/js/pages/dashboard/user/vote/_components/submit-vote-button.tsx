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
          Double Check Your Vote Before Submited
        </p>
      </section>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`w-[230px] h-[45px] bg-[#232f9b] rounded-[30px] border-2 border-solid border-white shadow-[0px_4px_4px_#00000040] flex items-center justify-center ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#1a2470] transition-colors"
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
