"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import ControlsApi from "@/services/controls/api";
import { useAuth } from "@/context/AuthContext";
import { encryption, decryption } from "@/lib/encryption";
import Loading from "@/app/(dashboard)/loading";

// UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

// --------------------------------------------------
// 🔐 Validation Schema
// --------------------------------------------------
const BranchSchema = z.object({
  branch_name: z.string().min(2, "Branch name must be at least 2 characters"),
  address1: z.string().optional(),
  address2: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
});

// --------------------------------------------------
// 🧩 Component
// --------------------------------------------------
const AddBranch = ({ mode = "add", branchUuid = null }) => {
  const router = useRouter();
  const { tentDetails } = useAuth();

  const [loading, setLoading] = useState(mode === "edit");

  const form = useForm({
    resolver: zodResolver(BranchSchema),
    defaultValues: {
      branch_name: "",
      address1: "",
      address2: "",
      phone: "",
      country: "",
      state: "",
      postal_code: "",
    },
  });

  // --------------------------------------------------
  // 🧠 Populate when editing
  // --------------------------------------------------
  useEffect(() => {
    const fetchBranchData = async () => {
      if (!branchUuid || mode !== "edit") return;

      try {
        setLoading(true);
        const response = await ControlsApi.getTenantBranchById(
          tentDetails?.tent_uuid,
          branchUuid
        );
        // const decrypted = decryption(response?.data?.data);

        // const data = decrypted?.data || decrypted;
        const data = response?.data?.data || {};

        form.reset({
          branch_name: data.branch_name || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          phone: data.phone || "",
          country: data.country || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
        });
      } catch (error) {
        console.error("Error fetching branch details:", error);
        toast.error("Failed to load branch details");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [mode, branchUuid, tentDetails?.tent_uuid]);

  // --------------------------------------------------
  // 🚀 Submit Handler
  // --------------------------------------------------
  const onSubmit = async (values) => {
    try {
      setLoading(true);

      // const payload = encryption(values);
      const payload = values;

      if (mode === "edit") {
        await ControlsApi.updateTenantBranch(
          tentDetails?.tent_uuid,
          branchUuid,
          payload
        );
        toast.success("Branch updated successfully!");
      } else {
        await ControlsApi.createTenantBranch(tentDetails?.tent_uuid, payload);
        toast.success("Branch created successfully!");
      }

      router.push("/controls/branches");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  // --------------------------------------------------
  // 🎨 UI
  // --------------------------------------------------
  return (
    <div className="flex-1 space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "edit" ? "Edit Branch" : "Add New Branch"}
        </h1>

        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Update the details of this branch."
            : "Create a new branch for your organisation."}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Branch Details</CardTitle>
              <CardDescription>
                Provide the required information for this branch.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch Name */}
                <FormField
                  control={form.control}
                  name="branch_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Branch Alpha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address 1 */}
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Street / Building" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address 2 */}
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment / Suite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State / Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal Code */}
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>

            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {mode === "edit" ? "Update Branch" : "Create Branch"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddBranch;
