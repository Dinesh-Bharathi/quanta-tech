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
import { useSearchParams } from "next/navigation";
import AuthApi from "@/services/auth/api";
import { toast } from "sonner";

// ✅ Updated Schema (removed required for description, email, contact)
const orgSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  description: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
});

const Onboarding = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orgSchema),
  });

  const searchParams = useSearchParams();

  const onSubmit = async (data) => {
    const userUuid = searchParams.get("user_uuid");

    const payload = {
      tent_name: data.organizationName,
      tent_phone: data.contact || "",
      tent_email: data.email || "",
    };

    try {
      const res = await AuthApi.registerTenant(userUuid, payload);

      // If backend returns success === false
      if (res.data?.success === false) {
        toast.error(res.data.message || "Something went wrong");
        return;
      }

      toast.success(res.data?.message || "Tenant registered successfully!");
      // router.push("/signup/plans");
    } catch (err) {
      console.log("API Error:", err);

      const backendMsg = err?.response?.data?.message || "Something went wrong";

      toast.error(backendMsg);
    }
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

            {/* Description (optional) */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your organization"
                {...register("description")}
              />
            </div>

            {/* Email + Contact (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>

              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" {...register("contact")} />
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
