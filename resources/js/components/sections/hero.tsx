export default function Hero() {
    return (
        <section
            id="hero"
            className="relative mt-20 min-h-screen w-full bg-white"
        >
            <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 pt-16 pb-20 md:flex-row md:gap-16 md:px-10 lg:max-w-7xl lg:gap-24">
                {/* Left content */}
                <div className="max-w-xl space-y-4 text-center md:space-y-5 md:text-left">
                    <h1 className="text-4xl font-extrabold leading-tight text-black md:text-5xl lg:text-6xl">
                        <span className="block">This is Online Voting</span>
                        <span className="mt-2 flex items-center justify-center gap-3 md:mt-3 md:justify-start md:gap-4">
                            <span className="block">System</span>
                            {/* Badge di samping teks */}
                            <img
                                src="/assets/images/hero/vote.png"
                                alt="I'Vote badge"
                                className="ml-2 h-16 w-auto md:ml-3 md:h-16 lg:h-24"
                            />
                        </span>
                    </h1>

                    <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-600 md:mx-0 md:text-base">
                        Help find solutions with intuitive and in accordance
                        with client business goals, we provide a high-quality
                        services.
                    </p>

                    <div className="mt-7 flex justify-center md:justify-start">
                        <button
                            type="button"
                            className="rounded-full bg-[#3943B7] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3943B7]/40 transition hover:bg-[#2f379c] md:px-10 md:py-3.5 md:text-base"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* Right illustration */}
                <div className="relative mb-20 -mt-36 flex w-full items-center justify-center md:mt-20 md:w-auto">
                    {/* Ellipse background */}
                    <img
                        src="/assets/images/hero/Ellipse.png"
                        alt="Background ellipse"
                        className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 select-none md:h-[340px] md:w-[340px] lg:h-[420px] lg:w-[420px]"
                    />

                    {/* Floating icons around phone */}
                    <div className="pointer-events-none absolute -top-4 left-[18%] hidden md:block md:-top-26 md:left-[5%] lg:-top-32 lg:left-[2%]">
                        <img
                            src="/assets/images/hero/figma.png"
                            alt="Figma icon"
                            className="h-10 w-10 md:h-18 md:w-18 lg:h-25 lg:w-25"
                        />
                    </div>
                    <div className="pointer-events-none absolute top-2 right-[18%] hidden md:block md:-top-24 md:right-[5%] lg:-top-32 lg:right-[2%]">
                        <img
                            src="/assets/images/hero/xl.png"
                            alt="XL icon"
                            className="h-10 w-10 md:h-18 md:w-18 lg:h-25 lg:w-25"
                        />
                    </div>
                    <div className="pointer-events-none absolute -bottom-4 right-[26%] hidden md:block md:-top-38 md:left-[-10%] lg:-top-42 lg:left-[-12%]">
                        <img
                            src="/assets/images/hero/diamond.png"
                            alt="Diamond icon"
                            className="h-10 w-10 md:h-18 md:w-18 lg:h-20 lg:w-20"
                        />
                    </div>

                    {/* Phone mockup */}
                    <img
                        src="/assets/images/hero/hp-hero.png"
                        alt="Voting app preview"
                        className="relative z-10 -mt-10 h-[320px] w-auto md:-mt-22 md:h-[460px] lg:-mt-29 lg:h-[520px]"
                    />

                    {/* Floating icon */}
                    <img
                        src="/assets/images/hero/user-hero.png"
                        alt="User icon"
                        className="pointer-events-none absolute bottom-[-96px] left-[54%] z-15 h-40 w-48 -translate-x-1/2 select-none md:bottom-[-120px] md:h-52 md:w-60 lg:bottom-[-140px] lg:h-60 lg:w-64"
                    />
                </div>
            </div>

            {/* Decorative bottom band for creator section overlap */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F7F7FC]" />
        </section>
    );
}