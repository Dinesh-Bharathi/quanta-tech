"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { footerNavigation, mainNavigation } from "@/lib/navigation";

export function RoleModulesFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    tent_config_uuid: "",
    name: "",
    mainNavigation: {},
    footerNavigation: {},
  });

  useEffect(() => {
    if (role && open) {
      setFormData({
        tent_config_uuid: role.tent_config_uuid || "",
        name: role.name || "",
        mainNavigation: role.modules.mainNavigation || {},
        footerNavigation: role.modules.footerNavigation || {},
      });
    } else if (!role && open) {
      // Reset form when opening for new assignment
      setFormData({
        tent_config_uuid: "",
        name: "",
        mainNavigation: {},
        footerNavigation: {},
      });
    }
  }, [role, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMainNavigationChange = (url, checked) => {
    setFormData((prev) => ({
      ...prev,
      mainNavigation: {
        ...prev.mainNavigation,
        [url]: checked,
      },
    }));
  };

  const handleFooterNavigationChange = (url, checked) => {
    setFormData((prev) => ({
      ...prev,
      footerNavigation: {
        ...prev.footerNavigation,
        [url]: checked,
      },
    }));
  };

  const handleParentModuleChange = (
    parentUrl,
    subItems,
    checked,
    isMainNav = true
  ) => {
    const handler = isMainNav
      ? handleMainNavigationChange
      : handleFooterNavigationChange;

    // Handle parent
    handler(parentUrl, checked);

    // Handle all sub-items
    if (subItems) {
      subItems.forEach((subItem) => {
        handler(subItem.url, checked);
      });
    }
  };

  const isParentChecked = (parentUrl, subItems, navType) => {
    const navigation =
      navType === "main" ? formData.mainNavigation : formData.footerNavigation;
    const parentChecked = navigation[parentUrl] || false;

    if (!subItems) return parentChecked;

    const allSubChecked = subItems.every(
      (subItem) => navigation[subItem.url] || false
    );
    return parentChecked && allSubChecked;
  };

  const isParentIndeterminate = (parentUrl, subItems, navType) => {
    const navigation =
      navType === "main" ? formData.mainNavigation : formData.footerNavigation;
    const parentChecked = navigation[parentUrl] || false;

    if (!subItems) return false;

    const someSubChecked = subItems.some(
      (subItem) => navigation[subItem.url] || false
    );
    const allSubChecked = subItems.every(
      (subItem) => navigation[subItem.url] || false
    );

    return (
      (parentChecked && !allSubChecked) || (!parentChecked && someSubChecked)
    );
  };

  const selectAllModules = () => {
    const newMainNavigation = {};
    const newFooterNavigation = {};

    // Select all main navigation
    mainNavigation.forEach((section) => {
      section.items.forEach((item) => {
        newMainNavigation[item.url] = true;
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            newMainNavigation[subItem.url] = true;
          });
        }
      });
    });

    // Select all footer navigation
    footerNavigation.forEach((section) => {
      section.subItems.forEach((item) => {
        newFooterNavigation[item.url] = true;
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            newFooterNavigation[subItem.url] = true;
          });
        }
      });
    });

    setFormData((prev) => ({
      ...prev,
      mainNavigation: newMainNavigation,
      footerNavigation: newFooterNavigation,
    }));
  };

  const clearAllModules = () => {
    setFormData((prev) => ({
      ...prev,
      mainNavigation: {},
      footerNavigation: {},
    }));
  };

  const getSelectedCount = () => {
    const mainCount = Object.values(formData.mainNavigation).filter(
      Boolean
    ).length;
    const footerCount = Object.values(formData.footerNavigation).filter(
      Boolean
    ).length;
    return mainCount + footerCount;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Edit Modules for &quot;{formData.name}&quot;
          </DialogTitle>
          <DialogDescription>
            Select which application modules this role can access. Changes will
            be saved to the role configuration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Application Modules</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllModules}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllModules}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="secondary">
                {getSelectedCount()} modules selected
              </Badge>
            </div>

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-6">
                {/* Main Navigation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Main Navigation</h3>
                  {mainNavigation.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {section.title}
                      </h4>
                      <div className="space-y-2 ml-2">
                        {section.items.map((item) => (
                          <div key={item.url} className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id={`main-${item.url}`}
                                checked={
                                  item.subItems
                                    ? isParentChecked(
                                        item.url,
                                        item.subItems,
                                        "main"
                                      )
                                    : formData.mainNavigation[item.url] || false
                                }
                                onCheckedChange={(checked) => {
                                  if (item.subItems) {
                                    handleParentModuleChange(
                                      item.url,
                                      item.subItems,
                                      checked,
                                      true
                                    );
                                  } else {
                                    handleMainNavigationChange(
                                      item.url,
                                      checked
                                    );
                                  }
                                }}
                                className={
                                  item.subItems &&
                                  isParentIndeterminate(
                                    item.url,
                                    item.subItems,
                                    "main"
                                  )
                                    ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    : ""
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={`main-${item.url}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.title}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {item.url}
                                </p>
                              </div>
                            </div>

                            {item.subItems && (
                              <div className="ml-6 space-y-2">
                                {item.subItems.map((subItem) => (
                                  <div
                                    key={subItem.url}
                                    className="flex items-start space-x-2"
                                  >
                                    <Checkbox
                                      id={`main-${subItem.url}`}
                                      checked={
                                        formData.mainNavigation[subItem.url] ||
                                        false
                                      }
                                      onCheckedChange={(checked) =>
                                        handleMainNavigationChange(
                                          subItem.url,
                                          checked
                                        )
                                      }
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                      <Label
                                        htmlFor={`main-${subItem.url}`}
                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {subItem.title}
                                      </Label>
                                      <p className="text-xs text-muted-foreground">
                                        {subItem.url}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Footer Navigation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Footer Navigation</h3>
                  {footerNavigation.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {section.title}
                      </h4>
                      <div className="space-y-2 ml-2">
                        {section.subItems.map((item) => (
                          <div key={item.url} className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id={`footer-${item.url}`}
                                checked={
                                  item.subItems
                                    ? isParentChecked(
                                        item.url,
                                        item.subItems,
                                        "footer"
                                      )
                                    : formData.footerNavigation[item.url] ||
                                      false
                                }
                                onCheckedChange={(checked) => {
                                  if (item.subItems) {
                                    handleParentModuleChange(
                                      item.url,
                                      item.subItems,
                                      checked,
                                      false
                                    );
                                  } else {
                                    handleFooterNavigationChange(
                                      item.url,
                                      checked
                                    );
                                  }
                                }}
                                className={
                                  item.subItems &&
                                  isParentIndeterminate(
                                    item.url,
                                    item.subItems,
                                    "footer"
                                  )
                                    ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    : ""
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={`footer-${item.url}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.title}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {item.url}
                                </p>
                              </div>
                            </div>

                            {item.subItems && (
                              <div className="ml-6 space-y-2">
                                {item.subItems.map((subItem) => (
                                  <div
                                    key={subItem.url}
                                    className="flex items-start space-x-2"
                                  >
                                    <Checkbox
                                      id={`footer-${subItem.url}`}
                                      checked={
                                        formData.footerNavigation[
                                          subItem.url
                                        ] || false
                                      }
                                      onCheckedChange={(checked) =>
                                        handleFooterNavigationChange(
                                          subItem.url,
                                          checked
                                        )
                                      }
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                      <Label
                                        htmlFor={`footer-${subItem.url}`}
                                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {subItem.title}
                                      </Label>
                                      <p className="text-xs text-muted-foreground">
                                        {subItem.url}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Modules"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
