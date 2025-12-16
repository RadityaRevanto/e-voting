import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    const [activeMenu, setActiveMenu] = useState<'home' | 'about' | 'faqs' | 'contact'>('home');
    const [isOpen, setIsOpen] = useState(false); // state untuk sidebar mobile

    const scrollToSection = (sectionId: 'hero' | 'about' | 'faqs' | 'contact') => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleMenuClick = (menu: 'home' | 'about' | 'faqs' | 'contact') => {
        setActiveMenu(menu);

        // Mapping menu ke id section
        if (menu === 'home') {
            scrollToSection('hero');
        } else if (menu === 'about') {
            scrollToSection('about');
        } else if (menu === 'faqs') {
            scrollToSection('faqs');
        } else if (menu === 'contact') {
            scrollToSection('contact');
        }

        setIsOpen(false); // tutup sidebar setelah klik menu di mobile
    };

    return (
        <header className="relative text-white pb-10">
            {/* Wave di bawah navbar */}
            <img
                src="/assets/images/navbar/bg-navbar.png"
                alt="Navbar background"
                className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none hidden md:block md:top-0 md:h-35 xl:h-50 xl:-top-7"
            />

            <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
                {/* Logo di pojok kiri (hanya tampil di md ke atas) */}
                <div className="flex items-center gap-2">
                    <img
                        src="/assets/images/navbar/Icon-Landing.png"
                        alt="iVote Logo"
                        className="hidden md:block md:h-15 md:w-auto"
                    />
                </div>

                {/* Tombol hamburger (mobile) */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-black/60 px-3 py-2 text-sm font-semibold text-black md:hidden"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label="Toggle navigation"
                >
                    <span className="sr-only">Open main menu</span>
                    <div className="space-y-1.5">
                        <span
                            className={`block h-0.5 w-6 bg-black transition-transform ${
                                isOpen ? 'translate-y-1.5 rotate-45' : ''
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-6 bg-black transition-opacity ${
                                isOpen ? 'opacity-0' : 'opacity-100'
                            }`}
                        />
                        <span
                            className={`block h-0.5 w-6 bg-black transition-transform ${
                                isOpen ? '-translate-y-1.5 -rotate-45' : ''
                            }`}
                        />
                    </div>
                </button>

                {/* Menu (desktop) */}
                <ul className="hidden items-center gap-6 text-sm font-semibold md:flex md:gap-20 md:text-base xl:gap-28 xl:text-base">
                    <li
                        className="relative cursor-pointer"
                        onClick={() => handleMenuClick('home')}
                    >
                        <span>Home</span>
                        {activeMenu === 'home' && (
                            <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-white" />
                        )}
                    </li>
                    <li
                        className="relative cursor-pointer"
                        onClick={() => handleMenuClick('about')}
                    >
                        <span>About</span>
                        {activeMenu === 'about' && (
                            <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-white" />
                        )}
                    </li>
                    <li
                        className="relative cursor-pointer"
                        onClick={() => handleMenuClick('faqs')}
                    >
                        <span>FaQS</span>
                        {activeMenu === 'faqs' && (
                            <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-white" />
                        )}
                    </li>
                    <li
                        className="relative cursor-pointer"
                        onClick={() => handleMenuClick('contact')}
                    >
                        <span>Contact Us</span>
                        {activeMenu === 'contact' && (
                            <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-white" />
                        )}
                    </li>
                </ul>

                {/* Login button (desktop) */}
                <Link
                    href="/login"
                    className="hidden rounded-full border border-white px-6 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#3943B7] md:inline-block md:px-7 md:py-2.5 md:text-base xl:px-8 xl:py-2.5 xl:text-base"
                >
                    Log In
                </Link>
            </nav>

            {/* Overlay & Sidebar (mobile) */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-[#3943B7] px-6 py-6 text-white shadow-xl transition-transform duration-200 md:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header sidebar */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="/assets/images/navbar/Icon-Landing.png"
                            alt="iVote Logo"
                            className="h-10 w-auto"
                        />
                    </div>
                </div>

                {/* Menu links */}
                <ul className="space-y-4 text-base font-semibold">
                    <li
                        className={`cursor-pointer rounded-full px-3 py-2 ${
                            activeMenu === 'home' ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        onClick={() => handleMenuClick('home')}
                    >
                        Home
                    </li>
                    <li
                        className={`cursor-pointer rounded-full px-3 py-2 ${
                            activeMenu === 'about' ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        onClick={() => handleMenuClick('about')}
                    >
                        About
                    </li>
                    <li
                        className={`cursor-pointer rounded-full px-3 py-2 ${
                            activeMenu === 'faqs' ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        onClick={() => handleMenuClick('faqs')}
                    >
                        FaQS
                    </li>
                    <li
                        className={`cursor-pointer rounded-full px-3 py-2 ${
                            activeMenu === 'contact' ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        onClick={() => handleMenuClick('contact')}
                    >
                        Contact Us
                    </li>
                </ul>

                {/* Tombol login di bawah menu */}
                <Link
                    href="/login"
                    className="mt-8 block w-full rounded-full border border-white px-4 py-1 text-center text-base font-semibold transition hover:bg-white hover:text-[#3943B7]"
                    onClick={() => setIsOpen(false)}
                >
                    Log In
                </Link>
            </aside>
        </header>
    );
}