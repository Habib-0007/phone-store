import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import FeaturedProducts from "../components/featured-products";
import HeroSection from "../components/hero-section";
import CategorySection from "../components/category-section";
import NewsletterSection from "../components/newsletter-section";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container py-14">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Badge className="mb-4">Categories</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Shop by Category
          </h2>
          <p className="max-w-[700px] text-muted-foreground">
            Browse our curated collection of phones and accessories to find
            exactly what you need.
          </p>
        </div>

        <CategorySection />
      </section>

      <section className="container py-14 bg-muted/30">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Badge className="mb-4">Featured</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Featured Products
          </h2>
          <p className="max-w-[700px] text-muted-foreground">
            Discover our most popular phones and accessories, handpicked for
            quality and value.
          </p>
        </div>

        <FeaturedProducts />

        <div className="flex justify-center mt-10">
          <Button asChild>
            <Link to="/products">
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
