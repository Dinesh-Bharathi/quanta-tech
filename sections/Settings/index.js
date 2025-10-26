"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function SettingsTabs() {
  const router = useRouter();
  const pathname = usePathname();

  // Extract last part of path: /settings/general → "general"
  const activeTab = pathname.split("/").pop();

  const handleTabChange = (value) => {
    router.push(`/settings/${value}`);
  };

  return (
    <Tabs
      value={activeTab}
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
      </TabsList>

      <Separator className="my-4" />
    </Tabs>
  );
}
