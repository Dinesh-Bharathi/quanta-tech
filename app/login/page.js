import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        {/* Form Section */}
        <div className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center md:text-left">
              Sign in
            </CardTitle>
            <CardDescription className="text-center md:text-left">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </div>

        {/* Side Image for md+ only */}
        <div className="hidden md:block relative bg-muted">
          <Image
            src="/placeholder.svg"
            alt="Login Illustration"
            fill
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>
      </Card>
    </div>
  );
}
