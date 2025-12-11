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
      <div className="bg-white w-full min-h-screen flex flex-col items-center py-16 px-4">
        <header className="mb-15 -mt-10 w-full">
          <h1 className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#53589a] text-[38px] tracking-[0] leading-[normal] text-left">
            YOU MAY NOW CAST YOUR VOTES !
          </h1>
        </header>

        <main className="flex flex-col items-center w-full">
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

          <section aria-label="Candidates" className="mb-16">
            <div className="flex flex-wrap justify-center gap-8">
              {candidates.map((candidate) => (
                <article
                  key={candidate.id}
                  className={`relative w-[380px] h-[450px] ${
                    selectedCandidate === candidate.id
                      ? "border-[3px] border-solid border-[#232f9b] rounded-[20px]"
                      : ""
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
                      onClick={() => handleVote(candidate.id)}
                      className={`w-[135px] h-[45px] px-[27px] py-[7px] bg-[#232f9b] flex items-center justify-center rounded-[30px] ${
                        selectedCandidate === candidate.id
                          ? "ring-2 ring-white"
                          : ""
                      }`}
                      aria-pressed={selectedCandidate === candidate.id}
                      aria-label={`Vote for ${candidate.name}`}
                    >
                      <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-white text-sm tracking-[0] leading-[normal]">
                        VOTE
                      </span>
                    </button>

                    <button
                      type="button"
                      className="w-[137px] h-[45px] px-[13px] py-[7px] bg-white border border-solid border-[#232f9b] flex items-center justify-center rounded-[30px]"
                      aria-label={`View details for ${candidate.name}`}
                    >
                      <span className="[font-family:'Poppins-Bold',Helvetica] font-bold text-[#232f9b] text-xs tracking-[0] leading-[normal]">
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
