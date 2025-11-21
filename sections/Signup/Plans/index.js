// // "use client";

// // import React from "react";
// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardDescription,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";



// // export default function PricingPlans() {
// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
// //        <section id="pricing" className="py-20 bg-background">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="text-center mb-16">
// //             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
// //               Simple, Transparent Pricing
// //             </h2>
// //             <p className="text-xl text-muted-foreground">
// //               Choose the plan that fits your business size
// //             </p>
// //           </div>

// //           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
// //             <Card className="border-border">
// //               <CardHeader className="text-center pb-8">
// //                 <CardTitle className="text-2xl font-bold text-card-foreground">
// //                   Starter
// //                 </CardTitle>
// //                 <div className="mt-4">
// //                   <span className="text-4xl font-bold text-foreground">
// //                     $29
// //                   </span>
// //                   <span className="text-muted-foreground">/month</span>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Up to 1,000 products</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Basic reporting</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Email support</span>
// //                 </div>
// //                 <Link href="/signup" className="block pt-4">
// //                   <Button className="w-full" variant="outline">
// //                     Get Started
// //                   </Button>
// //                 </Link>
// //               </CardContent>
// //             </Card>

// //             <Card className="border-primary border-2 relative">
// //               <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
// //                 Most Popular
// //               </Badge>
// //               <CardHeader className="text-center pb-8">
// //                 <CardTitle className="text-2xl font-bold text-card-foreground">
// //                   Professional
// //                 </CardTitle>
// //                 <div className="mt-4">
// //                   <span className="text-4xl font-bold text-foreground">
// //                     $79
// //                   </span>
// //                   <span className="text-muted-foreground">/month</span>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Up to 10,000 products</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Advanced analytics</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Priority support</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">API access</span>
// //                 </div>
// //                 <Link href="/signup" className="block pt-4">
// //                   <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
// //                     Get Started
// //                   </Button>
// //                 </Link>
// //               </CardContent>
// //             </Card>

// //             <Card className="border-border">
// //               <CardHeader className="text-center pb-8">
// //                 <CardTitle className="text-2xl font-bold text-card-foreground">
// //                   Enterprise
// //                 </CardTitle>
// //                 <div className="mt-4">
// //                   <span className="text-4xl font-bold text-foreground">
// //                     $199
// //                   </span>
// //                   <span className="text-muted-foreground">/month</span>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Unlimited products</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Custom integrations</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">24/7 phone support</span>
// //                 </div>
// //                 <div className="flex items-center space-x-3">
// //                   <CheckCircle className="h-5 w-5 text-primary" />
// //                   <span className="text-foreground">Dedicated manager</span>
// //                 </div>
// //                 <Link href="/signup" className="block pt-4">
// //                   <Button className="w-full" variant="outline">
// //                     Contact Sales
// //                   </Button>
// //                 </Link>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// 2

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle } from "lucide-react";
// import { Switch } from "@/components/ui/switch"; // Shadcn switch

// export default function PricingPlans() {
//   const [isYearly, setIsYearly] = useState(false);

//   const pricingData = {
//     monthly: [
//       {
//         title: "Starter",
//         price: 29,
//         features: ["Up to 1,000 products", "Basic reporting", "Email support"],
//         buttonText: "Get Started",
//         popular: false,
//       },
//       {
//         title: "Professional",
//         price: 79,
//         features: [
//           "Up to 10,000 products",
//           "Advanced analytics",
//           "Priority support",
//           "API access",
//         ],
//         buttonText: "Get Started",
//         popular: true,
//       },
//       {
//         title: "Enterprise",
//         price: 199,
//         features: [
//           "Unlimited products",
//           "Custom integrations",
//           "24/7 phone support",
//           "Dedicated manager",
//         ],
//         buttonText: "Contact Sales",
//         popular: false,
//       },
//     ],
//     yearly: [
//       {
//         title: "Starter",
//         price: 299,
//         features: ["Up to 1,000 products", "Basic reporting", "Email support"],
//         buttonText: "Get Started",
//         popular: false,
//       },
//       {
//         title: "Professional",
//         price: 799,
//         features: [
//           "Up to 10,000 products",
//           "Advanced analytics",
//           "Priority support",
//           "API access",
//         ],
//         buttonText: "Get Started",
//         popular: true,
//       },
//       {
//         title: "Enterprise",
//         price: 1999,
//         features: [
//           "Unlimited products",
//           "Custom integrations",
//           "24/7 phone support",
//           "Dedicated manager",
//         ],
//         buttonText: "Contact Sales",
//         popular: false,
//       },
//     ],
//   };

//   const plans = isYearly ? pricingData.yearly : pricingData.monthly;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
//       <section id="pricing" className="py-20 bg-background w-full">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Title */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//               Simple, Transparent Pricing
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               Choose the plan that fits your business
//             </p>
//           </div>

//           {/* Toggle */}
//           <div className="flex items-center justify-center space-x-3 mb-12">
//             <span className={!isYearly ? "text-primary font-semibold" : ""}>
//               Monthly
//             </span>
//             <Switch
//               checked={isYearly}
//               onCheckedChange={setIsYearly}
//               className="data-[state=checked]:bg-primary"
//             />
//             <span className={isYearly ? "text-primary font-semibold" : ""}>
//               Yearly
//             </span>
//           </div>

//           {/* Dynamic Cards */}
//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             {plans.map((plan, idx) => (
//               <Card
//                 key={idx}
//                 className={`relative border ${
//                   plan.popular ? "border-primary border-2" : "border-border"
//                 }`}
//               >
//                 {plan.popular && (
//                   <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
//                     Most Popular
//                   </Badge>
//                 )}

//                 <CardHeader className="text-center pb-6">
//                   <CardTitle className="text-2xl font-bold text-card-foreground">
//                     {plan.title}
//                   </CardTitle>
//                   <div className="mt-3">
//                     <span className="text-4xl font-bold text-foreground">
//                       ${plan.price}
//                     </span>
//                     <span className="text-muted-foreground">
//                       /{isYearly ? "year" : "month"}
//                     </span>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   {plan.features.map((feature, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center space-x-3 text-foreground"
//                     >
//                       <CheckCircle className="h-5 w-5 text-primary" />
//                       <span>{feature}</span>
//                     </div>
//                   ))}

//                   <Link href="/signup" className="block pt-4">
//                     <Button
//                       className={`w-full ${
//                         plan.popular
//                           ? "bg-primary text-primary-foreground hover:bg-primary/90"
//                           : ""
//                       }`}
//                       variant={plan.popular ? "default" : "outline"}
//                     >
//                       {plan.buttonText}
//                     </Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


// 3 

"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  // Your JSON data
  const plans = [
    {
      planName: "Starter",
      description: "Ideal for individuals or small teams just getting started.",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        "Up to 3 active projects",
        "Basic analytics dashboard",
        "Email support",
        "Community access",
      ],
    },
    {
      planName: "Pro",
      description:
        "Perfect for growing teams needing more power and collaboration tools.",
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      features: [
        "Unlimited projects",
        "Advanced analytics and reporting",
        "Priority email and chat support",
        "Team collaboration tools",
        "Custom branding options",
      ],
      popular: true, // Default most popular
    },
    {
      planName: "Business",
      description:
        "Designed for businesses that require premium performance and integrations.",
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        "Unlimited users and projects",
        "Dedicated account manager",
        "Advanced security and compliance",
        "Integration with external APIs",
        "24/7 priority support",
      ],
    },
    {
      planName: "Enterprise",
      description:
        "Tailored for large organizations with advanced customization and SLA support.",
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        "Custom pricing based on requirements",
        "Full API access and custom integrations",
        "On-premise deployment option",
        "Dedicated success manager",
        "Enterprise-grade security and SLA",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 relative">
      <section id="pricing" className="py-16 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center space-x-3 mb-12">
            <span className={!isYearly ? "text-primary font-semibold" : ""}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={isYearly ? "text-primary font-semibold" : ""}>
              Yearly
            </span>
          </div>

          {/* Dynamic Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const isPopular = plan.popular === true;
              const isSelected = selectedPlan === plan.planName;

              return (
                <Card
                  key={plan.planName}
                  onClick={() => setSelectedPlan(plan.planName)}
                  className={`relative border cursor-pointer transition-all duration-300 
                    ${
                      isSelected
                        ? "border-primary shadow-lg shadow-primary/30 scale-105"
                        : "border-border hover:border-primary hover:shadow-md hover:shadow-primary/20"
                    }`}
                >
                  {/* Most Popular Badge */}
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold">
                      {plan.planName}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      {price ? (
                        <>
                          <span className="text-3xl font-bold text-foreground">
                            ${price}
                          </span>
                          <span className="text-muted-foreground">
                            /{isYearly ? "year" : "month"}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          Contact Sales
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-foreground"
                      >
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Buttons */}
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <Button variant="outline" className="px-6">
          Skip
        </Button>
        <Button className="px-6 bg-primary text-primary-foreground hover:bg-primary/90">
          Get Started
        </Button>
      </div>
    </div>
  );
}

// 4

// "use client";

// import React, { useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle } from "lucide-react";
// import { Switch } from "@/components/ui/switch";

// export default function PricingPlans() {
//   const [isYearly, setIsYearly] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState("Pro");

//   // ✅ Updated with Enterprise pricing
//   const plans = [
//     {
//       planName: "Starter",
//       description: "Ideal for individuals or small teams just getting started.",
//       monthlyPrice: 9.99,
//       yearlyPrice: 99.99,
//       features: [
//         "Up to 3 active projects",
//         "Basic analytics dashboard",
//         "Email support",
//         "Community access",
//       ],
//     },
//     {
//       planName: "Pro",
//       description:
//         "Perfect for growing teams needing more power and collaboration tools.",
//       monthlyPrice: 24.99,
//       yearlyPrice: 249.99,
//       features: [
//         "Unlimited projects",
//         "Advanced analytics and reporting",
//         "Priority email and chat support",
//         "Team collaboration tools",
//         "Custom branding options",
//       ],
//       popular: true,
//     },
//     {
//       planName: "Business",
//       description:
//         "Designed for businesses that require premium performance and integrations.",
//       monthlyPrice: 49.99,
//       yearlyPrice: 499.99,
//       features: [
//         "Unlimited users and projects",
//         "Dedicated account manager",
//         "Advanced security and compliance",
//         "Integration with external APIs",
//         "24/7 priority support",
//       ],
//     },
//     {
//       planName: "Enterprise",
//       description:
//         "Tailored for large organizations with advanced customization and SLA support.",
//       monthlyPrice: 99.99,
//       yearlyPrice: 999.99,
//       features: [
//         "Custom integrations and API access",
//         "On-premise deployment option",
//         "Dedicated success manager",
//         "Enterprise-grade security",
//         "SLA and 24/7 support",
//       ],
//     },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-6 py-12 relative">
//       <section id="pricing" className="py-16 w-full">
//         <div className="max-w-6xl mx-auto">
//           {/* Heading */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//               Simple, Transparent Pricing
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               Choose the plan that fits your needs
//             </p>
//           </div>

//           {/* Toggle */}
//           <div className="flex items-center justify-center space-x-3 mb-12">
//             <span className={!isYearly ? "text-primary font-semibold" : ""}>
//               Monthly
//             </span>
//             <Switch
//               checked={isYearly}
//               onCheckedChange={setIsYearly}
//               className="data-[state=checked]:bg-primary"
//             />
//             <span className={isYearly ? "text-primary font-semibold" : ""}>
//               Yearly
//             </span>
//           </div>

//           {/* ✅ First row (3 cards) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
//             {plans.slice(0, 3).map((plan) => {
//               const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
//               const isPopular = plan.popular === true;
//               const isSelected = selectedPlan === plan.planName;

//               return (
//                 <Card
//                   key={plan.planName}
//                   onClick={() => setSelectedPlan(plan.planName)}
//                   className={`relative w-full sm:w-[90%] md:w-full h-full transition-all duration-300 cursor-pointer
//                     ${
//                       isSelected
//                         ? "border-primary shadow-lg shadow-primary/30 scale-105"
//                         : "border-border hover:border-primary hover:shadow-md hover:shadow-primary/20"
//                     }`}
//                 >
//                   {isPopular && (
//                     <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
//                       Most Popular
//                     </Badge>
//                   )}

//                   <CardHeader className="text-center pb-4">
//                     <CardTitle className="text-xl font-bold">
//                       {plan.planName}
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground text-sm mt-2">
//                       {plan.description}
//                     </CardDescription>
//                     <div className="mt-4">
//                       <span className="text-3xl font-bold text-foreground">
//                         ${price}
//                       </span>
//                       <span className="text-muted-foreground">
//                         /{isYearly ? "year" : "month"}
//                       </span>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-3 text-sm">
//                     {plan.features.map((feature, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center space-x-2 text-foreground"
//                       >
//                         <CheckCircle className="h-4 w-4 text-primary" />
//                         <span>{feature}</span>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>

//           {/* ✅ Enterprise Card Centered */}
//           <div className="flex justify-center mt-6">
//             {plans.slice(3).map((plan) => {
//               const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
//               const isSelected = selectedPlan === plan.planName;

//               return (
//                 <Card
//                   key={plan.planName}
//                   onClick={() => setSelectedPlan(plan.planName)}
//                   className={`relative w-full sm:w-[90%] md:w-[70%] lg:w-[30%] h-full transition-all duration-300 cursor-pointer
//                     ${
//                       isSelected
//                         ? "border-primary shadow-lg shadow-primary/30 scale-105"
//                         : "border-border hover:border-primary hover:shadow-md hover:shadow-primary/20"
//                     }`}
//                 >
//                   <CardHeader className="text-center pb-4">
//                     <CardTitle className="text-xl font-bold">
//                       {plan.planName}
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground text-sm mt-2">
//                       {plan.description}
//                     </CardDescription>
//                     <div className="mt-4">
//                       <span className="text-3xl font-bold text-foreground">
//                         ${price}
//                       </span>
//                       <span className="text-muted-foreground">
//                         /{isYearly ? "year" : "month"}
//                       </span>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-3 text-sm">
//                     {plan.features.map((feature, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center space-x-2 text-foreground"
//                       >
//                         <CheckCircle className="h-4 w-4 text-primary" />
//                         <span>{feature}</span>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ✅ Buttons slightly left */}
//       <div className="absolute bottom-8 right-12 flex space-x-4">
//         <Button variant="outline" className="px-6">
//           Skip
//         </Button>
//         <Button className="px-6 bg-primary text-primary-foreground hover:bg-primary/90">
//           Get Started
//         </Button>
//       </div>
//     </div>
//   );
// }
