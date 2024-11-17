'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const orderFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  deliveryPreference: z.string().min(1, 'Delivery preference is required'),
});

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [car, setCar] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      deliveryPreference: 'pickup',
    },
  });

  useEffect(() => {
    fetchCarDetails();
    checkSession();
  }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in or create an account to place an order.',
      });
      router.push(`/auth/sign-in?redirect=/cars/${params.id}/order`);
    }
  }

  async function fetchCarDetails() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch car details',
        variant: 'destructive',
      });
      router.push('/cars');
    }
  }

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    try {
      setIsLoading(true);

      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('orders').insert([
        {
          car_id: params.id,
          user_id: session.user.id,
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          delivery_preference: values.deliveryPreference,
          status: 'pending',
          total_amount: car.price,
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your order has been placed successfully',
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!car) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Order</CardTitle>
          <CardDescription>
            Please provide your delivery information to complete the order for:
            {car.year} {car.make} {car.model}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="text-sm text-muted-foreground">
              Vehicle: {car.year} {car.make} {car.model}
            </p>
            <p className="text-sm text-muted-foreground">
              Price: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(car.price)}
            </p>
          </div>

          <Separator className="my-6" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}