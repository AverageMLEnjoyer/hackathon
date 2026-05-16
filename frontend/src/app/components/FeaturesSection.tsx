import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Zap, Shield, Palette, Code, Smartphone, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for the best user experience."
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Built with security best practices from the ground up."
  },
  {
    icon: Palette,
    title: "Customizable",
    description: "Easily customize colors, fonts, and components to match your brand."
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean, well-documented code that's easy to understand and extend."
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Looks great on all devices, from mobile to desktop."
  },
  {
    icon: Globe,
    title: "Modern Stack",
    description: "Built with React, TypeScript, and Tailwind CSS."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="container px-4 md:px-6 py-24 bg-muted/50">
      <div className="text-center mb-16">
        <h2 className="mb-4">Features</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to build modern web applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
