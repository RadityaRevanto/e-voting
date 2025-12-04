import React from "react";

export const OngoingElectionSection = (): React.ReactElement => {
    const handleVoteClick = () => {
        console.log("Vote Now clicked");
    };

    return (
        <section
            className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6 pb-0 relative overflow-hidden"
            aria-labelledby="ongoing-election-title"
        >
            <header className="text-[#53599b] text-lg md:text-xl font-bold mb-3 md:mb-4">
                Ongoing Selection
            </header>

            <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex-1 pb-5 mt-2 md:mt-4">
                    <h2
                        id="ongoing-election-title"
                        className="text-[#53599b] leading-[1.5] text-3xl md:text-4xl xl:text-5xl font-extrabold mb-3 md:mb-4 xl:mb-6"
                    >
                        Village Head Elevtion
                    </h2>

                    <button
                        onClick={handleVoteClick}
                        className="mt-8 md:mt-12 xl:mt-20 w-full md:w-[150px] xl:w-[181px] h-[36px] md:h-[38px] xl:h-[41px] bg-white rounded-[25px] md:rounded-[30px] border-[2px] md:border-[3px] border-solid border-[#53599b] cursor-pointer hover:bg-[#53599b] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#53599b] focus:ring-offset-2 flex items-center justify-center"
                        aria-label="Vote now for Village Head Election"
                    >
                        <span className="text-[#53599b] hover:text-white text-base md:text-lg xl:text-xl font-medium">
                            Vote Now
                        </span>
                    </button>
                </div>
                <div className="hidden -mt-15 w-100 md:pb-0 md:flex self-end ">
                    <img
                        className="w-[300px] md:w-[400px] xl:w-[500px] h-[210px] md:h-[280px] xl:h-[350px] object-contain"
                        alt="Village Head Election illustration showing people voting"
                        src="/assets/images/admin/dashboard/selection.png"
                    />
                </div>
            </div>
        </section>
    );
};
