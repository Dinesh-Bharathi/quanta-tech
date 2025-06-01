import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeCustomizationProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Loading from "./loading";

export const metadata = {
  title: "Quanta Dashboard",
  description: "Multi-tenant SaaS dashboard application",
  generator: "v0.dev",
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
