import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="mb-6 text-4xl font-bold tracking-tighter">Contact Us</h1>
          <div className="mb-8 space-y-4">
            <p className="text-lg text-muted-foreground">
              Have questions about our vehicles or import services? Get in touch
              with our team, and we'll be happy to help.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                description: "123 Car Street, Automotive City, AC 12345",
              },
              {
                icon: Phone,
                title: "Call Us",
                description: "+1 (234) 567-8900",
              },
              {
                icon: Mail,
                title: "Email Us",
                description: "info@carpoint.com",
              },
            ].map((contact, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <contact.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{contact.title}</h3>
                  <p className="text-muted-foreground">{contact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your inquiry..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}