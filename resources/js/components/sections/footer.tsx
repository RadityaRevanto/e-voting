export default function Footer() {
    return (
        <section id="footer" className="overflow-hidden">
            <div
                className="relative mt-20 text-white py-12 md:py-16 lg:py-28"
                style={{
                    backgroundImage: "url('/assets/images/footer/bg-footer.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="mt-20">
                    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between md:py-14 lg:py-16">
                        <div className="space-y-3 md:max-w-md">
                            <h2 className="text-2xl font-semibold md:text-3xl">
                                Sistem E-Voting RW 05
                            </h2>
                            <p className="text-sm md:text-base text-gray-200">
                                Platform pemilihan ketua RW yang aman, transparan, dan mudah
                                diakses oleh seluruh warga.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-base font-semibold">Kontak</h3>
                                <ul className="space-y-1 text-gray-200">
                                    <li>RW 05, Kelurahan Contoh</li>
                                    <li>Email: rw05@example.com</li>
                                    <li>Telp: +62 812 3456 7890</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-2 text-base font-semibold">Informasi</h3>
                                <ul className="space-y-1 text-gray-200">
                                    <li>Tentang E-Voting</li>
                                    <li>Panduan Pemilih</li>
                                    <li>Kebijakan Privasi</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/20">
                        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-gray-200 md:flex-row">
                            <p>
                                &copy; {new Date().getFullYear()} E-Voting RW 05. Hak cipta dilindungi.
                            </p>
                            <p className="text-[11px] md:text-xs">
                                Dibangun dengan Laravel, React, dan Inertia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}