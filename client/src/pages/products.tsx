import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, ShoppingCart, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
import { useCartStore } from "../store/cart-store";
import { useProducts } from "../hooks/use-products";
import LoadingSpinner from "../components/ui/loading-spinner";
import { formatPrice } from "../lib/utils";
import toast from "react-hot-toast";

// Import ProductFilters component
import ProductFilters from "../components/product-filters";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  // Get products with React Query
  const { data, isLoading, error } = useProducts({
    search: searchTerm,
    // sort: sortBy,
    page: currentPage,
    limit: 9,
  });

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

  // Mock products if API data is not available
  // const products = data?.products ||
  const products = [
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
    {
      id: "5",
      name: "Google Pixel 8",
      price: 799,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "phones" },
      rating: 4.6,
      stock: 18,
      description:
        "Google's flagship phone with an amazing camera and pure Android experience.",
    },
    {
      id: "6",
      name: "Premium Phone Case",
      price: 29,
      images: [{ url: "/placeholder.svg?height=400&width=400" }],
      category: { name: "accessories" },
      rating: 4.3,
      stock: 50,
      description:
        "Durable and stylish case to protect your phone from drops and scratches.",
    },
  ];

  const pagination = data?.pagination || {
    total: 6,
    page: 1,
    limit: 9,
    totalPages: 1,
  };

  return (
    <main className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of phones and accessories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-[200px]">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className={`${showFilters ? "block" : "hidden"} md:block`}>
          <ProductFilters />
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {products.length} products
            </p>
            {/* <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select> */}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load products</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden">
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
                          <span className="text-sm">
                            {product.rating || "4.5"}
                          </span>
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
                      <p className="font-bold text-lg">
                        {formatPrice(product.price)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, pagination.totalPages)
                        )
                      }
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
