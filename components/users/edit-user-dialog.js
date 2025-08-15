"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User, Mail, Phone, Shield, Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUpdateUser,
  roles,
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Create dynamic schema based on available roles
  const createFormSchema = () => {
    const roleNames = roles.map((role) => role.name);
    return z.object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
      email: z.string().email("Please enter a valid email address"),
      contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 characters")
        .regex(/^[+]?[0-9\s\-()]+$/, "Please enter a valid contact number"),
      role: z.enum(roleNames.length > 0 ? roleNames : ["Viewer"], {
        required_error: "Please select a role",
      }),
      roleUuid: z.string(),
    });
  };

  const form = useForm({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      role: roles.length > 0 ? roles[0].name : "Viewer",
      roleUuid: roles.length > 0 ? roles[0].tent_config_uuid : "", // Set default roleUuid
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role,
        roleUuid: user.roleUuid,
      });
    }
  }, [user, form, roles]);

  // Get role color dot
  const getRoleDotColor = (roleName) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    const index = roles.findIndex((role) => role.name === roleName);
    return colors[index % colors.length] || "bg-gray-500";
  };

  // Handle role change to update both role name and roleUuid
  const handleRoleChange = (selectedRoleName) => {
    const selectedRole = roles.find((role) => role.name === selectedRoleName);
    form.setValue("role", selectedRoleName);
    form.setValue("roleUuid", selectedRole?.tent_config_uuid || "");
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await onUpdateUser({
        ...user,
        ...data,
      });
      if (result.success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Edit className="h-5 w-5 text-orange-600" />
            </div>
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information and permissions. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={handleRoleChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem
                            key={role.tent_config_uuid}
                            value={role.name}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${getRoleDotColor(
                                  role.name
                                )}`}
                              ></div>
                              {role.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
