import React from "react";

export function ElectionTitle() {
  return (
    <section aria-labelledby="election-title" className="mb-12 text-center">
      <h2
        id="election-title"
        className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-[36px] tracking-[0] leading-[normal] mb-5"
      >
        Village Head Election
      </h2>

      <p className="[font-family:'Poppins-Medium',Helvetica] font-medium text-[#53599b] text-lg tracking-[0] leading-[normal]">
        You Can Only Vote For One Candidates
      </p>
    </section>
  );
}
