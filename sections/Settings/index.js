"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ConfigurationSettings from "./configuration";
import SecuritySettings from "./security";
import { GeneralSettings } from "./general";
import { ThemeSettings } from "./themes";
import { Separator } from "@/components/ui/separator";

export function SettingsTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "general";

  const handleTabChange = (value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", value);
    router.replace(`?${current.toString()}`);
  };

  return (
    <Tabs
      value={tabParam}
      onValueChange={handleTabChange}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger className="px-5" value="general">
          General
        </TabsTrigger>
        <TabsTrigger className="px-5" value="profile">
          Profile
        </TabsTrigger>
        <TabsTrigger className="px-5" value="theme">
          Theme
        </TabsTrigger>
        <TabsTrigger className="px-5" value="configuration">
          Configuration
        </TabsTrigger>
      </TabsList>

      <Separator className="my-4" />

      <TabsContent value="general">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="profile">
        <SecuritySettings />
      </TabsContent>

      <TabsContent value="theme">
        <ThemeSettings />
      </TabsContent>

      <TabsContent value="configuration">
        {/* <ConfigurationSettings /> */}
      </TabsContent>
    </Tabs>
  );
}
