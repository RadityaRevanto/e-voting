import React from "react";
import { Link } from "@inertiajs/react";
import PaslonLayout from "../../_components/paslonlayout";

export default function AdminSettingsPage() {
    const accountOptions = [
        { id: 1, label: "EDIT PROFILE", href: "/admin/settings/edit-profil" },
        { id: 2, label: "CHANGE PASSWORD", href: "/admin/settings/change-password" },
        { id: 3, label: "LANGUAGE", href: "/admin/settings/language" },
    ];

    const linkOptions = [
        { id: 1, label: "ABOUT US", href: "/admin/settings/about-us" },
        { id: 2, label: "TERM OF SERVICE", href: "/admin/settings/term-of" },
        { id: 3, label: "PRIVACY POLICE", href: "/admin/settings/privacy-police" },
        { id: 4, label: "CONTACT US", href: "/admin/settings/contact-us" },
    ];

    return (
        <PaslonLayout>
            <div className="bg-white w-full min-h-screen">
                <div className="w-full">
                    <header className="flex flex-col gap-4">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            SETTINGS
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 justify-between items-start">
                        <section aria-labelledby="account-heading" className="space-y-6 w-full">
                            <h2
                                id="account-heading"
                                className="font-bold text-[#8e8fa0] text-xl tracking-tight"
                            >
                                ACCOUNT
                            </h2>
                            <nav aria-label="Account options">
                                <ul className="space-y-4">
                                    {accountOptions.map((option) => (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className="w-full flex items-center justify-center h-12 px-6 bg-white rounded-full border-2 border-[#8e90a1] shadow-sm hover:bg-gray-50 transition-colors font-semibold text-[#53599b]"
                                                aria-label={option.label}
                                            >
                                                {option.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </section>
                        <section aria-labelledby="link-heading" className="space-y-6 w-full">
                            <h2
                                id="link-heading"
                                className="font-bold text-[#8e8fa0] text-xl tracking-tight"
                            >
                                LINK
                            </h2>
                            <nav aria-label="Link options">
                                <ul className="space-y-4">
                                    {linkOptions.map((option) => (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className="w-full flex items-center justify-center h-12 px-6 bg-white rounded-full border-2 border-[#8e90a1] shadow-sm hover:bg-gray-50 transition-colors font-semibold text-[#53599b]"
                                                aria-label={option.label}
                                            >
                                                {option.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </section>
                    </div>
                </div>
            </div>
        </PaslonLayout>
    );
}