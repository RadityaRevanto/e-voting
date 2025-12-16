import Navbar from "@/components/layouts/navbar";
import Hero from "@/components/sections/hero";
import Identity from "@/components/sections/identy";
import About from "@/components/sections/about";
import FAQs from "@/components/sections/faqs";

export default function Home() {
    return (
        <div className="w-full min-h-screen overflow-hidden relative">
            <Navbar />
            <Hero />
            <Identity />
            <About />
            <FAQs />
        </div>
    )
}