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
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col gap-10 pb-10 pt-16 md:flex-row md:items-start md:justify-between md:gap-12 md:pb-14 md:pt-20 lg:gap-16 lg:pb-0 lg:pt-42">
                        {/* Brand Section */}
                        <div className="w-full space-y-4 md:w-auto md:max-w-xs lg:max-w-sm">
                            <h2 className="text-2xl font-bold text-white md:text-3xl">
                                Sistem E-Voting RW 05
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-200 md:text-base">
                                Platform pemilihan ketua RW yang aman, transparan, dan mudah
                                diakses oleh seluruh warga. Memastikan proses demokrasi berjalan
                                dengan baik di tingkat lingkungan.
                            </p>
                            {/* Social Media */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <svg
                                        className="h-5 w-5 text-[#3943B7]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <svg
                                        className="h-5 w-5 text-[#3943B7]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:scale-110"
                                    aria-label="Twitter"
                                >
                                    <svg
                                        className="h-5 w-5 text-[#3943B7]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="grid w-full grid-cols-2 gap-8 text-sm md:w-auto md:grid-cols-3 md:gap-10 lg:gap-12">
                            {/* Kontak */}
                            <div className="min-w-0">
                                <h3 className="mb-4 text-base font-semibold text-white">
                                    Kontak
                                </h3>
                                <ul className="space-y-2.5 text-gray-200">
                                    <li className="flex items-start gap-2">
                                        <svg
                                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <span className="break-words leading-relaxed">
                                            RW 05, Kelurahan Contoh
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 flex-shrink-0 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <a
                                            href="mailto:rw05@example.com"
                                            className="break-all leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            rw05@example.com
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 flex-shrink-0 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <a
                                            href="tel:+6281234567890"
                                            className="break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            +62 812 3456 7890
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Informasi */}
                            <div className="min-w-0">
                                <h3 className="mb-4 text-base font-semibold text-white">
                                    Informasi
                                </h3>
                                <ul className="space-y-2.5 text-gray-200">
                                    <li>
                                        <a
                                            href="#about"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Tentang E-Voting
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#guide"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Panduan Pemilih
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#privacy"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#terms"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Syarat & Ketentuan
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Bantuan */}
                            <div className="min-w-0">
                                <h3 className="mb-4 text-base font-semibold text-white">
                                    Bantuan
                                </h3>
                                <ul className="space-y-2.5 text-gray-200">
                                    <li>
                                        <a
                                            href="#faq"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Hubungi Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#support"
                                            className="block break-words leading-relaxed transition hover:text-white hover:underline"
                                        >
                                            Dukungan Teknis
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-white/20 pt-6 mt-8">
                        <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-300 md:flex-row">
                            <p className="text-center break-words md:text-left">
                                &copy; {new Date().getFullYear()} Sistem E-Voting RW 05. Hak cipta dilindungi.
                            </p>
                            <p className="text-center break-words text-[11px] md:text-xs">
                                Dibangun dengan{' '}
                                <span className="font-semibold text-white">Laravel</span>,{' '}
                                <span className="font-semibold text-white">React</span>, dan{' '}
                                <span className="font-semibold text-white">Inertia.js</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}