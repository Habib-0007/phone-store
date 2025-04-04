import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

import { Button } from "./ui/button";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-background py-20 md:py-24"
    >
      <div className="container flex flex-col md:flex-row items-center">
        <div ref={textRef} className="flex-1 space-y-6 pb-10 md:pb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover the Latest{" "}
            <span className="text-orange-600 dark:text-orange-500">Tech</span>{" "}
            for Your Lifestyle
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Premium phones and accessories for the modern tech enthusiast.
            Quality products at competitive prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg">
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
        <div ref={imageRef} className="flex-1 flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-full opacity-20 blur-3xl -z-10"></div>
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="Latest smartphone"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
