export default function About() {
    return (
        <section id="about">
            <div className="relative min-h-screen w-full bg-white px-6 py-20 md:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl lg:max-w-7xl">
                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1a237e] mb-8 md:mb-12 text-center">
                        About Us
                    </h2>

                    {/* Main Content */}
                    <div className="space-y-12 md:space-y-16">
                        {/* Introduction */}
                        <div className="text-center max-w-4xl mx-auto">
                            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
                                Sistem E-Voting adalah platform pemilihan suara digital yang dirancang untuk memberikan pengalaman voting yang aman, transparan, dan efisien.
                            </p>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Kami berkomitmen untuk menyediakan solusi teknologi terdepan yang memastikan setiap suara dihitung dengan akurat dan proses pemilihan berjalan dengan lancar.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-16">
                            {/* Feature 1 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Keamanan Tinggi
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Sistem kami menggunakan teknologi enkripsi canggih dan autentikasi multi-faktor untuk memastikan keamanan data dan privasi pemilih.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Transparansi
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Setiap proses voting dapat diaudit dan diverifikasi, memberikan jaminan bahwa hasil pemilihan akurat dan dapat dipercaya.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Cepat & Efisien
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Proses voting yang mudah dan cepat, dengan hasil yang dapat langsung diketahui setelah periode voting berakhir.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Akses Mudah
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Platform yang responsif dan mudah digunakan, dapat diakses melalui berbagai perangkat untuk kenyamanan maksimal.
                                </p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Real-time Analytics
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Dashboard analitik yang menyediakan data real-time untuk monitoring proses voting dan hasil pemilihan.
                                </p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-gradient-to-br from-[#F7F7FC] to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-[#3943B7] rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#1a237e] mb-4">
                                    Manajemen Pengguna
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Sistem manajemen pengguna yang komprehensif untuk mengelola pemilih, kandidat, dan administrator dengan mudah.
                                </p>
                            </div>
                        </div>

                        {/* Mission & Vision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-20">
                            {/* Mission */}
                            <div className="bg-gradient-to-br from-[#3943B7] to-[#1a237e] p-8 md:p-10 rounded-2xl text-white shadow-xl">
                                <div className="mb-6">
                                    <svg className="w-12 h-12 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    Misi Kami
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed opacity-90">
                                    Menyediakan platform e-voting yang aman, transparan, dan mudah digunakan untuk mendukung proses demokrasi digital yang lebih baik di era modern.
                                </p>
                            </div>

                            {/* Vision */}
                            <div className="bg-gradient-to-br from-[#3943B7] to-[#1a237e] p-8 md:p-10 rounded-2xl text-white shadow-xl">
                                <div className="mb-6">
                                    <svg className="w-12 h-12 text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    Visi Kami
                                </h3>
                                <p className="text-base md:text-lg leading-relaxed opacity-90">
                                    Menjadi platform e-voting terdepan yang diandalkan untuk berbagai jenis pemilihan, dengan teknologi terbaru dan standar keamanan tertinggi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}