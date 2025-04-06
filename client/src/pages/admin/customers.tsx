import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, MoreHorizontal, Search, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

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
import LoadingSpinner from "../../components/ui/loading-spinner";

// Mock data
const customers = [
  {
    id: "USR-001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "USER",
    status: "Active",
    orders: 5,
    totalSpent: 2499.95,
    createdAt: "2024-01-15",
  },
  {
    id: "USR-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "USER",
    status: "Active",
    orders: 3,
    totalSpent: 749.97,
    createdAt: "2024-02-03",
  },
  {
    id: "USR-003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "USER",
    status: "Active",
    orders: 2,
    totalSpent: 549.95,
    createdAt: "2024-02-10",
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "USER",
    status: "Inactive",
    orders: 1,
    totalSpent: 89.99,
    createdAt: "2024-02-15",
  },
  {
    id: "USR-005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    role: "USER",
    status: "Active",
    orders: 7,
    totalSpent: 3249.93,
    createdAt: "2024-01-05",
  },
  {
    id: "USR-006",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    role: "USER",
    status: "Active",
    orders: 2,
    totalSpent: 259.98,
    createdAt: "2024-03-01",
  },
  {
    id: "USR-007",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    role: "ADMIN",
    status: "Active",
    orders: 0,
    totalSpent: 0,
    createdAt: "2023-12-10",
  },
  {
    id: "USR-008",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "USER",
    status: "Blocked",
    orders: 1,
    totalSpent: 79.99,
    createdAt: "2024-01-20",
  },
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  setIsLoading(false);

  // Filter customers based on search term and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      customer.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (customerId: string, status: string) => {
    // In a real app, this would call an API to update the customer status
    toast.success(`Customer ${customerId} status updated to ${status}`);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="grid gap-2 flex-1">
          <label htmlFor="search" className="text-sm font-medium">
            Search Customers
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name, email or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.role === "ADMIN" ? "secondary" : "outline"
                        }
                      >
                        {customer.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === "Active"
                            ? "default"
                            : customer.status === "Inactive"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.orders}
                    </TableCell>
                    <TableCell className="text-right">
                      ${customer.totalSpent.toFixed(2)}
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
                            <Link to={`/admin/customers/${customer.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(customer.id, "Active")
                            }
                          >
                            Mark as Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(customer.id, "Inactive")
                            }
                          >
                            Mark as Inactive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(customer.id, "Blocked")
                            }
                          >
                            Block Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
