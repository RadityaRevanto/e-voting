import Navbar from "@/components/layouts/navbar";
import Hero from "@/components/sections/hero";

export default function Home() {
    return (
        <div className="w-full min-h-screen overflow-x-hidden relative">
            <Navbar />
            <Hero />
        </div>
    )
}