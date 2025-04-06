import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useCartStore } from "../store/cart-store";
import { useProduct } from "../hooks/use-products";
import LoadingSpinner from "../components/ui/loading-spinner";
import { formatPrice } from "../lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  // Fetch product data
  const { data, isLoading, error } = useProduct(id || "");

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images?.[0]?.url || "/placeholder.svg?height=400&width=400",
      quantity: quantity,
    });

    toast.success(`${product.name} added to cart`);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    toast.success(`${product.name} added to wishlist`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !id) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  // Use mock data if API data is not available
  // const product = data?.product ||
  
  const product = {
    id: id,
    name: "iPhone 15 Pro",
    price: 999,
    images: [
      { url: "/placeholder.svg?height=600&width=600" },
      { url: "/placeholder.svg?height=600&width=600" },
      { url: "/placeholder.svg?height=600&width=600" },
      { url: "/placeholder.svg?height=600&width=600" },
    ],
    category: { name: "phones" },
    brand: "Apple",
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    colors: ["Space Black", "Silver", "Gold", "Blue"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description:
      "The iPhone 15 Pro is Apple's latest flagship smartphone, featuring a powerful A17 Pro chip, a stunning Super Retina XDR display, and a professional camera system. With its sleek design and advanced features, it's the perfect device for those who demand the best in mobile technology.",
    features: [
      "A17 Pro chip for lightning-fast performance",
      "Pro camera system with 48MP main camera",
      "Super Retina XDR display with ProMotion technology",
      "Ceramic Shield front cover for improved durability",
      "Face ID for secure authentication",
      "5G connectivity for ultra-fast downloads and streaming",
      "iOS 17 with new features and enhancements",
      "All-day battery life",
    ],
    specifications: {
      display: "6.1-inch Super Retina XDR display with ProMotion",
      processor: "A17 Pro chip with 6-core CPU and 5-core GPU",
      camera: "48MP main, 12MP ultra wide, 12MP telephoto",
      battery: "Up to 23 hours video playback",
      storage: "128GB, 256GB, 512GB, or 1TB",
      dimensions: "146.7 x 71.5 x 7.8 mm",
      weight: "187 grams",
      waterResistance: "IP68 (6 meters for up to 30 minutes)",
    },
  };

  // Set default selected options if not set yet
  if (product.colors && product.colors.length > 0 && !selectedColor) {
    setSelectedColor(product.colors[0]);
  }

  if (product.storage && product.storage.length > 0 && !selectedStorage) {
    setSelectedStorage(product.storage[0]);
  }

  return (
    <main className="container py-10">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={
                product.images?.[selectedImage]?.url ||
                "/placeholder.svg?height=600&width=600"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images?.map((image: any, index: number) => (
              <button
                key={index}
                className={`relative rounded-md overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-orange-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="w-20 h-20">
                  <img
                    src={image.url || "/placeholder.svg?height=600&width=600"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {product.category?.name || "Unknown"}
              </Badge>
              <Badge variant="outline">{product.brand || "Unknown"}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-orange-500 text-orange-500"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="text-3xl font-bold">{formatPrice(product.price)}</div>

          <div className="space-y-4">
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-2"
                >
                  {product.colors.map((color: any) => (
                    <div key={color} className="flex items-center">
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="rounded-md border px-3 py-2 cursor-pointer peer-data-[state=checked]:bg-orange-50 peer-data-[state=checked]:border-orange-500 dark:peer-data-[state=checked]:bg-orange-950 dark:peer-data-[state=checked]:border-orange-500"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {product.storage && product.storage.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Storage</h3>
                <RadioGroup
                  value={selectedStorage}
                  onValueChange={setSelectedStorage}
                  className="flex flex-wrap gap-2"
                >
                  {product.storage.map((storage: any) => (
                    <div key={storage} className="flex items-center">
                      <RadioGroupItem
                        value={storage}
                        id={`storage-${storage}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`storage-${storage}`}
                        className="rounded-md border px-3 py-2 cursor-pointer peer-data-[state=checked]:bg-orange-50 peer-data-[state=checked]:border-orange-500 dark:peer-data-[state=checked]:bg-orange-950 dark:peer-data-[state=checked]:border-orange-500"
                      >
                        {storage}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <Select
                value={quantity.toString()}
                onValueChange={(value) => setQuantity(Number.parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleAddToWishlist}
              >
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Product Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="py-4">
            <Card className="p-6">
              <p className="text-muted-foreground">{product.description}</p>
            </Card>
          </TabsContent>
          <TabsContent value="features" className="py-4">
            <Card className="p-6">
              <ul className="space-y-2">
                {product.features?.map((feature: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-orange-500">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-muted-foreground">{value as any}</p>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
