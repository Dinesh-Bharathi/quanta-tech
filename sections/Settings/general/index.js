"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Building2 } from "lucide-react";
import axiosInstance from "@/services/network";
import { decryption, encryption } from "@/lib/encryption";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import GeneralApi from "@/services/settings/general/api";

// Zod validation schema
const organizationSchema = z.object({
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters"),
  description: z.string().or(z.literal("")),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  contact: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid contact number"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{4,10}$/, "Invalid pincode format"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  x: z.string().url("Invalid X (Twitter) URL").optional().or(z.literal("")),
});

// Loading skeleton component
const FormSkeleton = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold tracking-tight">
        Organization Settings
      </h2>
      <p className="text-muted-foreground mt-1">
        Manage your organization information and settings
      </p>
    </div>

    {/* Organization Information Card */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Address Information Card */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Social Media Links Card */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export function GeneralSettings() {
  const { tentDetails } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: "",
      description: "",
      email: "",
      contact: "",
      registrationNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      website: "",
      facebook: "",
      instagram: "",
      youtube: "",
      x: "",
    },
  });

  // Fetch organization data from API
  const fetchOrganizationData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await GeneralApi.getTentDetails(tentDetails?.tent_uuid);

      const successdata = decryption(response.data?.data);

      if (!successdata) {
        throw new Error(
          `Failed to fetch organization data: ${response.statusText}`
        );
      }

      const data = {
        organizationName: successdata.tent_name || "",
        description: successdata.tent_description || "",
        email: successdata.tent_email || "",
        contact: successdata.tent_phone || "",
        registrationNumber: successdata.tent_gst_no || "",
        streetAddress: successdata.tent_address1 || "",
        city: successdata.tent_address2 || "",
        state: successdata.tent_state || "",
        country: successdata.tent_country || "",
        pincode: successdata.tent_postalcode || "",
        website: successdata.tent_web || "",
        facebook: successdata.tent_facebook || "",
        instagram: successdata.tent_insta || "",
        youtube: successdata.tent_youtube || "",
        x: successdata.tent_twitter || "",
      };

      setOrganizationData(data);

      // Use reset instead of setValue for better form population
      reset(data);
    } catch (err) {
      console.error("Error fetching organization data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (tentDetails?.tent_uuid) {
      setIsLoading(true);
      setError(null);
      fetchOrganizationData();
    }
  }, [tentDetails?.tent_uuid]);

  const onSubmit = async (data) => {
    try {
      setError(null);

      // Transform form data to API format
      const payload = {
        tent_name: data.organizationName,
        tent_description: data.description,
        tent_email: data.email,
        tent_phone_no: data.contact,
        tent_gst_no: data.registrationNumber,
        tent_street: data.streetAddress,
        tent_city: data.city,
        tent_state: data.state,
        tent_country: data.country,
        tent_pincode: data.pincode,
        tent_web: data.website || null,
        tent_facebook: data.facebook || null,
        tent_insta: data.instagram || null,
        tent_youtube: data.youtube || null,
        tent_twitter: data.x || null,
      };

      console.log("payload", payload);

      const reqBody = encryption(payload);

      // PUT request with axios instance
      const response = await axiosInstance.put(
        `/api/account/tent-details/${tentDetails?.tent_uuid}`,
        { data: reqBody }
      );

      setOrganizationData(data); // update local state with form values
      toast.success(`Organization settings saved successfully!`, {
        icon: <Building2 className="w-5 h-5" />,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to save organization settings");
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (organizationData) {
      reset(organizationData);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleRetry = () => {
    fetchOrganizationData();
  };

  // Show loading skeleton while fetching data
  if (isLoading) {
    return <FormSkeleton />;
  }

  // Show error state
  if (error && !organizationData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Organization Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your organization information and settings
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load organization data: {error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert for form submission errors */}
      {error && organizationData && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header with Edit button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Organization Settings
          </h2>
          <p className="mt-1 text-muted-foreground">
            Manage your organization information and settings
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} disabled={isLoading}>
            Edit
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Update your organization&apos;s basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input
                id="organizationName"
                {...register("organizationName")}
                disabled={!isEditing}
                className={errors.organizationName ? "border-red-500" : ""}
              />
              {errors.organizationName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                {...register("registrationNumber")}
                disabled={!isEditing}
                className={errors.registrationNumber ? "border-red-500" : ""}
              />
              {errors.registrationNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your organization"
              {...register("description")}
              disabled={!isEditing}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={!isEditing}
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
                disabled={!isEditing}
                className={errors.contact ? "border-red-500" : ""}
              />
              {errors.contact && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>
            Your organization&apos;s primary address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              {...register("streetAddress")}
              disabled={!isEditing}
              className={errors.streetAddress ? "border-red-500" : ""}
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-500 mt-1">
                {errors.streetAddress.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register("city")}
                disabled={!isEditing}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register("state")}
                disabled={!isEditing}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register("country")}
                disabled={!isEditing}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...register("pincode")}
                disabled={!isEditing}
                className={errors.pincode ? "border-red-500" : ""}
              />
              {errors.pincode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your organization&apos;s social media presence (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                {...register("website")}
                disabled={!isEditing}
                className={errors.website ? "border-red-500" : ""}
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourpage"
                {...register("facebook")}
                disabled={!isEditing}
                className={errors.facebook ? "border-red-500" : ""}
              />
              {errors.facebook && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.facebook.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourpage"
                {...register("instagram")}
                disabled={!isEditing}
                className={errors.instagram ? "border-red-500" : ""}
              />
              {errors.instagram && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.instagram.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/yourchannel"
                {...register("youtube")}
                disabled={!isEditing}
                className={errors.youtube ? "border-red-500" : ""}
              />
              {errors.youtube && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.youtube.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="x">X (Twitter)</Label>
              <Input
                id="x"
                placeholder="https://x.com/yourhandle"
                {...register("x")}
                disabled={!isEditing}
                className={errors.x ? "border-red-500" : ""}
              />
              {errors.x && (
                <p className="text-sm text-red-500 mt-1">{errors.x.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {isEditing && (
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
