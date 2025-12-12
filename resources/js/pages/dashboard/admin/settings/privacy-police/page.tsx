import AdminDashboardlayout from "../../../_components/adminlayout";
import React from "react";

export default function AdminPrivacyPolicePage() {
    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            PRIVACY POLICY
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    <div className="space-y-8 text-gray-700">
                        {/* Section 1: Pengenalan */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Pengenalan
                            </h2>
                            <p className="text-base leading-relaxed">
                                Sistem E-Voting menghormati privasi Anda dan berkomitmen untuk melindungi informasi pribadi 
                                yang Anda berikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, 
                                menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan platform e-voting kami.
                            </p>
                            <p className="text-base leading-relaxed">
                                Dengan menggunakan platform ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai 
                                dengan kebijakan yang dijelaskan di bawah ini.
                            </p>
                        </section>

                        {/* Section 2: Informasi yang Dikumpulkan */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Informasi yang Kami Kumpulkan
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan kami:
                            </p>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Informasi Pribadi
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                        <li>Nama lengkap</li>
                                        <li>Nomor identitas (NIK/KTP)</li>
                                        <li>Alamat email</li>
                                        <li>Nomor telepon</li>
                                        <li>Alamat tempat tinggal</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Informasi Teknis
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                        <li>Alamat IP</li>
                                        <li>Jenis perangkat dan browser yang digunakan</li>
                                        <li>Log aktivitas sistem</li>
                                        <li>Data autentikasi dan sesi</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Data Pemilihan
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                        <li>Pilihan suara yang telah diberikan (dienkripsi dan anonim)</li>
                                        <li>Waktu dan tanggal pemilihan</li>
                                        <li>Status verifikasi identitas</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Cara Penggunaan Data */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Cara Kami Menggunakan Informasi
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>
                                    <strong>Verifikasi Identitas:</strong> Memastikan bahwa hanya pengguna yang berwenang 
                                    yang dapat mengakses dan menggunakan sistem pemilihan
                                </li>
                                <li>
                                    <strong>Proses Pemilihan:</strong> Memfasilitasi proses pemilihan elektronik yang aman 
                                    dan transparan
                                </li>
                                <li>
                                    <strong>Keamanan Sistem:</strong> Mencegah penipuan, penyalahgunaan, dan aktivitas 
                                    yang tidak sah
                                </li>
                                <li>
                                    <strong>Peningkatan Layanan:</strong> Menganalisis penggunaan platform untuk 
                                    meningkatkan pengalaman pengguna
                                </li>
                                <li>
                                    <strong>Komunikasi:</strong> Mengirim notifikasi penting terkait pemilihan dan 
                                    pembaruan sistem
                                </li>
                                <li>
                                    <strong>Kepatuhan Hukum:</strong> Memenuhi kewajiban hukum dan peraturan yang berlaku
                                </li>
                            </ul>
                        </section>

                        {/* Section 4: Keamanan Data */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Keamanan Data
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Kami menerapkan berbagai langkah keamanan untuk melindungi informasi pribadi Anda:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Enkripsi Data
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Semua data pribadi dienkripsi menggunakan teknologi SSL/TLS dan enkripsi 
                                        end-to-end untuk melindungi informasi selama transmisi dan penyimpanan.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Kontrol Akses
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Akses ke data pribadi dibatasi hanya untuk personel yang berwenang dan 
                                        menggunakan autentikasi multi-faktor.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Anonimitas Suara
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Pilihan suara Anda dipisahkan dari identitas pribadi Anda setelah verifikasi 
                                        untuk memastikan anonimitas pemilihan.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Audit dan Monitoring
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Sistem kami secara rutin diaudit dan dimonitor untuk mendeteksi dan mencegah 
                                        aktivitas yang mencurigakan.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Hak Pengguna */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Hak Anda
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Sebagai pengguna platform, Anda memiliki hak-hak berikut:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>
                                    <strong>Hak Akses:</strong> Anda berhak untuk mengakses informasi pribadi yang 
                                    kami simpan tentang Anda
                                </li>
                                <li>
                                    <strong>Hak Koreksi:</strong> Anda dapat meminta koreksi terhadap informasi pribadi 
                                    yang tidak akurat atau tidak lengkap
                                </li>
                                <li>
                                    <strong>Hak Penghapusan:</strong> Dalam kondisi tertentu, Anda dapat meminta 
                                    penghapusan data pribadi Anda
                                </li>
                                <li>
                                    <strong>Hak Penolakan:</strong> Anda dapat menolak pengumpulan atau penggunaan 
                                    data tertentu, dengan memahami bahwa hal ini dapat membatasi akses ke layanan
                                </li>
                                <li>
                                    <strong>Hak Portabilitas:</strong> Anda dapat meminta salinan data pribadi Anda 
                                    dalam format yang dapat dibaca
                                </li>
                            </ul>
                        </section>

                        {/* Section 6: Pembagian Data */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Pembagian Data dengan Pihak Ketiga
                            </h2>
                            <p className="text-base leading-relaxed">
                                Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga 
                                untuk tujuan komersial. Kami hanya dapat membagikan data dalam situasi berikut:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside mt-3">
                                <li>Dengan persetujuan eksplisit dari Anda</li>
                                <li>Untuk memenuhi kewajiban hukum atau perintah pengadilan</li>
                                <li>Dengan penyedia layanan tepercaya yang membantu operasi platform (dengan perjanjian 
                                    kerahasiaan yang ketat)</li>
                                <li>Untuk melindungi hak, properti, atau keamanan kami dan pengguna lainnya</li>
                            </ul>
                        </section>

                        {/* Section 7: Penyimpanan Data */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Penyimpanan dan Retensi Data
                            </h2>
                            <p className="text-base leading-relaxed">
                                Data pribadi Anda disimpan di server yang aman dan hanya disimpan selama diperlukan untuk 
                                tujuan yang dijelaskan dalam kebijakan ini, atau sesuai dengan persyaratan hukum. Data 
                                pemilihan yang telah dianonimkan dapat disimpan lebih lama untuk tujuan audit dan transparansi, 
                                namun tanpa dapat dihubungkan kembali ke identitas pribadi Anda.
                            </p>
                        </section>

                        {/* Section 8: Perubahan Kebijakan */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Perubahan Kebijakan Privasi
                            </h2>
                            <p className="text-base leading-relaxed">
                                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan 
                                diberitahukan melalui notifikasi di platform atau melalui email. Kami menyarankan Anda untuk 
                                meninjau kebijakan ini secara berkala untuk tetap mengetahui bagaimana kami melindungi 
                                informasi Anda.
                            </p>
                        </section>

                        {/* Section 9: Kontak */}
                        <section className="space-y-4 pt-4 border-t border-gray-200">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Hubungi Kami
                            </h2>
                            <p className="text-base leading-relaxed">
                                Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini 
                                atau cara kami menangani data pribadi Anda, silakan hubungi tim privasi kami. Kami akan 
                                merespons permintaan Anda dalam waktu yang wajar.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}