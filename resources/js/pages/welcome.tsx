import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Hero from "@/components/sections/hero";
import Identity from "@/components/sections/identy";
import About from "@/components/sections/about";
import FAQs from "@/components/sections/faqs";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

function AnimatedSection({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out will-change-transform will-change-opacity ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
        >
            {children}
        </div>
    );
}

export default function Home() {
    return (
        <div className="w-full min-h-screen overflow-hidden relative bg-white">
            <Navbar />
            <AnimatedSection>
                <Hero />
            </AnimatedSection>
            <AnimatedSection>
                <Identity />
            </AnimatedSection>
            <AnimatedSection>
                <About />
            </AnimatedSection>
            <AnimatedSection>
                <FAQs />
            </AnimatedSection>
            <AnimatedSection>
                <Contact />
            </AnimatedSection>
            <AnimatedSection>
                <Footer />
            </AnimatedSection>
        </div>
    );
}