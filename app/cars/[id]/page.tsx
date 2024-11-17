'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Car } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Fuel, Gauge, Calendar, Settings, PaintBucket, Car as CarIcon } from 'lucide-react';
import Link from 'next/link';

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        const carData = {
          ...data,
          fuelType: data.fuel_type,
          bodyType: data.body_type,
          imageUrl: data.image_url,
          images: data.images || [data.image_url],
          condition: data.condition,
        };
        setCar(carData);

        // Fetch similar cars (same make or body type)
        const { data: similarData } = await supabase
          .from('cars')
          .select('*')
          .neq('id', params.id)
          .or(`make.eq.${data.make},body_type.eq.${data.body_type}`)
          .limit(3);

        if (similarData) {
          setSimilarCars(
            similarData.map(car => ({
              ...car,
              fuelType: car.fuel_type,
              bodyType: car.body_type,
              imageUrl: car.image_url,
              images: car.images || [car.image_url],
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load car details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCarDetails();
  }, [fetchCarDetails]);

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!car) {
    return <div className="container py-8">Car not found</div>;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {car?.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${car.make} ${car.model} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">
              {car?.year} {car?.make} {car?.model}
            </h1>
            <p className="text-3xl font-bold text-primary">
              {formatter.format(car?.price || 0)}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full" asChild>
              <Link href={`/cars/${params.id}/order`}>
                Order Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/cars/${params.id}/trade-in`}>
                Suggest Trade-in
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Year</p>
                  <p className="text-lg font-bold">{car?.year}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Fuel className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fuel Type</p>
                  <p className="text-lg font-bold">{car?.fuelType}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Mileage</p>
                  <p className="text-lg font-bold">{car?.mileage} miles</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Body Type</p>
                  <p className="text-lg font-bold">{car?.bodyType}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <PaintBucket className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-lg font-bold">{car?.condition}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Similar Cars</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {similarCars.map((similarCar) => (
            <Card key={similarCar.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={similarCar.imageUrl}
                  alt={`${similarCar.make} ${similarCar.model}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold">
                  {similarCar.year} {similarCar.make} {similarCar.model}
                </h3>
                <p className="text-2xl font-bold text-primary mt-2">
                  {formatter.format(similarCar.price)}
                </p>
                <Button asChild className="w-full mt-4">
                  <Link href={`/cars/${similarCar.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}