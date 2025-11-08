"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";


const orgSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
});

const Onboarding = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orgSchema),
  });

  const router = useRouter()

  const onSubmit = (data) => {
    console.log("Organization Info Submitted:", data);
    router.push('/signup/plans')
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Update your organization&apos;s basic information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Org Name + Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  {...register("organizationName")}
                  className={errors.organizationName ? "border-red-500" : ""}
                />
                {errors.organizationName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.organizationName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="registrationNumber">
                  Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  {...register("registrationNumber")}
                  className={errors.registrationNumber ? "border-red-500" : ""}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your organization"
                {...register("description")}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Email + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  {...register("contact")}
                  className={errors.contact ? "border-red-500" : ""}
                />
                {errors.contact && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
