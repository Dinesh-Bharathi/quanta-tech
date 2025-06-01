import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeCustomizationProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Loading from "./loading";

export const metadata = {
  title: "QuantaBill - Product Billing & Inventory Management",
  description:
    "QuantaBill is a powerful SaaS solution for product billing and inventory management. Streamline your business operations with precision, real-time insights, and easy-to-use tools.",
  generator: "Quanta Tech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeCustomizationProvider>
            <AuthProvider>
              {children}
              {/* <Loading /> */}
              <Toaster
                toastOptions={{ className: "sonner-toast" }}
                position="top-right"
                richColors
                closeButton
              />
            </AuthProvider>
          </ThemeCustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
