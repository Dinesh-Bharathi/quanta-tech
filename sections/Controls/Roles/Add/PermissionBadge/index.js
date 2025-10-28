import { Check, X, Minus } from "lucide-react";

const PermissionBadge = ({ status }) => {
  const variants = {
    all: {
      bg: "bg-emerald-50 dark:bg-emerald-950",
      text: "text-emerald-700 dark:text-emerald-300",
      icon: Check,
      label: "All",
    },
    partial: {
      bg: "bg-amber-50 dark:bg-amber-950",
      text: "text-amber-700 dark:text-amber-300",
      icon: Minus,
      label: "Partial",
    },
    none: {
      bg: "bg-slate-50 dark:bg-slate-900",
      text: "text-slate-600 dark:text-slate-400",
      icon: X,
      label: "None",
    },
  };

  const variant = variants[status] || variants.none;
  const Icon = variant.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variant.bg} ${variant.text}`}
    >
      <Icon className="w-3 h-3" />
      {variant.label}
    </div>
  );
};

export { PermissionBadge };
