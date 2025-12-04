import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeCustomizationProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import ConfirmationPrompt from "@/components/ConfirmationPrompt";
import { LookupProvider } from "@/context/LookupContext";
import { NavigationProvider } from "@/context/NavigationContext";
import ReactQueryProvider from "@/components/ReactQueryProvider";
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
              <ReactQueryProvider>
                <NavigationProvider>
                  <LookupProvider>
                    <ConfirmationProvider>
                      {children}
                      {/* <Loading /> */}
                      <Toaster
                        toastOptions={{ className: "sonner-toast" }}
                        position="bottom-right"
                        duration={5000}
                        richColors
                        closeButton
                      />
                      <ConfirmationPrompt />
                    </ConfirmationProvider>
                  </LookupProvider>
                </NavigationProvider>
              </ReactQueryProvider>
            </AuthProvider>
          </ThemeCustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
