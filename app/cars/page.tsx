'use client';

import { CarCard } from "@/components/cars/car-card";
import { CarFilters } from "@/components/cars/car-filters";
import { Car } from "@/lib/types";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CarSkeleton } from "@/components/cars/car-skeleton";
export default function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  async function fetchCars() {
    try {
      setIsLoading(true);
      let query = supabase.from('cars').select('*');

      // Apply filters based on search params
      if (searchParams.make) {
        query = query.eq('make', searchParams.make);
      }
      if (searchParams.bodyType) {
        query = query.eq('body_type', searchParams.bodyType);
      }
      if (searchParams.minPrice) {
        query = query.gte('price', parseFloat(searchParams.minPrice));
      }
      if (searchParams.maxPrice) {
        query = query.lte('price', parseFloat(searchParams.maxPrice));
      }
      if (searchParams.fuelType) {
        query = query.eq('fuel_type', searchParams.fuelType);
      }
      if (searchParams.transmission) {
        query = query.eq('transmission', searchParams.transmission);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Available Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CarFilters />
        </div>
        <div className="md:col-span-3">
        {isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <CarSkeleton />
    <CarSkeleton />
    <CarSkeleton />
    <CarSkeleton />
    <CarSkeleton />
    <CarSkeleton />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {cars.map((car) => (
      <CarCard key={car.id} car={car} />
    ))}
  </div>
)}
        </div>
      </div>
    </div>
  );
}