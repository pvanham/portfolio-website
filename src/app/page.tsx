// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui Button
import {
  ArrowRight,
  Users,
  CalendarDays,
  CreditCard,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react"; // Lucide icons
import { Metadata } from "next";

// Define a type for feature items for better organization
type FeatureItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

export const metadata: Metadata = {
  // Updated title to be more descriptive
  title: "Dance Studio Manager",
  description: "This is an app to help manager dance studios",
};

const features: FeatureItem[] = [
  {
    icon: CalendarDays,
    title: "Effortless Scheduling",
    description:
      "Manage classes, appointments, and staff availability all in one place with our intuitive calendar system.",
  },
  {
    icon: Users,
    title: "Seamless Client Management",
    description:
      "Keep track of student enrollments, parent communications, and progress with dedicated client portals.",
  },
  {
    icon: CreditCard,
    title: "Automated Billing & Payments",
    description:
      "Simplify your finances with automated invoicing, online payments, and subscription management.",
  },
  {
    icon: BarChart3,
    title: "Insightful Reporting",
    description:
      "Gain valuable insights into your studio’s performance with comprehensive reports on attendance, revenue, and more.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Streamline Operations",
    description:
      "Automate tedious tasks like scheduling, billing, and communication, freeing up your time to focus on what you love – teaching dance!",
  },
  {
    icon: Sparkles,
    title: "Enhance Client Experience",
    description:
      "Provide parents and students with a professional, easy-to-use portal for registration, payments, and updates, boosting satisfaction and retention.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Built with modern technology and robust security measures, ensuring your studio's data is safe and accessible whenever you need it.",
  },
];

export default function HomePage() {
  return (
    <main className="from-background dark:from-background flex flex-col items-center bg-gradient-to-b via-purple-50/30 to-indigo-50/30 dark:via-purple-900/10 dark:to-indigo-900/10">
      {/* Hero Section */}
      <section className="from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 w-full bg-gradient-to-br via-transparent py-20 md:py-32 lg:py-40 dark:via-transparent">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Elevate Your <span className="text-primary">Dance Studio</span>{" "}
            Management
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg leading-8 sm:text-xl md:text-2xl">
            Tabixell provides an all-in-one platform to streamline your
            scheduling, billing, client communication, and more. Focus on your
            passion, we&apos;ll handle the rest.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/sign-up">
              <Button size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-background/70 w-full py-16 backdrop-blur-md md:py-24"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Everything Your Studio Needs
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Powerful features designed to make managing your dance studio
              effortless.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card hover:shadow-primary/20 flex flex-col items-center rounded-xl p-6 text-center shadow-lg transition-shadow duration-300"
              >
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-foreground text-xl leading-7 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-base leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section / Why Choose Us */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16 lg:text-center">
            <h2 className="text-primary text-base leading-7 font-semibold">
              Why Tabixell?
            </h2>
            <p className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Transform Your Studio Operations
            </p>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              We&apos;re dedicated to providing dance studios with the tools
              they need to thrive in a competitive world.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="relative pl-16">
                <dt className="text-foreground text-base leading-7 font-semibold">
                  <div className="bg-primary text-primary-foreground absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <benefit.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {benefit.title}
                </dt>
                <dd className="text-muted-foreground mt-2 text-base leading-7">
                  {benefit.description}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary/5 dark:bg-primary/10 w-full py-16 md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Simplify Your Studio Management?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            Join hundreds of studios transforming their operations with
            Tabixell.
          </p>
          <div className="mt-10">
            <Link href="/sign-up">
              <Button size="lg" className="group px-8 py-4 text-lg">
                Start Your Free Trial Today
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-border/40 bg-background w-full border-t py-8">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-sm md:px-6">
          <p>
            &copy; {new Date().getFullYear()} Tabixell. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
