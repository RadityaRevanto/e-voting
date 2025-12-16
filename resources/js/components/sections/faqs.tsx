import { useState } from 'react';

type FaqItem = {
    question: string;
    answer: string;
};

const FAQS: FaqItem[] = [
    {
        question: 'Apa itu sistem e-voting ini?',
        answer: 'Sistem e-voting ini adalah platform pemungutan suara digital yang dirancang untuk mempermudah proses pemilihan secara online dengan tetap mengutamakan keamanan, transparansi, dan akurasi hasil.',
    },
    {
        question: 'Seberapa aman data dan suara saya?',
        answer: 'Setiap suara yang masuk akan dienkripsi dan disimpan dengan mekanisme keamanan berlapis. Selain itu, hanya panitia yang berwenang yang dapat mengakses rekapitulasi hasil tanpa bisa mengubah suara yang sudah masuk.',
    },
    {
        question: 'Bagaimana cara melakukan voting?',
        answer: 'Anda akan menerima token atau kredensial khusus dari panitia. Setelah login ke sistem, ikuti langkah pada tampilan pemilihan, pilih kandidat yang diinginkan, lalu konfirmasi suara Anda sampai muncul notifikasi bahwa voting berhasil.',
    },
    {
        question: 'Apakah saya bisa voting lebih dari satu kali?',
        answer: 'Tidak. Sistem hanya mengizinkan satu suara sah untuk setiap akun atau identitas pemilih. Jika Anda sudah melakukan voting, Anda tidak dapat mengirimkan suara kedua kalinya.',
    },
    {
        question: 'Apa yang harus saya lakukan jika mengalami kendala saat voting?',
        answer: 'Jika terjadi masalah teknis, seperti tidak bisa login atau tampilan tidak muncul dengan benar, segera hubungi panitia atau admin yang bertanggung jawab agar dapat dibantu secara langsung.',
    },
];

export default function FAQs() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section id="faqs">
            <div className="relative min-h-screen w-full bg-gradient-to-b from-[#EFF2FF] via-[#F7F7FC] to-white px-6 py-20 md:px-10 lg:px-16">
                {/* Decorative background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-[#dfe3ff] opacity-40 blur-3xl" />
                    <div className="absolute bottom-[-4rem] left-[-4rem] h-56 w-56 rounded-full bg-[#c5cbff] opacity-30 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start">
                        {/* Title & subtitle */}
                        <div className="space-y-6 lg:sticky lg:top-28">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#111827]">
                                    Pertanyaan umum seputar
                                    <span className="mt-1 block text-[#3943b8]">
                                        sistem e-voting Anda
                                    </span>
                                </h2>
                                <p className="mt-4 max-w-xl text-sm md:text-base text-gray-600">
                                    Pelajari bagaimana sistem ini menjaga keamanan suara, alur voting,
                                    hingga hal teknis lainnya. Semua dirangkum singkat, jelas, dan mudah
                                    dipahami.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                                <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm ring-1 ring-[#e0e3ff]">
                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#3943B7]">
                                        5
                                    </span>
                                    <span className="font-medium text-gray-800">Pertanyaan terpopuler</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-[#111827] text-white/90 px-3 py-1.5 text-xs shadow-md">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-3.5 w-3.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Jawaban singkat & langsung ke inti</span>
                                </div>
                            </div>

                        </div>

                        {/* FAQ list / accordion */}
                        <div className="space-y-4">
                            {FAQS.map((item, index) => {
                                const isActive = activeIndex === index;

                                return (
                                    <div
                                        key={item.question}
                                        className={`group overflow-hidden rounded-2xl bg-white/80 p-4 shadow-sm ring-1 transition-all duration-300 md:p-5 ${
                                            isActive
                                                ? 'ring-[#3943B7]/70 shadow-[0_18px_40px_rgba(57,67,183,0.12)] translate-y-[-1px]'
                                                : 'ring-[#e0e3ff] hover:shadow-md hover:ring-[#c5cbff]'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="flex w-full items-start justify-between gap-4 text-left"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <div className="flex gap-3">
                                                <span
                                                    className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                                        isActive
                                                            ? 'bg-[#3943B7] text-white'
                                                            : 'bg-[#EEF0FF] text-[#3943B7]'
                                                    }`}
                                                >
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm font-semibold text-[#111827] md:text-base">
                                                    {item.question}
                                                </span>
                                            </div>

                                            <span
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm transition-all duration-200 ${
                                                    isActive ? 'rotate-180' : ''
                                                }`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        </button>

                                        <div
                                            className={`grid transition-all duration-250 ease-out ${
                                                isActive
                                                    ? 'mt-3 grid-rows-[1fr] opacity-100'
                                                    : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="pb-2 text-sm leading-relaxed text-gray-600 md:text-base">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}