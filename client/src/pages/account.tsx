import type React from "react";

import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { CreditCard, Package, Settings, User } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useAuthStore } from "../store/auth-store";
import { useCurrentUser } from "../hooks/use-auth";
import LoadingSpinner from "../components/ui/loading-spinner";
import { formatDate, formatPrice } from "../lib/utils";

// Mock data
const orders = [
  {
    id: "ORD-12345",
    date: "2025-04-03",
    status: "Delivered",
    items: 2,
    total: 1299.0,
  },
  {
    id: "ORD-12344",
    date: "2025-03-15",
    status: "Delivered",
    items: 1,
    total: 149.99,
  },
];

const addresses = [
  {
    id: "addr-1",
    type: "Home",
    isDefault: true,
    firstName: "John",
    lastName: "Doe",
    address: "1234 Main St.",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "United States",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "addr-2",
    type: "Work",
    isDefault: false,
    firstName: "John",
    lastName: "Doe",
    address: "5678 Business Ave.",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "United States",
    phone: "+1 (555) 987-6543",
  },
];

export default function AccountPage() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading }: { data: any; isLoading: boolean } =
    useCurrentUser();

  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Set form data when user data is loaded
  if (data?.user && formData.name === "") {
    setFormData({
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone || "",
    });
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Separator />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <Tabs
              defaultValue="profile"
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col items-start justify-start h-full space-y-1">
                <TabsTrigger value="profile" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="addresses" className="w-full justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="settings" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </aside>

          <div className="flex-1 lg:max-w-3xl">
            <Tabs defaultValue="profile">
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Manage your personal information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input id="current-password" type="password" />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm Password
                          </Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>

                      <Button type="submit">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      View and track your orders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-4">
                            You haven't placed any orders yet.
                          </p>
                          <Button asChild>
                            <Link to="/products">Start Shopping</Link>
                          </Button>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="rounded-lg border p-4">
                            <div className="flex flex-col sm:flex-row justify-between mb-4">
                              <div>
                                <h3 className="font-medium">{order.id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <Badge>{order.status}</Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{order.items} items</span>
                                <span className="font-medium">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/account/orders/${order.id}`}>
                                  View Order
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  {orders.length > 0 && (
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <Link to="/account/orders">View All Orders</Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Addresses</CardTitle>
                    <CardDescription>
                      Manage your shipping and billing addresses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-4">
                            You haven't added any addresses yet.
                          </p>
                          <Button>Add New Address</Button>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            className="rounded-lg border p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{address.type}</h3>
                                {address.isDefault && (
                                  <Badge variant="outline" className="mt-1">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>
                                {address.firstName} {address.lastName}
                              </p>
                              <p>{address.address}</p>
                              <p>
                                {address.city}, {address.state}{" "}
                                {address.zipCode}
                              </p>
                              <p>{address.country}</p>
                              <p>{address.phone}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Add New Address</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your account activity.
                        </p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data.
                        </p>
                      </div>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
