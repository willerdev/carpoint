export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  imageUrl: string;
  images: string[];
  features: string[];
  condition: string;
}

export type CarFilterParams = {
  make?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
};