'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import * as z from "zod";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove?: (url: string) => void;
}

export function ImageUpload({ value = [], onChange, onRemove }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange([...value, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 5 - value.length,
    disabled: value.length >= 5
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
          ${value.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-muted-foreground">
              or click to select files (max 5 images)
            </p>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {value.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -right-2 -top-2"
                onClick={() => onRemove && onRemove(image)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  bodyType: z.string().min(1, "Body type is required"),
  color: z.string().min(1, "Color is required"),
  features: z.string().min(1, "Features are required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type CarFormValues = z.infer<typeof carFormSchema>;
