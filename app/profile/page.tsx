'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

type Order = {
  id: string;
  car_id: string;
  full_name: string;
  email: string;
  status: string;
  total_amount: number;
  created_at: string;
  cars: {
    make: string;
    model: string;
    year: number;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/sign-in');
        return;
      }

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch user's cars
      const { data: userCarsData } = await supabase
        .from('user_cars')
        .select('cars(*)')
        .eq('user_id', user.id)
        .eq('is_owner', true);

      setUserCars(userCarsData?.map(item => (item.cars as unknown) as Car) || []);

      // Fetch user's orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, cars(make, model, year)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user data',
        variant: 'destructive',
      });
    }
  }

  async function deleteCar(carId: string) {
    try {
      await supabase.from('cars').delete().eq('id', carId);
      toast({
        title: 'Success',
        description: 'Car deleted successfully',
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete car',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Username:</span>{' '}
              {profile?.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile?.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cars" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cars">My Cars</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Cars</CardTitle>
              <Button asChild>
                <Link href="/cars/manage/new">Add New Car</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="relative h-16 w-24">
                          <Image
                            src={car.imageUrl}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{car.make}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(car.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <Link href={`/cars/manage/${car.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteCar(car.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.cars.year} {order.cars.make} {order.cars.model}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`capitalize ${
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'completed' ? 'text-green-600' :
                          'text-red-600'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/orders/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}