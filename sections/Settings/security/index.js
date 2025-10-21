import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Key,
  Smartphone,
  User,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "@/services/settings/profile/api";
import { decryption, encryption } from "@/lib/encryption";

function ProfileCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="absolute -bottom-2 -right-2">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
          <div className="w-full pt-4">
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileFormSkeleton() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// Form validation schemas (Zod-like)
const profileSchema = {
  validate: (data) => {
    const errors = {};

    if (!data.user_name?.trim()) {
      errors.user_name = "Name is required";
    } else if (data.user_name.trim().length < 2) {
      errors.user_name = "Name must be at least 2 characters";
    }

    if (!data.user_email?.trim()) {
      errors.user_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
      errors.user_email = "Please enter a valid email address";
    }

    if (data.user_phone && !/^\+?[\d\s\-\(\)]+$/.test(data.user_phone)) {
      errors.user_phone = "Please enter a valid contact number";
    }

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  },
};

const passwordSchema = {
  validate: (data) => {
    const errors = {};

    if (!data.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!data.newPassword) {
      errors.newPassword = "New password is required";
    } else if (data.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return {
      success: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// React Hook Form-like custom hook
const useForm = (defaultValues = {}, schema = null) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const setValue = (user_name, value) => {
    setValues((prev) => ({ ...prev, [user_name]: value }));

    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [user_name]: true }));

    // Clear error when user starts typing
    if (errors[user_name]) {
      setErrors((prev) => ({ ...prev, [user_name]: undefined }));
    }
  };

  const setError = (user_name, error) => {
    setErrors((prev) => ({ ...prev, [user_name]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const reset = (newValues = defaultValues) => {
    setValues(newValues);
    setErrors({});
    setTouchedFields({});
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e?.preventDefault?.();

    if (schema) {
      const validation = schema.validate(values);
      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = (user_name) => ({
    user_name,
    value: values[user_name] || "",
    onChange: (e) => setValue(user_name, e.target.value),
    onBlur: () => setTouchedFields((prev) => ({ ...prev, [user_name]: true })),
  });

  return {
    values,
    errors,
    isSubmitting,
    touchedFields,
    setIsSubmitting,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit,
    register,
  };
};

function ProfileCard({ profile, onAvatarChange, isLoading }) {
  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const getInitials = (user_name) => {
    return user_name
      ? user_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "??";
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onAvatarChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback className="text-xl md:text-2xl">
                {getInitials(profile?.user_name)}
              </AvatarFallback>
            </Avatar>
            <Label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </div>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{profile?.user_name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{profile?.user_email}</span>
            </div>
            {profile?.user_phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile.user_phone}</span>
              </div>
            )}
          </div>

          <div className="w-full pt-4">
            <p className="text-xs text-muted-foreground">
              Click the camera icon to update your profile picture
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileEditForm({ profile, onUpdateProfile, isLoading }) {
  const form = useForm(
    {
      user_name: "",
      user_email: "",
      user_phone: "",
    },
    profileSchema
  );

  const [message, setMessage] = useState(null);

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        user_name: profile.user_name || "",
        user_email: profile.user_email || "",
        user_phone: profile.user_phone || "",
      });
    }
  }, [profile]);

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      const body = encryption(data);
      await updateProfile({ data: body }, profile?.user_uuid);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      onUpdateProfile({ ...profile, ...data });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Edit Profile
        </CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register("user_name")}
                className={form.errors.user_name ? "border-red-500" : ""}
                placeholder="Enter your full name"
              />
              {form.errors.user_name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.errors.user_name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("user_email")}
                className={form.errors.user_email ? "border-red-500" : ""}
                placeholder="Enter your email address"
              />
              {form.errors.user_email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.errors.user_email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="user_phone">Contact Number</Label>
              <Input
                id="user_phone"
                {...form.register("user_phone")}
                className={form.errors.user_phone ? "border-red-500" : ""}
                placeholder="Enter your contact number"
              />
              {form.errors.user_phone && (
                <p className="text-sm text-red-500 mt-1">
                  {form.errors.user_phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset({
                  user_name: profile?.user_name || "",
                  user_email: profile?.user_email || "",
                  user_phone: profile?.user_phone || "",
                });
                setMessage(null);
              }}
              disabled={form.isSubmitting}
            >
              Reset
            </Button>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={form.isSubmitting}
            >
              {form.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileForm({ profile, onUpdateProfile, isLoading }) {
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleAvatarChange = (newAvatar) => {
    const updatedProfile = { ...currentProfile, avatar: newAvatar };
    setCurrentProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ProfileCard
          profile={currentProfile}
          onAvatarChange={handleAvatarChange}
          isLoading={isLoading}
        />
      </div>
      <div className="lg:col-span-2">
        <ProfileEditForm
          profile={currentProfile}
          onUpdateProfile={onUpdateProfile}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function PasswordForm() {
  const form = useForm(
    {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    passwordSchema
  );

  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      console.log("data", data);
      const body = encryption(data);
      await changePassword({ data: body });
      setMessage({ type: "success", text: "Password changed successfully!" });
      form.reset();
    } catch (error) {
      console.log("error", error?.response?.data);
      const decError = decryption(error?.response?.data?.data);
      setMessage({
        type: "error",
        text: decError.message || "Failed to change password",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your account password for better security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {message && (
            <Alert
              className={
                message.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription
                className={
                  message.type === "error" ? "text-red-700" : "text-green-700"
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="current-password">Current Password *</Label>
            <Input
              id="current-password"
              type="password"
              {...form.register("currentPassword")}
              className={form.errors.currentPassword ? "border-red-500" : ""}
              placeholder="Enter current password"
            />
            {form.errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="new-password">New Password *</Label>
            <Input
              id="new-password"
              type="password"
              {...form.register("newPassword")}
              className={form.errors.newPassword ? "border-red-500" : ""}
              placeholder="Enter new password"
            />
            {form.errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.errors.newPassword}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password *</Label>
            <Input
              id="confirm-password"
              type="password"
              {...form.register("confirmPassword")}
              className={form.errors.confirmPassword ? "border-red-500" : ""}
              placeholder="Confirm new password"
            />
            {form.errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
              }}
              disabled={form.isSubmitting}
            >
              Clear
            </Button>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={form.isSubmitting}
            >
              {form.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    smsAuth: false,
    authenticatorApp: true,
    loginNotifications: true,
    sessionTimeout: true,
    dataEncryption: true,
  });

  const handleSettingChange = (setting, value) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Require a verification code in addition to your password
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactor}
              onCheckedChange={(checked) =>
                handleSettingChange("twoFactor", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Receive codes via text message
              </p>
            </div>
            <Switch
              checked={securitySettings.smsAuth}
              onCheckedChange={(checked) =>
                handleSettingChange("smsAuth", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Authenticator App</Label>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator
              </p>
            </div>
            <Switch
              checked={securitySettings.authenticatorApp}
              onCheckedChange={(checked) =>
                handleSettingChange("authenticatorApp", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Preferences
          </CardTitle>
          <CardDescription>
            Configure additional security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("loginNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <Switch
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) =>
                handleSettingChange("sessionTimeout", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Encryption</Label>
              <p className="text-sm text-muted-foreground">
                Enable AES-256 encryption for all data
              </p>
            </div>
            <Switch
              checked={securitySettings.dataEncryption}
              onCheckedChange={(checked) =>
                handleSettingChange("dataEncryption", checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { user: profile, setUser: setProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!profile?.user_uuid) return;
        const profileData = await getProfile(profile?.user_uuid);
        const data = decryption(profileData?.data?.data);
        console.log("profileData", data);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profile?.user_uuid, setProfile]);

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and security preferences
        </p>
      </div>

      {/* Profile Section */}
      <section>
        <ProfileForm
          profile={profile}
          onUpdateProfile={setProfile}
          isLoading={isLoading}
        />
      </section>

      {/* Password Section */}
      <section>
        <PasswordForm />
      </section>

      {/* Security Section */}
      <section>
        <SecuritySettings />
      </section>
    </div>
  );
}
