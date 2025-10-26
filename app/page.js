"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  Menu,
  X,
  Boxes,
  Receipt,
  ShoppingCart,
  Users,
  FileText,
  Proportions,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Receipt className="h-6 w-6 text-primary" />,
      title: "Smart Billing",
      description:
        "Automated invoicing, payment tracking, and seamless integration with popular payment gateways",
    },
    {
      icon: <Package className="h-6 w-6 text-primary" />,
      title: "Inventory Management",
      description:
        "Real-time stock tracking, low inventory alerts, and automated reorder points",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Product Analytics",
      description:
        "Comprehensive insights into product performance, sales trends, and profitability analysis",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: "Financial Reports",
      description:
        "Detailed financial reporting with profit/loss statements and revenue tracking",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Sales Forecasting",
      description:
        "AI-powered demand forecasting to optimize inventory and maximize profits",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Multi-User Access",
      description:
        "Role-based permissions for team collaboration and secure data access",
    },
  ];

  const benefits = [
    "Reduce manual data entry by 80%",
    "Prevent stockouts with smart alerts",
    "Automate invoice generation",
    "Track profitability in real-time",
    "Integrate with existing tools",
    "Scale with your business growth",
  ];

  const stats = [
    { number: "50K+", label: "Businesses Trust Us" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "$2M+", label: "Revenue Managed Daily" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Boxes className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div className="hidden md:block ml-4">
                <span className="text-xl font-bold text-foreground">
                  Quanta
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>

              <ThemeToggle />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="#features"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              🚀 New: AI-Powered Inventory Forecasting
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Complete Business
              <span className="block text-primary">Management Suite</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-balance">
              Streamline your billing, inventory, and product management with
              our all-in-one SaaS platform. Built for growing businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 hover:bg-accent"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From inventory tracking to financial reporting, we&apos;ve got you
              covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
              >
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Quanta?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of businesses that have transformed their
                operations with our comprehensive management platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center border-border">
                <Proportions className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get instant insights into your business performance
                </p>
              </Card>
              <Card className="p-6 text-center border-border">
                <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">
                  E-commerce Ready
                </h3>
                <p className="text-sm text-muted-foreground">
                  Seamlessly integrate with your online store
                </p>
              </Card>
              <Card className="p-6 text-center border-border">
                <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">
                  Custom Reports
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate detailed reports tailored to your needs
                </p>
              </Card>
              <Card className="p-6 text-center border-border">
                <Package className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">
                  Multi-location
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage inventory across multiple warehouses
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your business size
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Starter
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    $29
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Up to 1,000 products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Basic reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Email support</span>
                </div>
                <Link href="/register" className="block pt-4">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary border-2 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Professional
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    $79
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Up to 10,000 products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">API access</span>
                </div>
                <Link href="/register" className="block pt-4">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Enterprise
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    $199
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Unlimited products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Custom integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">24/7 phone support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Dedicated manager</span>
                </div>
                <Link href="/register" className="block pt-4">
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Join thousands of businesses who have streamlined their operations
            with Quanta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 px-8 py-3 text-lg"
              >
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="bg-background text-foreground hover:bg-background/90 px-8 py-3 text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                  <Boxes className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Quanta
                </span>
              </div>
              <p className="text-muted-foreground">
                Complete business management solution for modern enterprises.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p>&copy; 2025 Quanta. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
