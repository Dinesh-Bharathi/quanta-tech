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

const iconMap = {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  Shield,
  Palette,
  MonitorCog,
  BookUser,
};

export const getIconComponent = (iconName) => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};
