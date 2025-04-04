import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <main className="container py-10 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            Order Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Order #12345</p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address. You can
            track your order status in your account.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to="/account/orders">Track Your Order</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
