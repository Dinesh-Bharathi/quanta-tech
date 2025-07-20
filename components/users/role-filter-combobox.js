"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function RoleFilterCombobox({
  selectedRoles,
  onRoleChange,
  roleCounts,
  roles,
}) {
  const [open, setOpen] = useState(false);

  const handleRoleToggle = (roleValue) => {
    const newSelectedRoles = selectedRoles.includes(roleValue)
      ? selectedRoles.filter((role) => role !== roleValue)
      : [...selectedRoles, roleValue];
    onRoleChange(newSelectedRoles);
  };

  // Get role color dot
  const getRoleDotColor = (roleName) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    const index = roles.findIndex((role) => role.name === roleName);
    return colors[index % colors.length] || "bg-gray-500";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between border-gray-200 bg-transparent"
        >
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {selectedRoles.length === 0
              ? "Filter by role"
              : `${selectedRoles.length} role${
                  selectedRoles.length > 1 ? "s" : ""
                } selected`}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.tent_config_uuid}
                  onSelect={() => handleRoleToggle(role.name)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedRoles.includes(role.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${getRoleDotColor(
                          role.name
                        )}`}
                      ></div>
                      {role.name}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {roleCounts[role.name] || 0}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
