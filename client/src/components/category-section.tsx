import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: "phones",
    name: "Smartphones",
    image: "/placeholder.svg?height=300&width=300",
    count: 24,
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    id: "cases",
    name: "Phone Cases",
    image: "/placeholder.svg?height=300&width=300",
    count: 36,
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    id: "chargers",
    name: "Chargers",
    image: "/placeholder.svg?height=300&width=300",
    count: 18,
    color: "from-green-500/20 to-green-600/20",
  },
  {
    id: "headphones",
    name: "Headphones",
    image: "/placeholder.svg?height=300&width=300",
    count: 12,
    color: "from-purple-500/20 to-purple-600/20",
  },
];

export default function CategorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll(".category-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom-=100",
          },
        }
      );
    }

    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {categories.map((category) => (
        <Link key={category.id} to={`/categories/${category.id}`}>
          <Card className="category-card overflow-hidden h-full transition-all hover:-translate-y-1 hover:shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gradient-to-br",
                  category.color
                )}
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.count} products
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
