import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container px-4 md:px-6 py-24 md:py-32">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
          <span className="mr-2">✨</span>
          <span>New features available</span>
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight">
          Build Your Dream Website with Ease
        </h1>

        <p className="mb-8 text-lg md:text-xl text-muted-foreground max-w-2xl">
          A modern, responsive starter template with all the components you need
          to create beautiful web applications. Start building today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
