import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, MoreHorizontal, Plus, Search, Upload } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useProducts } from "../../hooks/use-products";
import { useDeleteProduct } from "../../hooks/use-products";
import { formatPrice } from "../../lib/utils";
import LoadingSpinner from "../../components/ui/loading-spinner";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get products with React Query
  const { data, isLoading, error } = useProducts({
    search: searchTerm,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    page: currentPage,
    limit: 10,
  });

  const deleteProduct = useDeleteProduct();

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct.mutate(id, {
        onSuccess: () => {
          toast.success(`${name} has been deleted`);
        },
      });
    }
  };

  // Mock products if API data is not available
  const products = data?.products || [
    {
      id: "PRD-001",
      name: "iPhone 15 Pro",
      category: { name: "Phones" },
      price: 999.0,
      stock: 15,
      status: "Active",
    },
    {
      id: "PRD-002",
      name: "Samsung Galaxy S24",
      category: { name: "Phones" },
      price: 899.0,
      stock: 20,
      status: "Active",
    },
    {
      id: "PRD-003",
      name: "Google Pixel 8",
      category: { name: "Phones" },
      price: 799.0,
      stock: 18,
      status: "Active",
    },
    {
      id: "PRD-004",
      name: "Wireless Earbuds Pro",
      category: { name: "Accessories" },
      price: 149.99,
      stock: 30,
      status: "Active",
    },
    {
      id: "PRD-005",
      name: "Fast Charging Power Bank",
      category: { name: "Accessories" },
      price: 59.99,
      stock: 25,
      status: "Active",
    },
    {
      id: "PRD-006",
      name: "Premium Phone Case",
      category: { name: "Accessories" },
      price: 29.99,
      stock: 50,
      status: "Active",
    },
    {
      id: "PRD-007",
      name: "Bluetooth Speaker",
      category: { name: "Accessories" },
      price: 79.99,
      stock: 12,
      status: "Active",
    },
    {
      id: "PRD-008",
      name: "Wireless Charging Pad",
      category: { name: "Accessories" },
      price: 39.99,
      stock: 22,
      status: "Active",
    },
    {
      id: "PRD-009",
      name: "Screen Protector",
      category: { name: "Accessories" },
      price: 14.99,
      stock: 100,
      status: "Active",
    },
    {
      id: "PRD-010",
      name: "USB-C Cable Pack",
      category: { name: "Accessories" },
      price: 19.99,
      stock: 75,
      status: "Active",
    },
  ];

  const pagination = data?.pagination || {
    total: 10,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="grid gap-2 flex-1">
          <label htmlFor="search" className="text-sm font-medium">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2 w-full md:w-[200px]">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="phones">Phones</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 w-full md:w-[200px]">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="sold out">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.category?.name || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.stock < 10 ? (
                        <Badge variant="destructive">{product.stock}</Badge>
                      ) : (
                        product.stock
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : product.status === "Inactive"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/${product.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteProduct(product.id, product.name)
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
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
          )}
        </div>
      )}
    </div>
  );
}
