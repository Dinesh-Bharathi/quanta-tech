"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as z from "zod";
import { RoleFormHeader } from "./RoleFormHeader";
import { NavigationSection } from "./NavigationSection";
import { MenuItemCard } from "./MenuItemCard";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ControlsApi from "@/services/controls/api";
import { decryption, encryption } from "@/lib/encryption";
import { toast } from "sonner";
import Loading from "@/app/(dashboard)/loading";

const roleScopeOptions = [
  { label: "Global", value: "tenant" },
  { label: "One Branch", value: "branch" },
  { label: "Multi Branch", value: "multi-branch" },
];

const RolesAdd = ({ mode = "add", roleUuid }) => {
  const { user, tentDetails, branchesList } = useAuth();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(mode === "edit");
  const [roleData, setRoleData] = useState({});
  const [mainNavigation, setMainNavigation] = useState([]);
  const [footerNavigation, setFooterNavigation] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [menuPermissions, setMenuPermissions] = useState({});
  const [openAccordions, setOpenAccordions] = useState([]);

  useEffect(() => {
    const fetchSubscribedMenus = async () => {
      setLoadingMenus(true);
      try {
        const response = await ControlsApi.tenantSubscribedMenus(
          tentDetails?.tent_uuid
        );
        const decryptRes = decryption(response.data.data);
        const data = decryptRes.data || {
          mainNavigation: [],
          footerNavigation: [],
        };
        setMainNavigation(data.mainNavigation);
        setFooterNavigation(data.footerNavigation);
      } catch (err) {
        console.error("Fetch subscribed menus:", err);
      } finally {
        setLoadingMenus(false);
      }
    };

    if (tentDetails?.tent_uuid) {
      fetchSubscribedMenus();
    }
  }, [tentDetails?.tent_uuid]);

  useEffect(() => {
    const fetchEditRolesData = async () => {
      setLoadingData(true);
      try {
        const response = await ControlsApi.getTenantRoleByUuid(roleUuid);
        const decryptRes = decryption(response.data.data);
        const data = decryptRes.data;
        setRoleData(data);
      } catch (err) {
        console.error("Fetch subscribed menus:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (mode === "edit") {
      fetchEditRolesData();
    }
  }, [mode, roleUuid]);

  const createFormSchema = () => {
    return z.object({
      roleName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters"),
      description: z
        .string()
        .min(2, "Description must be at least 2 characters")
        .max(500, "Description must be less than 500 characters"),
      scope: z.enum(["tenant", "branch", "multi-branch"], {
        required_error: "Scope is required",
      }),
      branch_uuid: z.array(z.string()).default([]),
    });
  };

  const form = useForm({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      roleName: "",
      description: "",
      scope: "tenant",
      branch_uuid: [],
    },
  });

  // Update form values when roleData is available
  useEffect(() => {
    if (mode === "edit" && roleData) {
      form.reset({
        roleName: roleData.roleName || "",
        description: roleData.description || "",
        scope: roleData.scope || "tenant",
        branch_uuid: roleData.branch_uuid || [],
      });
    }
  }, [mode, roleData, form]);

  // Helper to check if item has any actual permissions
  const hasAnyPermission = (perms) => {
    return perms?.read || perms?.add || perms?.update || perms?.delete;
  };

  // Initialize permissions and determine which accordions should be open
  useEffect(() => {
    if (loadingMenus) return;

    const initPermissions = {};
    const processItems = (items) => {
      items.forEach((item) => {
        initPermissions[item.url] = {
          enabled: false,
          read: false,
          add: false,
          update: false,
          delete: false,
        };
        if (item.subItems && item.subItems.length > 0) {
          processItems(item.subItems);
        }
      });
    };

    mainNavigation.forEach((group) => processItems(group.items));
    footerNavigation.forEach((group) => processItems(group.items));

    // If in edit mode and we have existing permissions, merge them
    if (mode === "edit" && roleData?.permissions) {
      const existingPermissions = roleData.permissions;
      Object.keys(existingPermissions).forEach((key) => {
        if (initPermissions[key]) {
          initPermissions[key] = { ...existingPermissions[key] };
        }
      });

      // Determine which accordions should be open based on enabled permissions
      const accordionsToOpen = [];

      const checkGroupForEnabledItems = (group, groupType, groupIndex) => {
        const hasEnabledItems = group.items.some((item) => {
          const checkItem = (itm) => {
            const perms = existingPermissions[itm.url];
            if (perms?.enabled && hasAnyPermission(perms)) return true;
            if (itm.subItems && itm.subItems.length > 0) {
              return itm.subItems.some(checkItem);
            }
            return false;
          };
          return checkItem(item);
        });

        if (hasEnabledItems) {
          accordionsToOpen.push(`${groupType}-${groupIndex}`);
        }
      };

      mainNavigation.forEach((group, idx) =>
        checkGroupForEnabledItems(group, "main", idx)
      );
      footerNavigation.forEach((group, idx) =>
        checkGroupForEnabledItems(group, "footer", idx)
      );

      setOpenAccordions(accordionsToOpen);
    }

    setMenuPermissions(initPermissions);
  }, [mainNavigation, footerNavigation, loadingMenus, mode, roleData]);

  // Find parent item by child URL
  const findParentByChildUrl = (childUrl) => {
    const searchInItems = (items, parent = null) => {
      for (const item of items) {
        if (item.url === childUrl) return parent;
        if (item.subItems && item.subItems.length > 0) {
          const found = searchInItems(item.subItems, item);
          if (found !== null) return found;
        }
      }
      return null;
    };

    for (const group of [...mainNavigation, ...footerNavigation]) {
      const found = searchInItems(group.items);
      if (found !== null) return found;
    }
    return null;
  };

  // Get parent permission for a given URL
  const getParentPermission = (url, permission) => {
    const parent = findParentByChildUrl(url);
    if (!parent) return true; // No parent means allowed
    return menuPermissions[parent.url]?.[permission] || false;
  };

  // Cascading permissions: when toggling menu, handle all children
  const handleMenuToggle = (url, hasSubItems, subItems = []) => {
    setMenuPermissions((prev) => {
      const newState = { ...prev };
      const currentEnabled = !prev[url]?.enabled;

      // Get parent permissions to determine what this item can have
      const parent = findParentByChildUrl(url);
      const parentPerms = parent ? prev[parent.url] : null;

      if (currentEnabled) {
        // When enabling, respect parent permissions
        const canHaveRead = !parentPerms || parentPerms.read;
        const canHaveAdd = !parentPerms || parentPerms.add;
        const canHaveUpdate = !parentPerms || parentPerms.update;
        const canHaveDelete = !parentPerms || parentPerms.delete;

        newState[url] = {
          enabled: true,
          read: canHaveRead,
          add: canHaveAdd,
          update: canHaveUpdate,
          delete: canHaveDelete,
        };
      } else {
        // When disabling, clear all
        newState[url] = {
          enabled: false,
          read: false,
          add: false,
          update: false,
          delete: false,
        };
      }

      // Recursively update all children
      const updateChildren = (items, parentUrl) => {
        items.forEach((subItem) => {
          const parentPerm = newState[parentUrl];

          if (currentEnabled && parentPerm) {
            // Enable children only with permissions parent has
            newState[subItem.url] = {
              enabled: true,
              read: parentPerm.read,
              add: parentPerm.add,
              update: parentPerm.update,
              delete: parentPerm.delete,
            };
          } else {
            // Disable children
            newState[subItem.url] = {
              enabled: false,
              read: false,
              add: false,
              update: false,
              delete: false,
            };
          }

          if (subItem.subItems && subItem.subItems.length > 0) {
            updateChildren(subItem.subItems, subItem.url);
          }
        });
      };

      if (hasSubItems && subItems.length > 0) {
        updateChildren(subItems, url);
      }

      // Update parent if all siblings are now unchecked
      return updateParentState(newState, url);
    });
  };

  // Update parent based on children state
  const updateParentState = (state, changedUrl) => {
    const parent = findParentByChildUrl(changedUrl);

    if (parent) {
      const allChildrenDisabled = parent.subItems.every(
        (sub) => !state[sub.url]?.enabled || !hasAnyPermission(state[sub.url])
      );

      if (allChildrenDisabled) {
        state[parent.url] = {
          ...state[parent.url],
          enabled: false,
          read: false,
          add: false,
          update: false,
          delete: false,
        };
        // Recursively update grandparents
        return updateParentState(state, parent.url);
      }
    }

    return state;
  };

  // Find item by URL in navigation
  const findItemByUrl = (url) => {
    const searchInItems = (items) => {
      for (const item of items) {
        if (item.url === url) return item;
        if (item.subItems && item.subItems.length > 0) {
          const found = searchInItems(item.subItems);
          if (found) return found;
        }
      }
      return null;
    };

    for (const group of [...mainNavigation, ...footerNavigation]) {
      const found = searchInItems(group.items);
      if (found) return found;
    }
    return null;
  };

  // Handle permission toggle with cascading logic
  const handlePermissionToggle = (url, permission) => {
    setMenuPermissions((prev) => {
      const newState = { ...prev };
      const currentValue = prev[url]?.[permission];
      const parent = findParentByChildUrl(url);

      // Check if parent allows this permission
      if (parent && !prev[parent.url]?.[permission]) {
        // Parent doesn't have this permission, can't enable it
        return prev;
      }

      // If disabling read, disable all other permissions
      if (permission === "read" && currentValue === true) {
        newState[url] = {
          ...prev[url],
          read: false,
          add: false,
          update: false,
          delete: false,
        };

        // Disable read for all children recursively
        const item = findItemByUrl(url);
        if (item?.subItems) {
          const disableChildren = (items) => {
            items.forEach((subItem) => {
              newState[subItem.url] = {
                ...newState[subItem.url],
                read: false,
                add: false,
                update: false,
                delete: false,
              };
              if (subItem.subItems && subItem.subItems.length > 0) {
                disableChildren(subItem.subItems);
              }
            });
          };
          disableChildren(item.subItems);
        }
      }
      // If enabling add/update/delete, ensure read is enabled
      else if (
        ["add", "update", "delete"].includes(permission) &&
        !currentValue
      ) {
        newState[url] = {
          ...prev[url],
          read: true,
          [permission]: true,
        };
      }
      // If enabling read, update children to also get read
      else if (permission === "read" && !currentValue) {
        newState[url] = {
          ...prev[url],
          read: true,
        };

        // Enable read for all enabled children
        const item = findItemByUrl(url);
        if (item?.subItems) {
          const enableChildrenRead = (items) => {
            items.forEach((subItem) => {
              if (newState[subItem.url]?.enabled) {
                newState[subItem.url] = {
                  ...newState[subItem.url],
                  read: true,
                };
              }
              if (subItem.subItems && subItem.subItems.length > 0) {
                enableChildrenRead(subItem.subItems);
              }
            });
          };
          enableChildrenRead(item.subItems);
        }
      }
      // Normal toggle for other permissions
      else {
        newState[url] = {
          ...prev[url],
          [permission]: !currentValue,
        };

        // If toggling add/update/delete, cascade to children
        if (["add", "update", "delete"].includes(permission)) {
          const item = findItemByUrl(url);
          if (item?.subItems) {
            const cascadeToChildren = (items, value) => {
              items.forEach((subItem) => {
                if (
                  newState[subItem.url]?.enabled &&
                  newState[subItem.url]?.read
                ) {
                  newState[subItem.url] = {
                    ...newState[subItem.url],
                    [permission]: value,
                  };
                }
                if (subItem.subItems && subItem.subItems.length > 0) {
                  cascadeToChildren(subItem.subItems, value);
                }
              });
            };
            cascadeToChildren(item.subItems, !currentValue);
          }
        }
      }

      // Update parent state based on children
      return updateParentState(newState, url);
    });
  };

  const handleSelectAll = (url, subItems = []) => {
    setMenuPermissions((prev) => {
      const newState = { ...prev };
      const allSelected =
        prev[url]?.read &&
        prev[url]?.add &&
        prev[url]?.update &&
        prev[url]?.delete;

      newState[url] = {
        ...prev[url],
        read: !allSelected,
        add: !allSelected,
        update: !allSelected,
        delete: !allSelected,
      };

      // Apply to all children recursively
      const updateChildren = (items) => {
        items.forEach((subItem) => {
          if (newState[subItem.url]?.enabled) {
            newState[subItem.url] = {
              ...newState[subItem.url],
              read: !allSelected,
              add: !allSelected,
              update: !allSelected,
              delete: !allSelected,
            };
          }
          if (subItem.subItems && subItem.subItems.length > 0) {
            updateChildren(subItem.subItems);
          }
        });
      };

      if (subItems.length > 0) {
        updateChildren(subItems);
      }

      return updateParentState(newState, url);
    });
  };

  const renderSubItems = (item, level = 0) => (
    <MenuItemCard
      key={item.url}
      item={item}
      level={level}
      permissions={menuPermissions}
      onMenuToggle={handleMenuToggle}
      onPermissionToggle={handlePermissionToggle}
      onSelectAll={handleSelectAll}
      renderSubItems={renderSubItems}
      getParentPermission={getParentPermission}
    />
  );

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        tentUuid: tentDetails?.tent_uuid,
        permissions: menuPermissions,
      };

      const body = encryption(payload);

      if (mode === "edit") {
        const res = await ControlsApi.updateTenantRole(roleUuid, {
          data: body,
        });

        const decryptRes = decryption(res.data.data);

        toast.success(decryptRes?.message || "Success");
      } else {
        const res = await ControlsApi.addTenantRole(tentDetails?.tent_uuid, {
          data: body,
        });

        const decryptRes = decryption(res.data.data);

        toast.success(decryptRes?.message || "Success");
      }

      router.push("/controls/roles");
    } catch (error) {
      const err = decryption(error, "error");
      toast.error(err?.message || "Please try again");
      console.error("Error creating/updating role:", error);
    }
  };

  if (loadingData) return <Loading />;

  if (loadingMenus) {
    return (
      <div className="flex-1 space-y-6 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 pb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "edit" ? "Edit Role" : "Create New Role"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "edit"
            ? "Update this role's details and permissions."
            : "Define a new role and configure its permissions across your application."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <RoleFormHeader
            form={form}
            branchesList={branchesList}
            roleScopeOptions={roleScopeOptions}
          />

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Menu Permissions
              </CardTitle>
              <CardDescription>
                Select which menus this role can access and define their
                permission levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Main Navigation
                </h3>
                <NavigationSection
                  navigationGroups={mainNavigation}
                  groupType="main"
                  permissions={menuPermissions}
                  onMenuToggle={handleMenuToggle}
                  onPermissionToggle={handlePermissionToggle}
                  onSelectAll={handleSelectAll}
                  renderSubItems={renderSubItems}
                  openAccordions={openAccordions}
                  setOpenAccordions={setOpenAccordions}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Footer Navigation
                </h3>
                <NavigationSection
                  navigationGroups={footerNavigation}
                  groupType="footer"
                  permissions={menuPermissions}
                  onMenuToggle={handleMenuToggle}
                  onPermissionToggle={handlePermissionToggle}
                  onSelectAll={handleSelectAll}
                  renderSubItems={renderSubItems}
                  openAccordions={openAccordions}
                  setOpenAccordions={setOpenAccordions}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {mode === "edit" ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RolesAdd;
