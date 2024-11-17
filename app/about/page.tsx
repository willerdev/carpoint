import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-4xl font-bold tracking-tighter">
              About Carpoint
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Founded in 2024, Carpoint has established itself as a premier
                destination for automotive enthusiasts and buyers seeking quality
                vehicles.
              </p>
              <p>
                Our mission is to provide an exceptional car buying experience through
                transparency, expertise, and personalized service. We specialize in
                both local and imported vehicles, offering a carefully curated
                selection of premium cars.
              </p>
              <p>
                With direct import channels from Japan, Korea, and China, we bring
                you exclusive access to unique vehicles that match your specific
                requirements and preferences.
              </p>
            </div>
          </div>
          <div className="relative aspect-square">
            <Image
              src="https://images.unsplash.com/photo-1562141961-b5d1855d75c7?q=80&w=2070&auto=format&fit=crop"
              alt="Carpoint showroom"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Quality Assurance</h3>
              <p className="text-muted-foreground">
                Every vehicle undergoes rigorous inspection and verification to ensure the highest standards of quality and reliability.
              </p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Customer First</h3>
              <p className="text-muted-foreground">
                We prioritize our customers' needs and preferences, providing personalized service and support throughout their journey.
              </p>
            </div>
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency in pricing, vehicle history, and all our business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                alt="CEO"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">John Smith</h3>
            <p className="text-muted-foreground">CEO & Founder</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop"
                alt="Sales Director"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Sarah Johnson</h3>
            <p className="text-muted-foreground">Sales Director</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070&auto=format&fit=crop"
                alt="Technical Director"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Michael Chen</h3>
            <p className="text-muted-foreground">Technical Director</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold">Visit Our Showroom</h2>
          <p className="mb-4 text-lg text-muted-foreground">
            Experience our premium selection of vehicles in person
          </p>
          <p className="text-muted-foreground">
            123 Car Street, Automotive District<br />
            Opening Hours: Mon-Sat 9:00 AM - 6:00 PM
          </p>
        </div>
      </section>
    </div>
  );
}