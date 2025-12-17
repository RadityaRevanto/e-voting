export default function Identity() {
    return (
        <section id="identity">
            <div className="relative w-full bg-[#F7F7FC] flex flex-col items-center justify-center px-6 py-20 md:-mt-80 lg:-mt-1 overflow-hidden">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] mb-12 md:mb-26 md:-mt-10 z-10">
                    Creator System
                </h2>

                {/* Names Container */}
                <div className="flex flex-col gap-8 md:gap-25 items-center w-full">
                    {/* Top Row - 3 names */}
                    <div className="w-full overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-62 items-center justify-center animate-parallax-left whitespace-nowrap">
                            {/* Duplicate set 1 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aditya Eka Narayan
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Mch Raditya Revanto
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Javier Gavra Abhinaya
                            </p>
                            {/* Duplicate set 2 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aditya Eka Narayan
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Mch Raditya Revanto
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Javier Gavra Abhinaya
                            </p>
                            {/* Duplicate set 3 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aditya Eka Narayan
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Mch Raditya Revanto
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Javier Gavra Abhinaya
                            </p>
                        </div>
                    </div>

                    {/* Bottom Row - 2 names */}
                    <div className="w-full overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-62 items-center justify-center animate-parallax-right whitespace-nowrap">
                            {/* Duplicate set 1 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aisha Dwi Rahmawati
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Clarista Felisya W 
                            </p>
                            {/* Duplicate set 2 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aisha Dwi Rahmawati
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Clarista Felisya W 
                            </p>
                            {/* Duplicate set 3 */}
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Aisha Dwi Rahmawati
                            </p>
                            <p className="text-lg md:text-3xl text-slate-600 font-medium">
                                Clarista Felisya W 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}