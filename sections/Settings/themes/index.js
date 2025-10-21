"use client";
import { useTheme } from "next-themes";
import { useThemeCustomization } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  RefreshCw,
  Eye,
  Settings,
  Type,
  Zap,
  BarChart3,
  MessageSquare,
  Bell,
  User,
  Copy,
  Download,
  Paintbrush,
  BellRing,
  PanelsTopLeft,
  PanelLeft,
  PanelRight,
  Menu,
  ChevronLeft,
  ChevronRight,
  Layers,
  Smartphone,
  Tablet,
  Pin,
  PinOff,
  Layout,
  Settings2,
  Navigation,
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { themePresets } from "@/lib/theme-presets";
import { toast } from "sonner";
import { useState } from "react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const {
    selectedTheme,
    changeTheme,
    currentThemeConfig,
    layoutConfig,
    setLayoutConfig,
    resetToDefault,
  } = useThemeCustomization();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Theme Customization
          </h2>
          <p className="text-muted-foreground">
            Customize the appearance of your application with themes
          </p>
        </div>
        <Button variant="outline" onClick={resetToDefault}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
      </div>

      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          {/* Dark/Light Mode Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Theme Mode</CardTitle>
              <CardDescription>
                Choose between light, dark, or system preference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Color Themes</CardTitle>
              <CardDescription>
                Choose from available color themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 max-h-96 overflow-y-auto">
                {Object.entries(themePresets).map(([themeId, preset]) => (
                  <ThemeCard
                    key={themeId}
                    themeId={themeId}
                    preset={preset}
                    isSelected={selectedTheme === themeId}
                    onSelect={() => changeTheme(themeId)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layout Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PanelsTopLeft className="h-5 w-5" />
                Layout
              </CardTitle>
              <CardDescription>
                Configure the layout and structure of your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutSelection
                layoutConfig={layoutConfig}
                setLayoutConfig={setLayoutConfig}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your theme looks with real components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LivePreview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Theme Info */}
      <EnhancedCurrentConfiguration
        theme={theme}
        currentThemeConfig={currentThemeConfig}
        selectedTheme={selectedTheme}
      />
    </div>
  );
}

function ThemeCard({ themeId, preset, isSelected, onSelect }) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-md">
              {preset.name}
              {isSelected && <Star className="w-4 h-4 text-yellow-500" />}
            </h4>
            <p className="text-xs text-muted-foreground">
              {preset.description}
            </p>
          </div>
          {/* {isSelected && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )} */}
        </div>

        <Badge variant="outline" className="text-xs mb-3">
          {preset.category}
        </Badge>

        {/* Color Preview */}
        <div className="flex gap-1">
          <div
            className="w-5 h-5 rounded border"
            style={{ backgroundColor: `hsl(${preset.light.primary})` }}
            title="Primary"
          />
          <div
            className="w-5 h-5 rounded border"
            style={{ backgroundColor: `hsl(${preset.light.secondary})` }}
            title="Secondary"
          />
          <div
            className="w-5 h-5 rounded border"
            style={{ backgroundColor: `hsl(${preset.light.accent})` }}
            title="Accent"
          />
          <div
            className="w-5 h-5 rounded border"
            style={{ backgroundColor: `hsl(${preset.light.muted})` }}
            title="Muted"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedLivePreview() {
  return (
    <div className="space-y-6">
      {/* Main Dashboard Preview */}
      <div className="p-6 border rounded-lg bg-card space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Dashboard Preview</h3>
              <p className="text-sm text-muted-foreground">
                Live theme preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <User className="h-4 w-4 text-accent-foreground" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </div>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">$45,231</div>
            <div className="text-xs text-green-600">+12.5% from last month</div>
          </div>
          <div className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Active Users
              </div>
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">2,350</div>
            <div className="text-xs text-green-600">+5.2% from last week</div>
          </div>
          <div className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Messages
              </div>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-xs text-orange-600">-2.1% from yesterday</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <h4 className="font-medium">Progress Overview</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Project Completion</span>
                <span className="text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Team Performance</span>
                <span className="text-muted-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="space-y-3">
          <h4 className="font-medium">Button Variants</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Primary</Button>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="destructive" size="sm">
              Destructive
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-3">
          <h4 className="font-medium">Form Elements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Enter your name"
              className="px-3 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select className="px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Select option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-2" />
            <span className="text-sm">I agree to the terms and conditions</span>
          </div>
        </div>

        {/* Notification */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3">
          <Bell className="h-4 w-4 text-accent-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">New notification</div>
            <div className="text-xs text-muted-foreground">
              You have 3 unread messages
            </div>
          </div>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

function EnhancedCurrentConfiguration({
  theme,
  currentThemeConfig,
  selectedTheme,
}) {
  const copyThemeConfig = () => {
    if (currentThemeConfig) {
      navigator.clipboard.writeText(
        JSON.stringify(currentThemeConfig, null, 2)
      );
    }
  };

  const exportTheme = () => {
    if (currentThemeConfig) {
      const dataStr = JSON.stringify(
        { [selectedTheme]: currentThemeConfig },
        null,
        2
      );
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${selectedTheme}-theme.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  };

  const showSuccessToast = () => toast.success("Success! Operation completed.");
  const showErrorToast = () => toast.error("Error! Something went wrong.");
  const showInfoToast = () => toast.info("Info! Here's some information.");
  const showWarningToast = () => toast.warning("Warning! Be careful.");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Configuration
            </CardTitle>
            <CardDescription>
              Your active theme settings and properties
            </CardDescription>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyThemeConfig}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Config
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Theme Name</span>
            </div>
            <div className="text-lg font-semibold">
              {currentThemeConfig?.name || "Default"}
            </div>
            <Badge variant="secondary" className="w-fit">
              {currentThemeConfig?.category || "Professional"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Display Mode</span>
            </div>
            <div className="text-lg font-semibold capitalize">{theme}</div>
            <Badge variant="outline" className="w-fit">
              {theme === "system" ? "Auto" : theme} Mode
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Border Radius</span>
            </div>
            <div className="text-lg font-semibold">
              {currentThemeConfig?.radius || "0.5rem"}
            </div>
            <Badge variant="outline" className="w-fit">
              Rounded
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Font Family</span>
            </div>
            <div className="text-lg font-semibold truncate">
              {currentThemeConfig?.fonts?.["font-sans"]?.split(",")[0] ||
                "System"}
            </div>
            <Badge variant="outline" className="w-fit">
              Sans Serif
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Toast */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            Notifications
          </h4>

          <div className="flex flex-wrap gap-3">
            <Button variant="default" size="sm" onClick={showSuccessToast}>
              Show Success
            </Button>
            <Button variant="destructive" size="sm" onClick={showErrorToast}>
              Show Error
            </Button>
            <Button variant="outline" size="sm" onClick={showInfoToast}>
              Show Info
            </Button>
            <Button variant="secondary" size="sm" onClick={showWarningToast}>
              Show Warning
            </Button>
          </div>
        </div>

        <Separator />

        {/* Color Palette */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Color Palette
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentThemeConfig &&
              Object.entries(currentThemeConfig.light || {})
                .filter(
                  ([key]) =>
                    !key.includes("foreground") &&
                    !key.includes("sidebar") &&
                    !key.includes("chart")
                )
                .slice(0, 6)
                .map(([colorName, colorValue]) => (
                  <div key={colorName} className="space-y-2">
                    <div
                      className="w-full h-12 rounded-lg border shadow-sm"
                      style={{ backgroundColor: `hsl(${colorValue})` }}
                      title={`${colorName}: ${colorValue}`}
                    />
                    <div className="text-center">
                      <div className="text-xs font-medium capitalize">
                        {colorName.replace("-", " ")}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        hsl({colorValue})
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <Separator />

        {/* Typography Preview */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography Preview
          </h4>

          <div className="space-y-3 p-4 rounded-lg bg-muted/30">
            <div className="text-2xl font-bold">Heading 1</div>
            <div className="text-xl font-semibold text-muted-foreground">
              Heading 2
            </div>
            <div className="text-lg font-medium">Heading 3</div>
            <p className="text-base">
              This is regular body text that shows how your theme handles
              standard paragraph content.
            </p>
            <p className="text-sm text-muted-foreground">
              This is smaller text used for captions and secondary information.
            </p>
            <code className="text-sm bg-accent/20 px-2 py-1 rounded font-mono">
              {currentThemeConfig?.fonts?.["font-mono"]?.split(",")[0] ||
                "monospace"}
            </code>
          </div>
        </div>

        {/* Theme Description */}
        {currentThemeConfig?.description && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold">Theme Description</h4>
              <p className="text-muted-foreground">
                {currentThemeConfig.description}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LayoutSelection({ layoutConfig, setLayoutConfig }) {
  const updateLayoutConfig = (key, value) => {
    setLayoutConfig((prev) => ({ ...prev, [key]: value }));
  };

  const presets = [
    {
      id: "classic",
      name: "Classic Dashboard",
      description: "Traditional left sidebar with sticky header",
      icon: Layout,
      config: {
        stickyHeader: true,
        sidebarPosition: "left",
        sidebarBehavior: "collapsible",
        sidebarCollapsed: false,
        headerHeight: "default",
        footerVisible: true,
        contentMaxWidth: "full",
        spacing: "default",
      },
    },
    {
      id: "minimal",
      name: "Minimal Layout",
      description: "Clean layout with offcanvas sidebar",
      icon: Minus,
      config: {
        stickyHeader: true,
        sidebarPosition: "left",
        sidebarBehavior: "offcanvas",
        sidebarCollapsed: true,
        headerHeight: "compact",
        footerVisible: false,
        contentMaxWidth: "container",
        spacing: "compact",
      },
    },
    {
      id: "modern",
      name: "Modern App",
      description: "Contemporary layout with right sidebar",
      icon: Monitor,
      config: {
        stickyHeader: true,
        sidebarPosition: "right",
        sidebarBehavior: "collapsible",
        sidebarCollapsed: false,
        headerHeight: "large",
        footerVisible: true,
        contentMaxWidth: "container",
        spacing: "spacious",
      },
    },
    {
      id: "mobile-first",
      name: "Mobile First",
      description: "Optimized for mobile and tablet devices",
      icon: Smartphone,
      config: {
        stickyHeader: true,
        sidebarPosition: "left",
        sidebarBehavior: "offcanvas",
        sidebarCollapsed: true,
        headerHeight: "compact",
        footerVisible: false,
        contentMaxWidth: "full",
        spacing: "compact",
      },
    },
  ];

  const applyPreset = (preset) => {
    setLayoutConfig(preset.config);
  };

  return (
    <div className="space-y-6">
      {/* Layout Presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Presets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isActive =
              JSON.stringify(layoutConfig) === JSON.stringify(preset.config);

            return (
              <Card
                key={preset.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isActive ? "ring-2 ring-primary shadow-md" : ""
                }`}
                onClick={() => applyPreset(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{preset.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {preset.description}
                        </p>
                      </div>
                    </div>
                    {isActive && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {preset.config.sidebarPosition === "none"
                        ? "No Sidebar"
                        : `${preset.config.sidebarPosition} Sidebar`}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {preset.config.sidebarBehavior}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Header Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pin className="h-5 w-5" />
            Header Configuration
          </CardTitle>
          <CardDescription>
            Configure the main navigation header behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sticky-header" className="font-medium">
                Sticky Header
              </Label>
              <p className="text-sm text-muted-foreground">
                Keep header visible when scrolling
              </p>
            </div>
            <Switch
              id="sticky-header"
              checked={layoutConfig.stickyHeader}
              onCheckedChange={(checked) =>
                updateLayoutConfig("stickyHeader", checked)
              }
            />
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Header Height</Label>
            <RadioGroup
              value={layoutConfig.headerHeight}
              onValueChange={(value) =>
                updateLayoutConfig("headerHeight", value)
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="header-compact" />
                <Label htmlFor="header-compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="header-default" />
                <Label htmlFor="header-default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="header-large" />
                <Label htmlFor="header-large">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Sidebar Configuration
          </CardTitle>
          <CardDescription>
            Configure sidebar position and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sidebar Position */}
          <div className="space-y-3">
            <Label className="font-medium">Sidebar Position</Label>
            <RadioGroup
              value={layoutConfig.sidebarPosition}
              onValueChange={(value) =>
                updateLayoutConfig("sidebarPosition", value)
              }
              className="grid grid-cols-3 gap-4"
            >
              <div
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer"
                onClick={() => updateLayoutConfig("sidebarPosition", "left")}
              >
                <RadioGroupItem value="left" id="sidebar-left" />
                <PanelLeft className="h-4 w-4" />
                <Label htmlFor="sidebar-left">Left Sidebar</Label>
              </div>
              <div
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer"
                onClick={() => updateLayoutConfig("sidebarPosition", "right")}
              >
                <RadioGroupItem value="right" id="sidebar-right" />
                <PanelRight className="h-4 w-4" />
                <Label htmlFor="sidebar-right">Right Sidebar</Label>
              </div>
              {/* <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="none" id="sidebar-none" />
                <Layout className="h-4 w-4" />
                <Label htmlFor="sidebar-none">No Sidebar</Label>
              </div> */}
            </RadioGroup>
          </div>

          {/* Sidebar Behavior - Only show if sidebar is enabled */}
          {layoutConfig.sidebarPosition !== "none" && (
            <div className="space-y-3">
              <Label className="font-medium">Sidebar Behavior</Label>
              <RadioGroup
                value={layoutConfig.sidebarBehavior}
                onValueChange={(value) =>
                  updateLayoutConfig("sidebarBehavior", value)
                }
                className="space-y-3"
              >
                <div
                  className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() =>
                    updateLayoutConfig("sidebarBehavior", "static")
                  }
                >
                  <RadioGroupItem
                    value="static"
                    id="behavior-static"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="behavior-static" className="font-medium">
                      Static
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Always visible, takes up layout space
                    </p>
                  </div>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </div>

                <div
                  className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() =>
                    updateLayoutConfig("sidebarBehavior", "collapsible")
                  }
                >
                  <RadioGroupItem
                    value="collapsible"
                    id="behavior-collapsible"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="behavior-collapsible"
                      className="font-medium"
                    >
                      Collapsible
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Can be collapsed to icons only
                    </p>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </div>

                <div
                  className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() =>
                    updateLayoutConfig("sidebarBehavior", "offcanvas")
                  }
                >
                  <RadioGroupItem
                    value="offcanvas"
                    id="behavior-offcanvas"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="behavior-offcanvas" className="font-medium">
                      Off-canvas
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Slides in/out, overlays content
                    </p>
                  </div>
                  <Menu className="h-4 w-4 text-muted-foreground" />
                </div>

                <div
                  className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() =>
                    updateLayoutConfig("sidebarBehavior", "collapsibleCanvas")
                  }
                >
                  <RadioGroupItem
                    value="collapsibleCanvas"
                    id="behavior-collapsible-offcanvas"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="behavior-collapsible"
                      className="font-medium"
                    >
                      Collapsible with Off-canvas
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Can be collapsed to icons only
                    </p>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Sidebar Collapsed State - Only for collapsible */}
          {layoutConfig.sidebarBehavior === "collapsible" &&
            layoutConfig.sidebarPosition !== "none" && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sidebar-collapsed" className="font-medium">
                    Start Collapsed
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Begin with sidebar in collapsed state
                  </p>
                </div>
                <Switch
                  id="sidebar-collapsed"
                  checked={layoutConfig.sidebarCollapsed}
                  onCheckedChange={(checked) =>
                    updateLayoutConfig("sidebarCollapsed", checked)
                  }
                />
              </div>
            )}
        </CardContent>
      </Card>

      {/* Content & Spacing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Content & Spacing
          </CardTitle>
          <CardDescription>
            Configure content area and spacing options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Max Width */}
          <div className="space-y-3">
            <Label className="font-medium">Content Width</Label>
            <RadioGroup
              value={layoutConfig.contentMaxWidth}
              onValueChange={(value) =>
                updateLayoutConfig("contentMaxWidth", value)
              }
              className="grid grid-cols-3 gap-4"
            >
              <div
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer"
                onClick={() => updateLayoutConfig("contentMaxWidth", "full")}
              >
                <RadioGroupItem value="full" id="width-full" />
                <Label htmlFor="width-full">Full Width</Label>
              </div>
              <div
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer"
                onClick={() =>
                  updateLayoutConfig("contentMaxWidth", "container")
                }
              >
                <RadioGroupItem value="container" id="width-container" />
                <Label htmlFor="width-container">Container</Label>
              </div>
              <div
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer"
                onClick={() => updateLayoutConfig("contentMaxWidth", "narrow")}
              >
                <RadioGroupItem value="narrow" id="width-narrow" />
                <Label htmlFor="width-narrow">Narrow</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Spacing */}
          <div className="space-y-3">
            <Label className="font-medium">Overall Spacing</Label>
            <RadioGroup
              value={layoutConfig.spacing}
              onValueChange={(value) => updateLayoutConfig("spacing", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="spacing-compact" />
                <Label htmlFor="spacing-compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="spacing-default" />
                <Label htmlFor="spacing-default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spacious" id="spacing-spacious" />
                <Label htmlFor="spacing-spacious">Spacious</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Footer Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="footer-visible" className="font-medium">
                Show Footer
              </Label>
              <p className="text-sm text-muted-foreground">
                Display footer at the bottom of the page
              </p>
            </div>
            <Switch
              id="footer-visible"
              checked={layoutConfig.footerVisible}
              onCheckedChange={(checked) =>
                updateLayoutConfig("footerVisible", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Layout Preview */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Layout Preview
          </CardTitle>
          <CardDescription>
            Visual representation of your current layout configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LayoutPreview config={layoutConfig} />
        </CardContent>
      </Card> */}

      {/* Current Configuration Summary */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Header:</span>
              <span className="ml-2 text-muted-foreground">
                {layoutConfig.stickyHeader ? "Sticky" : "Static"} (
                {layoutConfig.headerHeight})
              </span>
            </div>
            <div>
              <span className="font-medium">Sidebar:</span>
              <span className="ml-2 text-muted-foreground">
                {layoutConfig.sidebarPosition === "none"
                  ? "None"
                  : `${layoutConfig.sidebarPosition} (${layoutConfig.sidebarBehavior})`}
              </span>
            </div>
            <div>
              <span className="font-medium">Content:</span>
              <span className="ml-2 text-muted-foreground">
                {layoutConfig.contentMaxWidth} width
              </span>
            </div>
            <div>
              <span className="font-medium">Spacing:</span>
              <span className="ml-2 text-muted-foreground">
                {layoutConfig.spacing}
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

function LayoutPreview({ config }) {
  const sidebarWidth =
    config.sidebarBehavior === "collapsible" && config.sidebarCollapsed
      ? "60px"
      : "240px";
  const headerHeight =
    config.headerHeight === "compact"
      ? "48px"
      : config.headerHeight === "large"
      ? "80px"
      : "64px";

  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden bg-background relative">
      {/* Header */}
      <div
        className={`w-full bg-primary/10 border-b flex items-center px-4 ${
          config.stickyHeader ? "relative" : ""
        }`}
        style={{ height: headerHeight }}
      >
        <div className="flex items-center gap-3">
          {config.sidebarPosition !== "none" &&
            config.sidebarBehavior === "offcanvas" && (
              <Menu className="h-4 w-4" />
            )}
          <div className="text-sm font-medium">Header</div>
          {config.stickyHeader && <Pin className="h-3 w-3 text-primary" />}
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {config.headerHeight}
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Sidebar */}
        {config.sidebarPosition === "left" &&
          config.sidebarBehavior !== "offcanvas" && (
            <div
              className="bg-accent/30 border-r flex flex-col"
              style={{ width: sidebarWidth }}
            >
              <div className="p-2 text-xs text-center border-b">
                {config.sidebarBehavior === "collapsible" &&
                config.sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 mx-auto" />
                ) : (
                  "Sidebar"
                )}
              </div>
              <div className="flex-1 p-2 space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-background/50 rounded"></div>
                ))}
              </div>
            </div>
          )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Content Area ({config.contentMaxWidth} width, {config.spacing}{" "}
              spacing)
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted/50 rounded"
                style={{
                  width: `${Math.random() * 40 + 60}%`,
                }}
              ></div>
            ))}
          </div>

          {/* Footer */}
          {config.footerVisible && (
            <div className="h-12 bg-muted/30 border-t flex items-center px-4">
              <div className="text-xs text-muted-foreground">Footer</div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {config.sidebarPosition === "right" &&
          config.sidebarBehavior !== "offcanvas" && (
            <div
              className="bg-accent/30 border-l flex flex-col"
              style={{ width: sidebarWidth }}
            >
              <div className="p-2 text-xs text-center border-b">
                {config.sidebarBehavior === "collapsible" &&
                config.sidebarCollapsed ? (
                  <ChevronLeft className="h-4 w-4 mx-auto" />
                ) : (
                  "Sidebar"
                )}
              </div>
              <div className="flex-1 p-2 space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-background/50 rounded"></div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Offcanvas Overlay Indicator */}
      {config.sidebarBehavior === "offcanvas" &&
        config.sidebarPosition !== "none" && (
          <div className="absolute top-2 left-2 text-xs bg-primary/20 px-2 py-1 rounded">
            Off-canvas {config.sidebarPosition}
          </div>
        )}
    </div>
  );
}

// Use the enhanced preview
function LivePreview() {
  return <EnhancedLivePreview />;
}
