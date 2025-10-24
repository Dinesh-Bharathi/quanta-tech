import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  Palette,
  MonitorCog,
  BookUser,
  SquareUser,
  ShieldHalf,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  ShieldHalf,
  Palette,
  MonitorCog,
  BookUser,
  SquareUser,
};

export const getIconComponent = (iconName) => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};
