"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import AuthApi from "@/services/auth/api";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const orgSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  registrationNumber: z.string().min(2, "Register / GST No is required"),
  address1: z.string().min(2, "Address line 1 is required"),
  address2: z.string().optional(),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

const Onboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const userUuid = searchParams.get("user_uuid");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(orgSchema),
  });

  useEffect(() => {
    if (!userUuid) {
      toast.error("Invalid onboarding link.");
      router.push("/signup");
    }
  }, [userUuid, router]);

  const onSubmit = async (data) => {
    if (!userUuid) return;

    const payload = {
      tent_name: data.organizationName,
      tent_registration_number: data.registrationNumber,
      tent_address1: data.address1,
      tent_address2: data.address2 || "",
      tent_state: data.state,
      tent_country: data.country,
    };

    try {
      setLoading(true);

      const res = await AuthApi.registerTenant(userUuid, payload);

      if (res.data?.success === false) {
        toast.error(res.data.message || "Something went wrong");
        return;
      }

      toast.success(
        res.data?.message ||
          "Organization setup complete! Free trial activated."
      );

      router.push("/login");
    } catch (err) {
      const backendMsg = err?.response?.data?.message || "Something went wrong";
      toast.error(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-3xl">
        <Card className="shadow-xl border border-border/50">
          <CardHeader>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight">
                Create Your Organization
              </h1>
              <div>
                <p className="text-sm text-muted-foreground">
                  You&apos;re almost done! Just a few details to set up your
                  workspace.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your <strong>14-day Free Trial</strong> will start
                  automatically.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization + GST */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Organization Name *</Label>
                  <Input
                    {...register("organizationName")}
                    className={errors.organizationName ? "border-red-500" : ""}
                  />
                  {errors.organizationName && (
                    <p className="text-sm text-red-500">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Register No / GST Number *</Label>
                  <Input
                    {...register("registrationNumber")}
                    className={
                      errors.registrationNumber ? "border-red-500" : ""
                    }
                  />
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-500">
                      {errors.registrationNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <Label>Address Line 1 *</Label>
                <Input
                  {...register("address1")}
                  className={errors.address1 ? "border-red-500" : ""}
                />
                {errors.address1 && (
                  <p className="text-sm text-red-500">
                    {errors.address1.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Address Line 2</Label>
                <Input {...register("address2")} />
              </div>

              {/* State + Country */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>State *</Label>
                  <Select onValueChange={(val) => setValue("state", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Telangana">Telangana</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Country *</Label>
                  <Select onValueChange={(val) => setValue("country", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary-foreground" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground text-right mt-4">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
