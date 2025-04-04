import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";

import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { useCartStore } from "../store/cart-store";
import { useProducts } from "../hooks/use-products";
import LoadingSpinner from "./ui/loading-spinner";
import { formatPrice } from "../lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const { addItem } = useCartStore();
  const productsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useProducts({ limit: 4 });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images?.[0]?.url || "/placeholder.svg?height=400&width=400",
      quantity: 1,
    });

    toast.success(`${product.name} added to cart`);
  };

  useEffect(() => {
    if (productsRef.current && !isLoading && data?.products) {
      const cards = productsRef.current.querySelectorAll(".product-card");

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
            trigger: productsRef.current,
            start: "top bottom-=100",
          },
        }
      );
    }
  }, [isLoading, data]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load products</p>
      </div>
    );
  }

  // Use mock data if API data is not available
  const products = data?.products || [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 999,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "phones" },
      rating: 4.8,
      stock: 15,
      description:
        "The latest iPhone with advanced features and powerful performance.",
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      price: 899,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "phones" },
      rating: 4.7,
      stock: 20,
      description:
        "Experience the next generation of Galaxy with cutting-edge technology.",
    },
    {
      id: "3",
      name: "Wireless Earbuds Pro",
      price: 149,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "accessories" },
      rating: 4.5,
      stock: 30,
      description:
        "Premium wireless earbuds with noise cancellation and crystal clear sound.",
    },
    {
      id: "4",
      name: "Fast Charging Power Bank",
      price: 59,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "accessories" },
      rating: 4.6,
      stock: 25,
      description:
        "High-capacity power bank with fast charging capabilities for all your devices.",
    },
  ];

  return (
    <div
      ref={productsRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product: any) => (
        <Card key={product.id} className="product-card overflow-hidden">
          <Link
            to={`/products/${product.id}`}
            className="block overflow-hidden"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={
                  product.images?.[0]?.url ||
                  "/placeholder.svg?height=400&width=400"
                }
                alt={product.name}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
          </Link>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">
                {product.category?.name || "Unknown"}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-orange-500 text-orange-500 mr-1" />
                <span className="text-sm">{product.rating || "4.5"}</span>
              </div>
            </div>
            <Link to={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-2 hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
              {product.description}
            </p>
            <p className="font-bold text-lg">{formatPrice(product.price)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
