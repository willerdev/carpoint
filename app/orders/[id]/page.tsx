'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type OrderDetails = {
  id: string;
  car_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  delivery_preference: string;
  status: string;
  total_amount: number;
  created_at: string;
  cars: {
    make: string;
    model: string;
    year: number;
    image_url: string;
    images: string[];
  };
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  async function fetchOrderDetails() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          cars:car_id (
            make,
            model,
            year,
            image_url,
            images
          )
        `)
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      console.log('Order data:', data);
      setOrder(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch order details',
        variant: 'destructive',
      });
      router.push('/profile');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container py-8">Order not found</div>;
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {order.cars.images && order.cars.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {order.cars.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${order.cars.make} ${order.cars.model} - Image ${index + 1}`}
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
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={order.cars.image_url}
                alt={`${order.cars.make} ${order.cars.model}`}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <p className="text-muted-foreground">
              {order.cars.year} {order.cars.make} {order.cars.model}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Order Status</h3>
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Order Total</h3>
            <p className="text-xl font-bold text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(order.total_amount)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-lg font-semibold">Delivery Information</h3>
            <div className="space-y-1 text-muted-foreground">
              <p>{order.full_name}</p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.zip_code}</p>
              <p>Delivery Preference: {order.delivery_preference}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-lg font-semibold">Order Date</h3>
            <p className="text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}