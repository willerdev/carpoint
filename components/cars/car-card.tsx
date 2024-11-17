"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={car.imageUrl}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-2xl font-bold text-primary mt-2">
          {formatter.format(car.price)}
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            <span className="text-sm">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="text-sm">{car.mileage}km</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/cars/${car.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}