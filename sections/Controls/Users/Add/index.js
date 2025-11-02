"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import ControlsApi from "@/services/controls/api";
import { useAuth } from "@/context/AuthContext";
import { encryption, decryption } from "@/lib/encryption";
import Loading from "@/app/(dashboard)/loading";

// 🧩 UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🧭 Icons
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  UsersRound, // user icon for title
} from "lucide-react";

// ✅ Validation schema (dynamic)
const getUserSchema = (isEdit) =>
  z
    .object({
      user_name: z.string().min(2, "Name must be at least 2 characters"),
      user_email: z.string().email("Enter a valid email address"),
      user_country_code: z.string().optional(),
      user_phone: z.string().optional(),
      role_uuid: z.string().min(1, "Select a role"),
      password: isEdit
        ? z.string().optional()
        : z.string().min(6, "Password must be at least 6 characters"),
      confirm_password: isEdit
        ? z.string().optional()
        : z.string().min(6, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

const AddUser = ({ mode = "add", userUuid, userData }) => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(getUserSchema(mode === "edit")),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_country_code: "+1",
      user_phone: "",
      role_uuid: "",
      password: "",
      confirm_password: "",
    },
  });

  // 🧠 Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await ControlsApi.tenantRoles(tentDetails?.tent_uuid);
        const decryptRes = decryption(res?.data?.data);
        setRoles(decryptRes?.data || []);
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };
    if (tentDetails?.tent_uuid) fetchRoles();
  }, [tentDetails?.tent_uuid]);

  // 🧠 Populate data when editing
  useEffect(() => {
    if (mode === "edit" && userData) {
      const data = userData || {};
      form.reset({
        user_name: data.user_name || "",
        user_email: data.user_email || "",
        user_country_code: data.user_country_code || "+1",
        user_phone: data.user_phone || "",
        role_uuid: data.role_uuid || "", // ✅ role pre-populated
      });
      setLoading(false);
    }
  }, [mode, userData, form]);

  // 🧠 Submit handler
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = encryption(values);

      if (mode === "edit") {
        await ControlsApi.updateTenantUser(userUuid, values);
        toast.success("User updated successfully");
      } else {
        await ControlsApi.createTenantUser(tentDetails?.tent_uuid, values);
        toast.success("User created successfully");
      }

      router.push("/controls/users");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex-1 space-y-6 pb-8">
      {/* 🔹 Header Section */}

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
          {mode === "edit" ? "Edit User" : "Add New User"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Update user details and role assignment."
            : "Add a new user with a role and secure credentials."}
        </p>
      </div>

      {/* 🧾 Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Fill in user information below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="user_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="5551234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Role */}
                <FormField
                  control={form.control}
                  name="role_uuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.role_uuid}
                              value={role.role_uuid}
                            >
                              {role.role_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Fields - Only in Add Mode */}
              {mode === "add" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirm ? "text" : "password"}
                              placeholder="Confirm password"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirm((p) => !p)}
                          >
                            {showConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Buttons */}
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
              {mode === "edit" ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddUser;
