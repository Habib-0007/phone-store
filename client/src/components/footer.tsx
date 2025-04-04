import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">PhoneHub</h3>
            <p className="text-muted-foreground text-sm">
              Premium phones and accessories for the modern tech enthusiast.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/phones"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Phones
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/accessories"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/sale"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PhoneHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Visa"
              className="h-6"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="PayPal"
              className="h-6"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Paystack"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
