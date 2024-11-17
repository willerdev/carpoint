"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarFilterParams } from "@/lib/types";

const bodyTypes = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Wagon",
  "Van",
  "Truck",
];

const makes = [
  "Toyota",
  "Honda",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Ford",
  "Hyundai",
];

const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
const transmissions = ["Automatic", "Manual"];

export function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<CarFilterParams>({
    make: searchParams.get("make") || undefined,
    bodyType: searchParams.get("bodyType") || undefined,
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    fuelType: searchParams.get("fuelType") || undefined,
    transmission: searchParams.get("transmission") || undefined,
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      }
    });
    router.push(`/cars?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({});
    router.push("/cars");
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label>Make</Label>
        <Select
          value={filters.make}
          onValueChange={(value) => setFilters({ ...filters, make: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make} value={make}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Body Type</Label>
        <Select
          value={filters.bodyType}
          onValueChange={(value) => setFilters({ ...filters, bodyType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            {bodyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fuel Type</Label>
        <Select
          value={filters.fuelType}
          onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select fuel type" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select
          value={filters.transmission}
          onValueChange={(value) =>
            setFilters({ ...filters, transmission: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transmission" />
          </SelectTrigger>
          <SelectContent>
            {transmissions.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}