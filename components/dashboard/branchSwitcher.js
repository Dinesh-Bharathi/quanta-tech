"use client";

import * as React from "react";
import { Building2, ChevronsUpDown, Plus, Check } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function BranchSwitcher({ sidebarOpen }) {
  const {
    currentBranch,
    branchesList,
    switchBranch,
    permissions,
    canAccessBranch,
  } = useAuth();

  const { isMobile } = useSidebar();

  // Validate branch list
  if (!branchesList || branchesList.length === 0) return null;

  const accessibleBranches = branchesList.filter((branch) =>
    canAccessBranch(branch.branch_uuid)
  );

  // Static view when only one accessible branch
  if (accessibleBranches.length === 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building2 className="size-4" />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentBranch?.branch_name || "Select Branch"}
              </span>
              {/* {currentBranch?.is_hq && (
                  <span className="truncate text-xs">(HQ)</span>
                )} */}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Full dropdown (match original UI)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentBranch?.branch_name || "Select Branch"}
                </span>
                {/* {currentBranch?.is_hq && (
                  <span className="truncate text-xs">(HQ)</span>
                )} */}
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs flex items-center justify-between">
              Branches
              {/* {permissions?.has_tenant_wide_access && (
                <Badge variant="secondary" className="text-xs">
                  All Access
                </Badge>
              )} */}
            </DropdownMenuLabel>

            {accessibleBranches.map((branch, index) => (
              <DropdownMenuItem
                key={branch.branch_uuid}
                onClick={() => switchBranch(branch.branch_uuid)}
                className="gap-2 p-2 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Building2 className="size-4" />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium">{branch.branch_name}</span>

                    {branch.state && (
                      <span className="text-xs text-muted-foreground">
                        {branch.state}, {branch.country}
                      </span>
                    )}

                    {/* {branch.is_hq && (
                      <Badge variant="outline" className="text-xs w-fit">
                        HQ
                      </Badge>
                    )} */}
                  </div>
                </div>

                {currentBranch?.branch_uuid === branch.branch_uuid && (
                  <Check className="size-4 text-primary" />
                )}

                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add branch
              </div>
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator />

            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {accessibleBranches.length} of {branchesList.length} branches
              accessible
            </div> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
