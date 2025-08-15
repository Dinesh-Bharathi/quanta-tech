import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  Shield,
  Palette,
  MonitorCog,
  BookUser,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Clients",
        url: "/clients",
        icon: BookUser,
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
        subItems: [
          { title: "Products", url: "/inventory/products" },
          { title: "Categories", url: "/inventory/categories" },
          { title: "Warehouses", url: "/inventory/warehouses" },
          { title: "Stock Movements", url: "/inventory/movements" },
        ],
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Staffs",
        url: "/users",
        icon: Users,
      },
      {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
      },
    ],
  },
];

export const footerNavigation = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    subItems: [
      { title: "General", url: "/settings?tab=general", icon: Settings },
      { title: "Security", url: "/settings?tab=security", icon: Shield },
      { title: "Theme", url: "/settings?tab=theme", icon: Palette },
      {
        title: "Configuration",
        url: "/settings?tab=configuration",
        icon: MonitorCog,
      },
    ],
  },
];
