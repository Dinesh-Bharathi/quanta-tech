import { SettingsTabs } from "@/components/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <SettingsTabs />
    </div>
  );
}
