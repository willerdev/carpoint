import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Ship, Truck } from "lucide-react";
import Image from "next/image";

export default function ImportsPage() {
  return (
    <>
      <section className="relative h-[400px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop"
          alt="Car import"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-white sm:text-5xl">
            Import Your Dream Car
          </h1>
          <p className="mb-8 max-w-[600px] text-lg text-gray-200">
            Direct imports from Japan, Korea, and China with full support and
            hassle-free process.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Ship,
              title: "Sea Freight",
              description:
                "Cost-effective shipping solution with regular departures from major Asian ports.",
            },
            {
              icon: Plane,
              title: "Air Freight",
              description:
                "Express delivery option for urgent imports with complete tracking.",
            },
            {
              icon: Truck,
              title: "Door Delivery",
              description:
                "Complete logistics solution from port to your doorstep.",
            },
          ].map((service, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}