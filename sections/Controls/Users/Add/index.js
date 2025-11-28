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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MobileNumberField } from "@/components/CustomMobileNumber";

// 🧭 Icons
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  X,
  Plus,
  AlertCircle,
  UserCog,
  Info,
} from "lucide-react";

// ✅ Validation schema
const getUserSchema = (isEdit) =>
  z
    .object({
      user_name: z.string().min(2, "Name must be at least 2 characters"),
      user_email: z.string().email("Enter a valid email address"),
      user_country_code: z.string().min(1, "Country code is required"),
      user_phone: z.string().min(1, "Phone number is required"),
      password: isEdit
        ? z.string().optional()
        : z.string().min(6, "Password must be at least 6 characters"),
      confirm_password: isEdit
        ? z.string().optional()
        : z.string().min(6, "Confirm your password"),
    })
    .refine(
      (data) => {
        if (!isEdit) {
          return data.password === data.confirm_password;
        }
        if (data.password && data.password.length > 0) {
          return data.password === data.confirm_password;
        }
        return true;
      },
      {
        message: "Passwords do not match",
        path: ["confirm_password"],
      }
    )
    .refine(
      (data) => {
        // You'll need to pass countries data to validate properly
        // For now, basic numeric validation
        return /^\d+$/.test(data.user_phone);
      },
      {
        message: "Phone number must contain only digits",
        path: ["user_phone"],
      }
    );

const AddUser = ({ mode = "add", userUuid, userData }) => {
  const router = useRouter();
  const { tentDetails, branchesList } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileValidationError, setMobileValidationError] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(true);

  // 🎯 Role assignments state
  const [roleAssignments, setRoleAssignments] = useState([
    { role_uuid: "", branch_uuid: "" },
  ]);
  const [validationError, setValidationError] = useState(null);

  const form = useForm({
    resolver: zodResolver(getUserSchema(mode === "edit")),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_country_code: "+1",
      user_phone: "",
      password: "",
      confirm_password: "",
    },
  });

  // 🧠 Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await ControlsApi.tenantRoles(tentDetails?.tenant_uuid);
        const decryptRes = decryption(res?.data?.data);
        setRoles(decryptRes?.data || []);
      } catch (err) {
        console.error("Failed to load roles", err);
        toast.error("Failed to load available roles");
      }
    };
    if (tentDetails?.tenant_uuid) fetchRoles();
  }, [tentDetails?.tenant_uuid]);

  // 🧠 Populate data when editing
  useEffect(() => {
    if (mode === "edit" && userData) {
      const data = userData || {};
      form.reset({
        user_name: data.user_name || "",
        user_email: data.user_email || "",
        user_country_code: data.user_country_code || "+1",
        user_phone: data.user_phone || "",
        password: "",
        confirm_password: "",
      });

      // ✅ Convert existing roles to assignment format
      if (data.roles && Array.isArray(data.roles)) {
        const assignments = data.roles.map((role) => ({
          role_uuid: role.role_uuid,
          branch_uuid: role.branch?.branch_uuid || "",
        }));
        setRoleAssignments(
          assignments.length > 0
            ? assignments
            : [{ role_uuid: "", branch_uuid: "" }]
        );
      }

      setLoading(false);
    }
  }, [mode, userData, form]);

  // 🔍 Helper: Determine if role is account-wide based on role_type
  const isAccountWideRole = (roleUuid) => {
    const role = roles.find((r) => r.role_uuid === roleUuid);
    // Assuming role_type "system" or "account" means account-wide access
    return role?.role_type === "SYSTEM" || role?.role_type === "ACCOUNT";
  };

  // 🔍 Validation: Check for conflicts
  const validateRoleAssignments = (assignments) => {
    setValidationError(null);

    // Filter out empty assignments
    const validAssignments = assignments.filter((a) => a.role_uuid);

    if (validAssignments.length === 0) {
      setValidationError("At least one role must be assigned");
      return false;
    }

    // Check for incomplete assignments (role selected but branch missing for branch-scoped roles)
    for (const assignment of validAssignments) {
      const isAccountWide = isAccountWideRole(assignment.role_uuid);
      if (!isAccountWide && !assignment.branch_uuid) {
        setValidationError("Branch-specific roles must have a branch selected");
        return false;
      }
    }

    // Check for account-wide + branch-specific mix
    const hasAccountWide = validAssignments.some((a) =>
      isAccountWideRole(a.role_uuid)
    );

    const hasBranchSpecific = validAssignments.some(
      (a) => !isAccountWideRole(a.role_uuid) && a.branch_uuid
    );

    if (hasAccountWide && hasBranchSpecific) {
      setValidationError(
        "Cannot mix account-wide roles with branch-specific roles. User must have either account-wide OR branch-specific access."
      );
      return false;
    }

    // Check for duplicate branches
    const branchCounts = {};
    for (const assignment of validAssignments) {
      if (assignment.branch_uuid) {
        branchCounts[assignment.branch_uuid] =
          (branchCounts[assignment.branch_uuid] || 0) + 1;

        if (branchCounts[assignment.branch_uuid] > 1) {
          const branchName =
            branchesList?.find((b) => b.branch_uuid === assignment.branch_uuid)
              ?.branch_name || "Unknown";
          setValidationError(
            `Cannot assign multiple roles to branch "${branchName}". Each branch can only have one role.`
          );
          return false;
        }
      }
    }

    // Check for duplicate role+branch combinations
    const seen = new Set();
    for (const assignment of validAssignments) {
      const key = `${assignment.role_uuid}:${
        assignment.branch_uuid || "account"
      }`;
      if (seen.has(key)) {
        setValidationError("Duplicate role assignment detected");
        return false;
      }
      seen.add(key);
    }

    return true;
  };

  // 🎯 Add role assignment row
  const addRoleAssignment = () => {
    setRoleAssignments([
      ...roleAssignments,
      { role_uuid: "", branch_uuid: "" },
    ]);
  };

  // 🎯 Remove role assignment row
  const removeRoleAssignment = (index) => {
    const newAssignments = roleAssignments.filter((_, i) => i !== index);
    setRoleAssignments(newAssignments);
    validateRoleAssignments(newAssignments);
  };

  // 🎯 Update role assignment
  const updateRoleAssignment = (index, field, value) => {
    const newAssignments = [...roleAssignments];
    newAssignments[index] = {
      ...newAssignments[index],
      [field]: value,
    };

    // If changing to account-wide role, clear branch
    if (field === "role_uuid") {
      const isAccountWide = isAccountWideRole(value);
      if (isAccountWide) {
        newAssignments[index].branch_uuid = null;
      }
    }

    setRoleAssignments(newAssignments);
    validateRoleAssignments(newAssignments);
  };

  // 🔍 Helper: Get role details
  const getRoleDetails = (roleUuid) => {
    return roles.find((r) => r.role_uuid === roleUuid);
  };

  // 🔍 Helper: Get assigned branches (to disable in dropdown)
  const getAssignedBranches = () => {
    return new Set(
      roleAssignments
        .filter((a) => a.branch_uuid && a.role_uuid)
        .map((a) => a.branch_uuid)
    );
  };

  // 🧠 Submit handler
  const onSubmit = async (values) => {
    // Validate role assignments before submission
    const validAssignments = roleAssignments.filter((a) => a.role_uuid);

    if (!validateRoleAssignments(roleAssignments)) {
      toast.error("Please fix role assignment errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        user_name: values.user_name,
        user_email: values.user_email,
        user_country_code: values.user_country_code || null,
        user_phone: values.user_phone || null,
        role_assignments: validAssignments,
      };

      // Only include password in add mode (backend doesn't support password update)
      if (mode === "add" && values.password) {
        payload.password = values.password;
      }

      const body = encryption(payload);

      if (mode === "edit") {
        await ControlsApi.updateTenantUser(userUuid, payload);
        toast.success("User updated successfully");
      } else {
        await ControlsApi.createTenantUser(tentDetails?.tenant_uuid, payload);
        toast.success("User created successfully");
      }

      router.push("/controls/users");
    } catch (error) {
      console.error(error);
      const err = decryption(error, "error");

      // Handle specific error messages
      let errorMessage = err?.message || "Failed to save user";

      // Replace "tenant" with "Account" in error messages
      errorMessage = errorMessage.replace(/tenant/gi, "Account");

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            ? "Update user details and role assignments."
            : "Add a new user with role assignments and secure credentials."}
        </p>
      </div>

      {/* 🧾 Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* User Details Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                User Details
              </CardTitle>
              <CardDescription>
                Fill in basic user information below
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive ml-1">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Email <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          disabled={mode === "edit"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country Code */}
                {/* <FormField
                  control={form.control}
                  name="user_country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code</FormLabel>
                      <FormControl>
                        <Input placeholder="+1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Phone */}
                {/* <FormField
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
                /> */}
                {/* Mobile Number Field - now fully integrated with form */}
                <FormField
                  control={form.control}
                  name="user_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile Number{" "}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <MobileNumberField
                        value={field.value}
                        countryCode={form.watch("user_country_code")}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Trigger validation
                          form.trigger("user_phone");
                        }}
                        onCountryChange={(code) => {
                          form.setValue("user_country_code", code);
                          // Re-validate phone with new country
                          if (field.value) {
                            form.trigger("user_phone");
                          }
                        }}
                        // label="Mobile Number"
                        placeholder="Enter mobile number"
                        error={
                          form.formState.errors.user_phone?.message ||
                          form.formState.errors.user_country_code?.message
                        }
                        required={true}
                        disabled={false}
                        className="w-full"
                      />
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Fields - Only in Add Mode */}
              {mode === "add" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password{" "}
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Confirm Password{" "}
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
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

              {/* Info for Edit Mode */}
              {/* {mode === "edit" && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Password cannot be changed through this form. Users can
                    reset their password through the password reset flow.
                  </AlertDescription>
                </Alert>
              )} */}
            </CardContent>
          </Card>

          {/* Role Assignments Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Role Assignments
              </CardTitle>
              <CardDescription>
                Assign roles to this user. Each branch can only have one role
                assigned.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Validation Error Alert */}
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {/* Role Assignment Rows */}
              <div className="space-y-3">
                {roleAssignments.map((assignment, index) => {
                  const selectedRole = getRoleDetails(assignment.role_uuid);
                  const isAccountWide = selectedRole
                    ? isAccountWideRole(assignment.role_uuid)
                    : false;
                  const assignedBranches = getAssignedBranches();

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 border rounded-lg bg-card"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Role Selection */}
                        <div className="space-y-2">
                          <FormLabel>
                            Role{" "}
                            <span className="text-destructive ml-1">*</span>
                            {/* {selectedRole && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {selectedRole.role_type}
                              </Badge>
                            )} */}
                          </FormLabel>
                          <Select
                            value={assignment.role_uuid}
                            onValueChange={(value) =>
                              updateRoleAssignment(index, "role_uuid", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles
                                .filter((role) => role.is_active)
                                .map((role) => (
                                  <SelectItem
                                    key={role.role_uuid}
                                    value={role.role_uuid}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>{role.role_name}</span>
                                      {/* <Badge
                                        variant="outline"
                                        className="ml-2 text-xs"
                                      >
                                        {role.role_type}
                                      </Badge> */}
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Branch Selection */}
                        <div className="space-y-2">
                          <FormLabel>
                            Branch
                            {isAccountWide && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (All branches)
                              </span>
                            )}
                            {!isAccountWide && assignment.role_uuid && (
                              <span className="text-destructive ml-1">*</span>
                            )}
                          </FormLabel>
                          <Select
                            value={assignment.branch_uuid || ""}
                            onValueChange={(value) =>
                              updateRoleAssignment(index, "branch_uuid", value)
                            }
                            disabled={isAccountWide || !assignment.role_uuid}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isAccountWide
                                    ? "Account-wide access"
                                    : "Select branch"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {!isAccountWide &&
                                branchesList?.map((branch) => {
                                  const isAssigned =
                                    assignedBranches.has(branch.branch_uuid) &&
                                    assignment.branch_uuid !==
                                      branch.branch_uuid;

                                  return (
                                    <SelectItem
                                      key={branch.branch_uuid}
                                      value={branch.branch_uuid}
                                      disabled={isAssigned}
                                    >
                                      {branch.branch_name}
                                      {isAssigned && (
                                        <span className="text-xs text-muted-foreground ml-2">
                                          (already assigned)
                                        </span>
                                      )}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {roleAssignments.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoleAssignment(index)}
                          className="mt-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Role Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addRoleAssignment}
                className="w-full gap-2"
                disabled={
                  roleAssignments.length > 0 &&
                  !roleAssignments.every((a) => a.role_uuid)
                }
              >
                <Plus className="h-4 w-4" />
                Add Another Role
              </Button>

              {roleAssignments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No role assignments. Click &quot;Add Another Role&quot; to
                  begin.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="gap-2"
              disabled={isSubmitting || !!validationError}
            >
              <Save className="h-4 w-4" />
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddUser;
