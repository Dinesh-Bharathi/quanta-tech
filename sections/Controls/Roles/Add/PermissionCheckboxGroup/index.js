import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Plus, Edit, Trash2 } from "lucide-react";

const permissionIcons = {
  read: Eye,
  add: Plus,
  update: Edit,
  delete: Trash2,
};

const PermissionCheckboxGroup = ({
  url,
  permissions,
  onToggle,
  getParentPermission,
}) => {
  const isReadEnabled = permissions?.read || false;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {["read", "add", "update", "delete"].map((perm) => {
        const Icon = permissionIcons[perm];

        // For non-read permissions, check both local read and parent permission
        let isDisabled = false;
        if (perm !== "read") {
          isDisabled = !isReadEnabled;
        }

        // Additionally check if parent has this permission
        if (getParentPermission) {
          const parentHasPermission = getParentPermission(url, perm);
          if (!parentHasPermission) {
            isDisabled = true;
          }
        }

        return (
          <div key={perm} className="flex items-center gap-2">
            <Checkbox
              checked={permissions[perm] || false}
              onCheckedChange={() => onToggle(url, perm)}
              id={`${url}-${perm}`}
              className="rounded"
              disabled={isDisabled}
            />
            <label
              htmlFor={`${url}-${perm}`}
              className={`flex items-center gap-1.5 text-sm flex-1 ${
                isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="capitalize">{perm}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export { PermissionCheckboxGroup };
