import AdminDashboardlayout from "../../../_components/adminlayout";
import React from "react";

export default function AdminAboutUsPage() {
    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            ABOUT US
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    <div className="space-y-8 text-gray-700">
                        {/* Section 1: Tentang Kami */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Tentang Kami
                            </h2>
                            <p className="text-base leading-relaxed">
                                Sistem E-Voting adalah platform digital inovatif yang dirancang untuk memfasilitasi 
                                proses pemilihan secara elektronik dengan aman, transparan, dan efisien. Kami berkomitmen 
                                untuk menyediakan solusi teknologi terdepan dalam dunia demokrasi digital.
                            </p>
                        </section>

                        {/* Section 2: Visi */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Visi
                            </h2>
                            <p className="text-base leading-relaxed">
                                Menjadi platform e-voting terpercaya dan terdepan di Indonesia yang memungkinkan 
                                setiap warga negara untuk berpartisipasi dalam proses demokrasi dengan mudah, aman, 
                                dan transparan.
                            </p>
                        </section>

                        {/* Section 3: Misi */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Misi
                            </h2>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>
                                    Menyediakan sistem pemilihan elektronik yang aman, cepat, dan dapat diakses oleh 
                                    semua kalangan
                                </li>
                                <li>
                                    Meningkatkan transparansi dan akuntabilitas dalam proses pemilihan melalui teknologi 
                                    blockchain dan enkripsi tingkat tinggi
                                </li>
                                <li>
                                    Mempermudah proses pemilihan dengan antarmuka yang user-friendly dan dapat diakses 
                                    melalui berbagai perangkat
                                </li>
                                <li>
                                    Menjaga integritas data dan privasi pengguna dengan standar keamanan internasional
                                </li>
                                <li>
                                    Memberikan dukungan teknis dan pelatihan yang komprehensif untuk memastikan 
                                    keberhasilan implementasi sistem
                                </li>
                            </ul>
                        </section>

                        {/* Section 4: Nilai-Nilai */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Nilai-Nilai Kami
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Transparansi
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Setiap proses pemilihan dapat diaudit dan diverifikasi secara publik untuk 
                                        memastikan keadilan dan kejujuran.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Keamanan
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Menggunakan teknologi enkripsi mutakhir dan protokol keamanan untuk melindungi 
                                        data dan privasi pengguna.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Integritas
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Memastikan setiap suara dihitung dengan akurat dan tidak dapat dimanipulasi 
                                        atau diubah.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Aksesibilitas
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Platform yang mudah digunakan dan dapat diakses oleh semua pengguna, termasuk 
                                        mereka yang memiliki keterbatasan teknologi.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Teknologi */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Teknologi yang Digunakan
                            </h2>
                            <p className="text-base leading-relaxed">
                                Sistem E-Voting dibangun dengan teknologi modern dan terdepan, termasuk enkripsi end-to-end, 
                                blockchain untuk audit trail, dan sistem autentikasi multi-faktor. Platform ini dirancang 
                                untuk menangani pemilihan dalam skala besar dengan performa tinggi dan keandalan yang 
                                maksimal.
                            </p>
                        </section>

                        {/* Section 6: Kontak */}
                        <section className="space-y-4 pt-4 border-t border-gray-200">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Hubungi Kami
                            </h2>
                            <p className="text-base leading-relaxed">
                                Jika Anda memiliki pertanyaan, saran, atau membutuhkan bantuan, jangan ragu untuk 
                                menghubungi tim support kami. Kami siap membantu Anda dalam setiap langkah proses 
                                pemilihan elektronik.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}   