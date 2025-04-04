import { useState } from "react";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
        <Button variant="outline" size="sm" className="mb-4">
          Clear Filters
        </Button>
      </div>

      <Separator />

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="phones" />
                <Label htmlFor="phones">Phones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cases" />
                <Label htmlFor="cases">Cases</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="chargers" />
                <Label htmlFor="chargers">Chargers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="headphones" />
                <Label htmlFor="headphones">Headphones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="accessories" />
                <Label htmlFor="accessories">Other Accessories</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="apple" />
                <Label htmlFor="apple">Apple</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="samsung" />
                <Label htmlFor="samsung">Samsung</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="google" />
                <Label htmlFor="google">Google</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="xiaomi" />
                <Label htmlFor="xiaomi">Xiaomi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Ratings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4plus" id="4plus" />
                <Label htmlFor="4plus">4+ Stars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3plus" id="3plus" />
                <Label htmlFor="3plus">3+ Stars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2plus" id="2plus" />
                <Label htmlFor="2plus">2+ Stars</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <Label htmlFor="in-stock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="out-of-stock" />
                <Label htmlFor="out-of-stock">Out of Stock</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}
