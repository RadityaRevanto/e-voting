import React, { useState } from "react";
import UserDashboardlayout from "../../_components/userlayout";

interface Candidate {
  id: number;
  name: string;
  department: string;
  image: string;
}

const DashboardUser: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const candidates: Candidate[] = [
    {
      id: 1,
      name: "Raditya Gavra",
      department: "System Information",
      image: "/assets/images/user/imges.jpg",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      department: "Community Development",
      image: "/assets/images/user/imges.jpg",
    },
    {
      id: 3,
      name: "Michael Chen",
      department: "Economic Affairs",
      image: "/assets/images/user/imges.jpg",
    },
  ];

  const handleVote = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };

  const handleSubmitVote = () => {
    if (selectedCandidate) {
      alert(`Vote submitted for candidate ${selectedCandidate}`);
    }
  };

  const handleViewDetail = (candidateId: number) => {
    console.log(`View details for candidate ${candidateId}`);
  };

  return (
    <UserDashboardlayout>
      <div className="min-h-screen bg-gray-50">
        {/* Voting Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[#53589a] text-2xl md:text-3xl font-bold mb-3">
              YOU MAY NOW CAST YOUR VOTES!
            </h1>
            <h2 className="text-[#53589a] text-xl md:text-2xl font-bold mb-4">
              Village Head Election
            </h2>
            <p className="text-[#53599b] text-base md:text-lg">
              You Can Only Vote For One Candidate
            </p>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-md p-5 border-2 transition-all duration-300 ${
                  selectedCandidate === candidate.id
                    ? "border-[#1a2370] shadow-lg"
                    : "border-gray-200 hover:shadow-lg"
                }`}
              >
                {/* Candidate Image */}
                <div className="flex justify-center mb-5">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#eaecff] flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-[#53589a] mb-2">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-[#53599b] font-medium">
                    {candidate.department}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleVote(candidate.id)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                      selectedCandidate === candidate.id
                        ? "bg-[#1a2370] text-white"
                        : "bg-[#232f9b] text-white hover:bg-[#1a2370]"
                    }`}
                  >
                    VOTE
                  </button>
                  <button
                    onClick={() => handleViewDetail(candidate.id)}
                    className="px-5 py-2.5 border-2 border-[#232f9b] text-[#232f9b] rounded-full font-bold text-sm hover:bg-[#eaecff] transition-colors"
                  >
                    VIEW DETAIL
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Warning Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <span className="text-red-500 font-medium">
                ⚠️ Double Check Your Vote Before Submitted
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmitVote}
              disabled={!selectedCandidate}
              className={`px-12 py-3.5 rounded-full font-bold text-base md:text-lg shadow-lg transition-all duration-300 ${
                selectedCandidate
                  ? "bg-[#232f9b] hover:bg-[#1a2370] text-white transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              SUBMIT VOTE
            </button>
          </div>
        </div>
      </div>
    </UserDashboardlayout>
  );
};

export default DashboardUser;