"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Car, CircleDollarSign, FileText, Settings, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCars: 0,
    totalValue: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
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
        .from('cars')
        .select('*, user_cars!inner(*)')
        .eq('user_cars.user_id', user.id);

      // Calculate stats
      if (userCarsData) {
        setStats({
          totalCars: userCarsData.length,
          totalValue: userCarsData.reduce((sum, car) => sum + car.price, 0),
          pendingOrders: 0, // You can implement order tracking later
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {profile?.username}</h1>
        <p className="text-muted-foreground">
          Manage your car listings and track your performance
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="h-auto flex-col gap-2 p-6" asChild>
            <Link href="/cars/manage/new">
              <Plus className="h-6 w-6" />
              <span>Add New Car</span>
            </Link>
          </Button>
          <Button className="h-auto flex-col gap-2 p-6" variant="outline" asChild>
            <Link href="/profile">
              <Settings className="h-6 w-6" />
              <span>Profile Settings</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(stats.totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Profile created
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
