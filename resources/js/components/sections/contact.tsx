export default function Contact() {
    return (
        <section id="contact" className="bg-white">
            <div className="mx-auto flex max-w-6xl flex-col justify-center gap-16 px-6 py-16 md:flex-row md:items-center lg:gap-24">
                {/* Left: Title & Newsletter */}
                <div className="max-w-xl space-y-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                        How We Can Help You
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-500 md:text-base">
                        Follow our newsletter. We will regularly update our latest project and availability.
                    </p>

                    <form
                        className="mt-6 flex w-full flex-col gap-3 rounded-full bg-slate-50 p-1.5 shadow-[0_18px_45px_rgba(93,118,255,0.18)] ring-1 ring-slate-100/80 md:flex-row md:items-center"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 focus-within:ring-2 focus-within:ring-indigo-400">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                                ✉️
                            </span>
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                className="w-full border-none bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none md:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-2 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(79,70,229,0.45)] transition hover:translate-y-0.5 hover:shadow-[0_14px_35px_rgba(79,70,229,0.55)] md:text-sm"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}