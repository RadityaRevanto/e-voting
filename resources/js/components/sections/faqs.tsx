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
            <div className="relative min-h-screen w-full bg-[#F7F7FC] px-6 py-20 md:px-10 lg:px-16">
                <div className="relative mx-auto max-w-4xl lg:max-w-5xl">
                    {/* Title & subtitle */}
                    <div className="mb-10 md:mb-20 text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1a237e] mb-4">
                            FAQs
                        </h2>
                        <p className="mx-auto max-w-2xl text-sm md:text-base md:mt-10 text-gray-600">
                            Kumpulan pertanyaan yang sering diajukan seputar penggunaan sistem e-voting.
                            Jika masih ada hal yang ingin ditanyakan, silakan hubungi panitia atau admin
                            yang bertugas.
                        </p>
                    </div>

                    {/* FAQ list / accordion */}
                    <div className="space-y-4">
                        {FAQS.map((item, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={item.question}
                                    className="group rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-[#e0e3ff] transition hover:shadow-md hover:ring-[#c5cbff] md:p-5"
                                >
                                    <button
                                        type="button"
                                        className="flex w-full items-center justify-between gap-4 text-left"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <span className="text-base font-semibold text-[#1a237e] md:text-lg">
                                            {item.question}
                                        </span>
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#3943B7] text-white transition-transform duration-200 ${
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
                                        className={`grid transition-all duration-300 ease-out ${
                                            isActive
                                                ? 'mt-3 grid-rows-[1fr] opacity-100'
                                                : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="pb-1 text-sm leading-relaxed text-gray-600 md:text-base">
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
        </section>
    );
}