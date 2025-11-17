import { UserCog, MessageSquareQuote, Globe, Building2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const RoleFormHeader = ({ form, branchesList = [], roleScopeOptions = [] }) => {
  const selectedBranches = form.watch("branch_uuid") || [];

  // Auto-update scope based on branch selection
  useEffect(() => {
    const branchCount = selectedBranches.length;
    let newScope = "tenant"; // Global

    if (branchCount === 1) {
      newScope = "branch"; // One Branch
    } else if (branchCount > 1) {
      newScope = "multi-branch"; // Multi Branch
    }

    // Only update if the scope has actually changed
    if (form.getValues("scope") !== newScope) {
      form.setValue("scope", newScope);
    }
  }, [selectedBranches, form]);

  // Filter active branches (status: true)
  const activeBranches = branchesList.filter(
    (branch) => branch.status === true
  );

  // Handle branch toggle
  const handleBranchToggle = (branchUuid) => {
    const currentBranches = form.getValues("branch_uuid") || [];
    const isSelected = currentBranches.includes(branchUuid);

    if (isSelected) {
      form.setValue(
        "branch_uuid",
        currentBranches.filter((uuid) => uuid !== branchUuid)
      );
    } else {
      form.setValue("branch_uuid", [...currentBranches, branchUuid]);
    }
  };

  // Check if a branch is selected
  const isBranchSelected = (branchUuid) => {
    return selectedBranches.includes(branchUuid);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <UserCog className="h-4 w-4 text-primary" />
                  Role Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Editor, Moderator, Viewer"
                    {...field}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <MessageSquareQuote className="h-4 w-4 text-primary" />
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe the role's purpose"
                    {...field}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scope"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <Globe className="h-4 w-4 text-primary" />
                  Scope
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleScopeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch_uuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="h-4 w-4 text-primary" />
                  Branches
                </FormLabel>
                <div className="space-y-2">
                  <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                    {activeBranches.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No active branches available
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {activeBranches.map((branch) => (
                          <label
                            key={branch.branch_uuid}
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isBranchSelected(branch.branch_uuid)}
                              onChange={() =>
                                handleBranchToggle(branch.branch_uuid)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm flex-1">
                              {branch.branch_name}
                              {branch.is_hq && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (HQ)
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedBranches.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {selectedBranches.length} branch
                      {selectedBranches.length !== 1 ? "es" : ""} selected
                    </p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { RoleFormHeader };
