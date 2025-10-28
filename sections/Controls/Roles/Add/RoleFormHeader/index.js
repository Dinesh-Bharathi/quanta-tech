import { UserCog, MessageSquareQuote } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const RoleFormHeader = ({ form }) => {
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
      </CardContent>
    </Card>
  );
};

export { RoleFormHeader };
