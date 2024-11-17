'use client';

import { Button } from "@/components/ui/button";
import { Car as CarIcon, Shield, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CarCard } from "@/components/cars/car-card";
import { Car } from "@/lib/types";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CarSkeleton } from "@/components/cars/car-skeleton";

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  async function fetchFeaturedCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .limit(30)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedCars = data?.map(car => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuel_type,
        transmission: car.transmission,
        bodyType: car.body_type,
        color: car.color,
        imageUrl: car.image_url,
        images: [car.image_url],
        features: car.features,
        condition: car.condition || 'Used'
      })) || [];

      setFeaturedCars(transformedCars);
    } catch (error) {
      console.error('Error fetching featured cars:', error);
    }
  }

  return (
    <>
      <section className="relative h-[300px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2066&auto=format&fit=crop"
          alt="Luxury car"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
            Find Your Dream Car
          </h1>
          <p className="mb-8 max-w-[600px] text-lg text-gray-200 sm:text-xl">
            Discover a wide selection of premium vehicles. From local to imported,
            we have the perfect car waiting for you to drive.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/cars">Browse Cars</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/imports">Import Services</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-muted py-16">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Cars</h2>
            <Button variant="outline" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {featuredCars.length === 0 ? (
    <>
      <CarSkeleton />
      <CarSkeleton />
      <CarSkeleton />
    </>
  ) : (
    featuredCars.map((car) => (
      <CarCard key={car.id} car={car} />
    ))
  )}
</div>
        </div>
      </section>
      <section className="hidden md:block py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CarIcon,
                title: "Premium Selection",
                description:
                  "Carefully curated collection of high-quality vehicles",
              },
              {
                icon: Shield,
                title: "Trusted Dealer",
                description:
                  "Over 10 years of experience in the automotive industry",
              },
              {
                icon: Truck,
                title: "Import Services",
                description:
                  "Direct imports from Japan, Korea, and China with full support",
              },
              {
                icon: Star,
                title: "Customer First",
                description:
                  "Dedicated support team to help you find your perfect car",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
    </>
  );
}