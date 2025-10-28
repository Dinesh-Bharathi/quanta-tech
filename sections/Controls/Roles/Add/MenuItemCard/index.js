"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PermissionCheckboxGroup } from "../PermissionCheckboxGroup";
import { PermissionBadge } from "../PermissionBadge";
import { useState, useEffect } from "react";

const MenuItemCard = ({
  item,
  level = 0,
  permissions,
  onMenuToggle,
  onPermissionToggle,
  onSelectAll,
  renderSubItems,
  getParentPermission,
}) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const itemPermissions = permissions[item.url] || {};

  // Item is truly enabled only if enabled flag is true AND has at least one permission
  const hasAnyPermission =
    itemPermissions.read ||
    itemPermissions.add ||
    itemPermissions.update ||
    itemPermissions.delete;
  const isEnabled = itemPermissions.enabled && hasAnyPermission;

  // Check if any subitems have actual permissions
  const hasEnabledSubItems = () => {
    if (!hasSubItems) return false;
    return item.subItems.some((subItem) => {
      const checkSubItem = (itm) => {
        const perms = permissions[itm.url];
        if (
          perms?.enabled &&
          (perms.read || perms.add || perms.update || perms.delete)
        ) {
          return true;
        }
        if (itm.subItems && itm.subItems.length > 0) {
          return itm.subItems.some(checkSubItem);
        }
        return false;
      };
      return checkSubItem(subItem);
    });
  };

  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand if this item or any subitem is enabled
  useEffect(() => {
    if (isEnabled || hasEnabledSubItems()) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isEnabled, permissions]);

  // Checkbox should show checked only if item has actual permissions
  const shouldBeChecked = isEnabled || hasEnabledSubItems();

  const getPermissionStatus = () => {
    const perms = [
      itemPermissions.read,
      itemPermissions.add,
      itemPermissions.update,
      itemPermissions.delete,
    ];
    const enabledCount = perms.filter(Boolean).length;
    if (enabledCount === 4) return "all";
    if (enabledCount > 0) return "partial";
    return "none";
  };

  return (
    <div className={level > 0 ? "ml-4 sm:ml-6" : ""}>
      <div
        className={`rounded-lg border transition-all ${
          shouldBeChecked
            ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
            : "border-border bg-card hover:border-border/80"
        }`}
      >
        {/* Menu Header */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                checked={shouldBeChecked}
                onCheckedChange={() =>
                  onMenuToggle(item.url, hasSubItems, item.subItems)
                }
                id={`menu-${item.url}`}
                className="rounded"
              />
              <label
                htmlFor={`menu-${item.url}`}
                className="text-sm font-semibold leading-none cursor-pointer flex items-center gap-2 flex-1"
              >
                <span className="truncate">{item.title}</span>
              </label>
            </div>

            {isEnabled && (
              <div className="flex items-center gap-2">
                <PermissionBadge status={getPermissionStatus()} />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectAll(item.url, item.subItems)}
                  className="text-xs whitespace-nowrap"
                >
                  {itemPermissions.read &&
                  itemPermissions.add &&
                  itemPermissions.update &&
                  itemPermissions.delete
                    ? "Clear"
                    : "All"}
                </Button>
              </div>
            )}

            {hasSubItems && (
              <ChevronDown
                className={`h-4 w-4 transition-transform cursor-pointer ${
                  isExpanded ? "rotate-180" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              />
            )}
          </div>

          {/* Permissions Grid - only show if directly enabled and has permissions */}
          {isEnabled && (
            <div className="pt-3 border-t border-border/50">
              <PermissionCheckboxGroup
                url={item.url}
                permissions={itemPermissions}
                onToggle={onPermissionToggle}
                getParentPermission={getParentPermission}
              />
            </div>
          )}
        </div>

        {/* Render SubItems */}
        {hasSubItems && isExpanded && (
          <div className="border-t border-border/50 bg-muted/30 p-4 space-y-3">
            {item.subItems.map((subItem) => renderSubItems(subItem, level + 1))}
          </div>
        )}
      </div>
    </div>
  );
};

export { MenuItemCard };
