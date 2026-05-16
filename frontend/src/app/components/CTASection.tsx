import { Button } from "./ui/button";

export function CTASection() {
  return (
    <section id="contact" className="container px-4 md:px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="mb-4">Ready to Get Started?</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Join thousands of developers building amazing websites with our template.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Start Building</Button>
          <Button size="lg" variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}
