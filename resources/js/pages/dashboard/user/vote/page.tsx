import React, { useState } from "react";
import UserDashboardlayout from "../../_components/userlayout";

interface Candidate {
  id: number;
  name: string;
  department: string;
  image: string;
}

export default function UserVotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Raditya Gavra",
      department: "System Information",
      image: "/assets/images/user/imges.jpg",
    },
    {
      id: 2,
      name: "Raditya Gavra",
      department: "System Information",
      image: "/assets/images/user/imges.jpg",
    },
    {
      id: 3,
      name: "Raditya Gavra",
      department: "System Information",
      image: "/assets/images/user/imges.jpg",
    },
  ];

  const handleVote = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };

  const handleSubmit = () => {
    if (selectedCandidate !== null) {
      console.log(`Vote submitted for candidate ${selectedCandidate}`);
    }
  };

  return (
    <UserDashboardlayout>
      <div className="bg-white w-full min-h-screen flex flex-col py-16 px-4">
        <header className="mb-8">
          <h1 className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-[38px] tracking-[0] leading-[normal] text-center">
            YOU MAY NOW CAST YOUR VOTES !
          </h1>
        </header>

        <main className="flex flex-col items-center w-full max-w-7xl">
          <section aria-labelledby="election-title" className="mb-12 text-center">
            <h2
              id="election-title"
              className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-[32px] tracking-[0] leading-[normal] mb-2"
            >
              Village Head Election
            </h2>

            <p className="[font-family:'Poppins-Medium',Helvetica] font-medium text-[#53599b] text-xl tracking-[0] leading-[normal]">
              You Can Only Vote For One Candidates
            </p>
          </section>

          <section aria-label="Candidates" className="mb-16">
            <div className="flex flex-wrap justify-center gap-8">
              {candidates.map((candidate) => (
                <article
                  key={candidate.id}
                  className={`relative w-[254px] h-[300px] ${
                    selectedCandidate === candidate.id
                      ? "border-[3px] border-solid border-[#232f9b] rounded-[20px]"
                      : ""
                  }`}
                  aria-labelledby={`candidate-name-${candidate.id}`}
                >
                  <div className="w-[250px] h-[300px] rounded-[20px] bg-[linear-gradient(180deg,rgba(204,211,227,1)_0%,rgba(229,232,240,1)_42%,rgba(255,255,255,1)_100%)] shadow-[0px_4px_4px_#00000040] mx-auto" />

                  <div className="absolute top-[29px] left-1/2 transform -translate-x-1/2 w-[132px] h-[132px] bg-white rounded-[66px]" />

                  <img
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[125px] h-[125px] rounded-full object-cover"
                    alt={`${candidate.name} profile picture`}
                    src={candidate.image}
                  />

                  <h3
                    id={`candidate-name-${candidate.id}`}
                    className="absolute top-[177px] left-1/2 transform -translate-x-1/2 w-[155px] [font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-xl tracking-[0] leading-[normal] whitespace-nowrap text-center"
                  >
                    {candidate.name}
                  </h3>

                  <p className="absolute top-[206px] left-1/2 transform -translate-x-1/2 w-[120px] [font-family:'Poppins-Medium',Helvetica] font-medium text-[#53599b] text-xs tracking-[0] leading-[normal] text-center">
                    {candidate.department}
                  </p>

                  <div className="absolute top-[252px] left-1/2 transform -translate-x-1/2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleVote(candidate.id)}
                      className={`w-[90px] h-[30px] px-[27px] py-[7px] bg-[#232f9b] flex items-center justify-center rounded-[30px] ${
                        selectedCandidate === candidate.id
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                      aria-pressed={selectedCandidate === candidate.id}
                      aria-label={`Vote for ${candidate.name}`}
                    >
                      <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-white text-xs tracking-[0] leading-[normal]">
                        VOTE
                      </span>
                    </button>

                    <button
                      type="button"
                      className="w-[91px] h-[30px] px-[13px] py-[7px] bg-white border border-solid border-[#232f9b] flex items-center justify-center rounded-[30px]"
                      aria-label={`View details for ${candidate.name}`}
                    >
                      <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#232f9b] text-[10px] tracking-[0] leading-[normal]">
                        VIEW DETAIL
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-live="polite" aria-atomic="true" className="mb-4">
            <p className="[font-family:'Poppins-Regular',Helvetica] font-normal text-[#eb3723] text-sm tracking-[0] leading-[normal] text-center">
              Double Check Your Vote Before Submited
            </p>
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedCandidate === null}
            className={`w-[230px] h-[45px] bg-[#232f9b] rounded-[30px] border-2 border-solid border-white shadow-[0px_4px_4px_#00000040] flex items-center justify-center ${
              selectedCandidate === null
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#1a2470] transition-colors"
            }`}
            aria-label="Submit your vote"
          >
            <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal]">
              SUBMIT VOTE
            </span>
          </button>
        </main>
      </div>
    </UserDashboardlayout>
  );
}
