export default function About() {
    return (
        <section id="about">
            <div className="relative min-h-screen w-full bg-white px-6 py-20 md:px-10 lg:px-16 flex items-center">
                <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
                    {/* Eyebrow */}
                    <p className="text-xs md:text-sm tracking-[0.3em] text-gray-500 uppercase text-center mb-4">
                        About Us
                    </p>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 text-center mb-4">
                        What Sets Us Apart?
                    </h2>

                    {/* Subtitle */}
                    <p className="max-w-2xl mx-auto text-center text-sm md:text-base lg:text-lg text-gray-600 mb-14">
                        Sistem E-Voting kami tidak hanya memudahkan proses pemilihan, tetapi juga menghadirkan pengalaman voting
                        yang aman, transparan, dan modern untuk setiap organisasi.
                    </p>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Card 1 */}
                        <div className="group relative bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl px-8 py-10 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            {/* Number badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-4 py-2">
                                    <span className="text-xs font-medium tracking-[0.25em] text-indigo-700">01</span>
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                Keamanan Terjamin
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                                Setiap suara dienkripsi dan diproses melalui sistem yang telah dirancang dengan standar
                                keamanan tinggi, sehingga risiko manipulasi data dapat diminimalkan.
                            </p>

                            <button className="inline-flex items-center text-xs md:text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                                Pelajari lebih lanjut
                                <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </button>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-3xl px-8 py-10 shadow-md hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                            {/* Number badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-4 py-2">
                                    <span className="text-xs font-medium tracking-[0.25em] text-indigo-700">02</span>
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                Transparansi Proses
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                                Setiap tahapan voting dapat ditelusuri dan diaudit, memberikan keyakinan penuh bahwa hasil
                                akhir merupakan cerminan suara pemilih yang sebenarnya.
                            </p>

                            <button className="inline-flex items-center text-xs md:text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                                Pelajari lebih lanjut
                                <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </button>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative bg-white/60 backdrop-blur-sm border border-gray-100 rounded-3xl px-8 py-10 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            {/* Number badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-4 py-2">
                                    <span className="text-xs font-medium tracking-[0.25em] text-indigo-700">03</span>
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                Mudah Digunakan
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                                Antarmuka yang sederhana dan responsif memudahkan pemilih untuk melakukan voting kapan saja
                                dan di mana saja, tanpa mengorbankan kenyamanan maupun keamanan.
                            </p>

                            <button className="inline-flex items-center text-xs md:text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                                Pelajari lebih lanjut
                                <span className="ml-2 inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}