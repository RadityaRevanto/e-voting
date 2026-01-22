import AdminDashboardlayout from "../../../_components/adminlayout";
import React from "react";

export default function AdminTermOfPage() {
    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            TERMS OF SERVICE
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
                                Syarat dan Ketentuan ini mengatur penggunaan platform Sistem E-Voting. Dengan mengakses 
                                dan menggunakan platform ini, Anda menyetujui untuk terikat oleh syarat dan ketentuan 
                                yang dijelaskan di bawah ini. Jika Anda tidak setuju dengan syarat dan ketentuan ini, 
                                mohon untuk tidak menggunakan platform ini.
                            </p>
                            <p className="text-base leading-relaxed">
                                Kami berhak untuk mengubah, memodifikasi, atau memperbarui syarat dan ketentuan ini 
                                kapan saja tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan platform setelah 
                                perubahan berarti Anda menerima syarat dan ketentuan yang telah diperbarui.
                            </p>
                        </section>

                        {/* Section 2: Penerimaan Syarat */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Penerimaan Syarat dan Ketentuan
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Dengan menggunakan platform Sistem E-Voting, Anda menyatakan dan menjamin bahwa:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>
                                    Anda telah membaca, memahami, dan menyetujui untuk terikat oleh syarat dan ketentuan ini
                                </li>
                                <li>
                                    Anda memiliki kewenangan hukum untuk menggunakan platform sesuai dengan hukum yang berlaku
                                </li>
                                <li>
                                    Informasi yang Anda berikan adalah akurat, lengkap, dan terkini
                                </li>
                                <li>
                                    Anda akan menggunakan platform hanya untuk tujuan yang sah dan sesuai dengan peraturan 
                                    yang berlaku
                                </li>
                                <li>
                                    Anda tidak akan melakukan aktivitas yang dapat merusak, mengganggu, atau membahayakan 
                                    sistem atau pengguna lain
                                </li>
                            </ul>
                        </section>

                        {/* Section 3: Penggunaan Platform */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Penggunaan Platform
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Hak Penggunaan
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Kami memberikan Anda lisensi terbatas, non-eksklusif, dan tidak dapat dialihkan 
                                        untuk mengakses dan menggunakan platform untuk tujuan pemilihan elektronik sesuai 
                                        dengan syarat dan ketentuan ini.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Pembatasan Penggunaan
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Anda dilarang untuk:
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside ml-2">
                                        <li>Mencoba mengakses akun atau data pengguna lain tanpa izin</li>
                                        <li>Menggunakan platform untuk aktivitas ilegal atau melanggar hukum</li>
                                        <li>Mengganggu atau merusak keamanan sistem</li>
                                        <li>Mencoba memanipulasi hasil pemilihan</li>
                                        <li>Menyebarkan malware, virus, atau kode berbahaya lainnya</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Akun Pengguna */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Akun Pengguna
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Untuk menggunakan platform, Anda mungkin perlu membuat akun. Dalam hal ini:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>
                                    <strong>Keamanan Akun:</strong> Anda bertanggung jawab untuk menjaga kerahasiaan 
                                    kredensial akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda
                                </li>
                                <li>
                                    <strong>Verifikasi Identitas:</strong> Anda harus memberikan informasi yang akurat 
                                    dan lengkap untuk verifikasi identitas
                                </li>
                                <li>
                                    <strong>Notifikasi:</strong> Segera beri tahu kami jika Anda mengetahui atau 
                                    mencurigai penggunaan tidak sah atas akun Anda
                                </li>
                                <li>
                                    <strong>Penangguhan:</strong> Kami berhak menangguhkan atau menghentikan akun Anda 
                                    jika melanggar syarat dan ketentuan ini
                                </li>
                            </ul>
                        </section>

                        {/* Section 5: Proses Pemilihan */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Proses Pemilihan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Integritas Pemilihan
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Setiap pengguna hanya dapat memberikan suara sekali dalam setiap pemilihan. 
                                        Sistem dirancang untuk mencegah pemilihan ganda dan memastikan integritas proses.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Anonimitas
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Pilihan suara Anda dirahasiakan dan tidak dapat dihubungkan dengan identitas 
                                        pribadi Anda setelah proses verifikasi selesai.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Finalitas
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Setelah Anda mengirimkan suara, pilihan tersebut tidak dapat diubah atau dibatalkan. 
                                        Pastikan Anda telah memilih dengan hati-hati sebelum mengirimkan.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-[#53589a] text-lg mb-2">
                                        Hasil Pemilihan
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Hasil pemilihan akan diumumkan sesuai dengan jadwal yang telah ditentukan. 
                                        Hasil final bersifat mengikat dan tidak dapat diganggu gugat.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 6: Kekayaan Intelektual */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Kekayaan Intelektual
                            </h2>
                            <p className="text-base leading-relaxed">
                                Semua konten, fitur, dan fungsionalitas platform, termasuk namun tidak terbatas pada 
                                desain, teks, grafik, logo, ikon, gambar, dan perangkat lunak, adalah milik kami atau 
                                pemberi lisensi kami dan dilindungi oleh undang-undang hak cipta, merek dagang, dan 
                                kekayaan intelektual lainnya. Anda tidak diperbolehkan untuk menyalin, memodifikasi, 
                                mendistribusikan, atau membuat karya turunan dari konten platform tanpa izin tertulis 
                                dari kami.
                            </p>
                        </section>

                        {/* Section 7: Tanggung Jawab */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Batasan Tanggung Jawab
                            </h2>
                            <p className="text-base leading-relaxed mb-3">
                                Platform disediakan "sebagaimana adanya" tanpa jaminan apa pun, baik tersurat maupun 
                                tersirat. Kami tidak menjamin bahwa:
                            </p>
                            <ul className="space-y-3 text-base leading-relaxed list-disc list-inside">
                                <li>Platform akan selalu tersedia, aman, atau bebas dari kesalahan</li>
                                <li>Hasil yang diperoleh dari penggunaan platform akan akurat atau dapat diandalkan</li>
                                <li>Kesalahan atau cacat dalam platform akan diperbaiki</li>
                            </ul>
                            <p className="text-base leading-relaxed mt-4">
                                Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau 
                                konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan platform.
                            </p>
                        </section>

                        {/* Section 8: Ganti Rugi */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Ganti Rugi
                            </h2>
                            <p className="text-base leading-relaxed">
                                Anda setuju untuk mengganti rugi, membela, dan membebaskan kami dari segala klaim, 
                                kerugian, kewajiban, kerusakan, biaya, dan pengeluaran (termasuk biaya pengacara) yang 
                                timbul dari atau terkait dengan penggunaan platform Anda, pelanggaran terhadap syarat 
                                dan ketentuan ini, atau pelanggaran terhadap hak pihak ketiga.
                            </p>
                        </section>

                        {/* Section 9: Hukum yang Berlaku */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Hukum yang Berlaku
                            </h2>
                            <p className="text-base leading-relaxed">
                                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
                                Setiap sengketa yang timbul dari atau terkait dengan syarat dan ketentuan ini akan 
                                diselesaikan melalui pengadilan yang berwenang di Indonesia.
                            </p>
                        </section>

                        {/* Section 10: Perubahan Syarat */}
                        <section className="space-y-4">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Perubahan Syarat dan Ketentuan
                            </h2>
                            <p className="text-base leading-relaxed">
                                Kami berhak untuk memodifikasi atau mengganti syarat dan ketentuan ini kapan saja. 
                                Perubahan akan berlaku efektif segera setelah dipublikasikan di platform. Adalah 
                                tanggung jawab Anda untuk meninjau syarat dan ketentuan ini secara berkala. Penggunaan 
                                berkelanjutan platform setelah perubahan berarti Anda menerima syarat dan ketentuan 
                                yang telah diperbarui.
                            </p>
                        </section>

                        {/* Section 11: Kontak */}
                        <section className="space-y-4 pt-4 border-t border-gray-200">
                            <h2 className="font-bold text-[#53589a] text-2xl mb-4">
                                Hubungi Kami
                            </h2>
                            <p className="text-base leading-relaxed">
                                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi tim 
                                support kami. Kami akan dengan senang hati membantu menjawab pertanyaan Anda.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}