import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MenuItemCard } from "../MenuItemCard";
import { CheckCircle2 } from "lucide-react";

const NavigationSection = ({
  navigationGroups,
  groupType,
  permissions,
  onMenuToggle,
  onPermissionToggle,
  onSelectAll,
  renderSubItems,
  openAccordions = [],
  setOpenAccordions,
}) => {
  // Check if any item in the group has enabled permissions with actual access
  const hasEnabledItems = (items) => {
    return items.some((item) => {
      const perms = permissions[item.url];
      // Check if item has enabled flag AND at least one permission is true
      const hasPerms =
        perms?.enabled &&
        (perms.read || perms.add || perms.update || perms.delete);
      if (hasPerms) return true;

      if (item.subItems && item.subItems.length > 0) {
        return hasEnabledItems(item.subItems);
      }
      return false;
    });
  };

  return (
    <Accordion
      type="multiple"
      className="w-full space-y-2"
      value={openAccordions}
      onValueChange={setOpenAccordions}
    >
      {navigationGroups.map((group, idx) => {
        const groupHasEnabled = hasEnabledItems(group.items);

        return (
          <AccordionItem
            key={`${groupType}-${idx}`}
            value={`${groupType}-${idx}`}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline hover:bg-muted/50 transition-colors">
              <span className="flex items-center gap-2">
                {groupHasEnabled ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                )}
                {group.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 bg-muted/20 space-y-3">
              {group.items.map((item) => (
                <MenuItemCard
                  key={item.url}
                  item={item}
                  permissions={permissions}
                  onMenuToggle={onMenuToggle}
                  onPermissionToggle={onPermissionToggle}
                  onSelectAll={onSelectAll}
                  renderSubItems={renderSubItems}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export { NavigationSection };
