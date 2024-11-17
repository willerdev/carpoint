'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tradeInFormSchema } from '@/lib/schemas/trade-in';
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
import { ImageUpload } from '@/components/cars/image-upload';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as z from 'zod';

export default function TradeInPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof tradeInFormSchema>>({
    resolver: zodResolver(tradeInFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: 'Good',
      estimatedValue: '',
      location: '',
      registeredOwner: '',
      contactNumber: '',
      preferredVisitTime: '',
      description: '',
      images: [],
    },
  });

  async function onSubmit(values: z.infer<typeof tradeInFormSchema>) {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload images first
      const imageUrls = await Promise.all(
        values.images.map(async (image) => {
          if (image.startsWith('http')) return image;
          
          const base64Data = image.split(',')[1];
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
          
          const { data, error } = await supabase.storage
            .from('tradeins')
            .upload(`public/${fileName}.jpg`, decode(base64Data), {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('tradeins')
            .getPublicUrl(`public/${fileName}.jpg`);

          return publicUrl;
        })
      );

      const { error } = await supabase.from('trade_ins').insert([
        {
          car_id: params.id,
          user_id: user.id,
          make: values.make,
          model: values.model,
          year: parseInt(values.year),
          mileage: parseInt(values.mileage),
          condition: values.condition,
          estimated_value: parseFloat(values.estimatedValue),
          location: values.location,
          registered_owner: values.registeredOwner,
          contact_number: values.contactNumber,
          preferred_visit_time: values.preferredVisitTime,
          description: values.description,
          images: imageUrls,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Trade-in request submitted successfully',
      });

      router.push(`/cars/${params.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit trade-in request',
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
          <CardTitle>Trade-In Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={(url) => {
                          field.onChange(field.value.filter((val: string) => val !== url));
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
                        <Input placeholder="2020" {...field} />
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
                        <Input placeholder="50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registeredOwner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
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
                name="preferredVisitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Visit Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Weekdays after 5 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about your car..."
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
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Trade-In Request'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function decode(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}