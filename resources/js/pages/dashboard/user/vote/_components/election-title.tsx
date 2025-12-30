import React from "react";

export function ElectionTitle() {
  return (
    <section aria-labelledby="election-title" className="mb-10 text-center px-4">
      <h2
        id="election-title"
        className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-2xl sm:text-3xl md:text-[36px] tracking-[0] leading-tight mb-4"
      >
        Village Head Election
      </h2>

      <p className="[font-family:'Poppins-Medium',Helvetica] font-medium text-[#53599b] text-base sm:text-lg tracking-[0] leading-normal max-w-2xl mx-auto">
        You Can Only Vote For One Candidate
      </p>
    </section>
  );
}
