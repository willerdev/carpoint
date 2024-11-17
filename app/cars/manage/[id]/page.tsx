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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/cars/image-upload';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Must be a valid year'),
  price: z.string().min(1, 'Price is required'),
  mileage: z.string().min(1, 'Mileage is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  bodyType: z.string().min(1, 'Body type is required'),
  color: z.string().min(1, 'Color is required'),
  features: z.string().min(1, 'Features are required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

function decode(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

export default function ManageCarPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = params.id !== 'new';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      color: '',
      features: '',
      images: [],
    },
  });

  useEffect(() => {
    if (isEditing) {
      fetchCarData();
    }
  }, [isEditing]);

  async function fetchCarData() {
    try {
      const { data: car, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (car) {
        form.reset({
          make: car.make,
          model: car.model,
          year: car.year.toString(),
          price: car.price.toString(),
          mileage: car.mileage.toString(),
          fuelType: car.fuelType,
          transmission: car.transmission,
          bodyType: car.bodyType,
          color: car.color,
          features: car.features.join(', '),
          images: car.images || [],
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch car data',
        variant: 'destructive',
      });
      router.push('/profile');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Upload images first
      const imageUrls = await Promise.all(
        values.images.map(async (image) => {
          // Skip if already a URL
          if (image.startsWith('http')) {
            return image;
          }
          
          // Upload base64 image to Supabase storage
          const base64Data = image.split(',')[1];
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
          
          const { data, error } = await supabase.storage
            .from('carimages')
            .upload(`public/${fileName}.jpg`, decode(base64Data), {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (error) throw error;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('carimages')
            .getPublicUrl(`public/${fileName}.jpg`);

          return publicUrl;
        })
      );

      const carData = {
        make: values.make,
        model: values.model,
        year: parseInt(values.year),
        price: parseFloat(values.price),
        mileage: parseInt(values.mileage),
        fuel_type: values.fuelType,
        transmission: values.transmission,
        body_type: values.bodyType,
        color: values.color,
        features: values.features.split(',').map((f) => f.trim()),
        image_url: imageUrls[0],
        images: imageUrls,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', params.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          const { error: userCarError } = await supabase
            .from('user_cars')
            .insert([
              {
                user_id: (await supabase.auth.getUser()).data.user?.id,
                car_id: data.id,
                is_owner: true,
              },
            ]);

          if (userCarError) throw userCarError;
        }
      }

      toast({
        title: 'Success',
        description: `Car ${isEditing ? 'updated' : 'added'} successfully`,
      });

      router.push('/profile');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'add'} car`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Car' : 'Add New Car'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(newValues) => field.onChange(newValues)}
                        onRemove={(url) => {
                          field.onChange(field.value.filter((val) => val !== url));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input placeholder="25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input placeholder="5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Petrol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <FormControl>
                        <Input placeholder="Automatic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bodyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Sedan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (comma-separated)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Leather Seats, Navigation, Sunroof"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Saving...' : isEditing ? 'Update Car' : 'Add Car'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}