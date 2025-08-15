"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { rolesApi } from "@/services/settings/config/roles/api";
import { RolesDataTablePaginated } from "./roles/roles-data-table-paginated";
import { RolesFiltersDebounced } from "./roles/roles-filters-debounced";
import { RoleFormDialog } from "./roles/role-form-dialog";
import { RoleModulesFormDialog } from "./role-modules/role-modules-form-dialog";
import { useAuth } from "@/context/AuthContext";

const ConfigurationSettings = () => {
  const { tentDetails } = useAuth();
  const tentUuid = tentDetails?.tent_uuid;

  // Roles state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [rolesFilters, setRolesFilters] = useState({ search: "", status: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Role Modules state
  const [roleModulesDialogOpen, setRoleModulesDialogOpen] = useState(false);
  const [editingRoleModules, setEditingRoleModules] = useState(null);
  const [roleModulesFormLoading, setRoleModulesFormLoading] = useState(false);

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await rolesApi.getRoles(tentUuid, rolesFilters);
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    if (tentUuid) {
      loadRoles();
    }
  }, [rolesFilters, tentUuid]);

  // Roles handlers
  const handleCreateRole = () => {
    setEditingRole(null);
    setDialogOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      const body = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        status: formData.status === "active",
      };
      if (editingRole) {
        await rolesApi.updateRole(editingRole.tent_config_uuid, body);
      } else {
        await rolesApi.createRole(tentUuid, body);
      }
      setDialogOpen(false);
      setEditingRole(null);
      loadRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRole = async (tentConfigUuid) => {
    try {
      await rolesApi.deleteRole(tentConfigUuid);
      loadRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);
    }
  };

  const handleRolesFiltersChange = (newFilters) => {
    setRolesFilters(newFilters);
  };

  // Role Modules handlers
  const handleEditRoleModules = (role) => {
    setEditingRoleModules(role);
    setRoleModulesDialogOpen(true);
  };

  const handleRoleModulesFormSubmit = async (formData) => {
    try {
      setRoleModulesFormLoading(true);
      const body = {
        mainNavigation: formData.mainNavigation || {},
        footerNavigation: formData.footerNavigation || {},
      };
      await rolesApi.updateRoleModule(formData?.tent_config_uuid, body);
      loadRoles();
      setRoleModulesDialogOpen(false);
      setEditingRoleModules(null);
    } catch (error) {
      console.error("Failed to save role modules:", error);
    } finally {
      setRoleModulesFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            System Configuration
          </h2>
          <p className="text-muted-foreground">
            Manage your application settings and configurations here.
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    User Roles Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage user roles with specific permissions and
                    module access levels.
                  </CardDescription>
                </div>
                <Button onClick={handleCreateRole} disabled={rolesLoading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RolesFiltersDebounced
                onFiltersChange={handleRolesFiltersChange}
                loading={rolesLoading}
              />
              <RolesDataTablePaginated
                roles={roles}
                loading={rolesLoading}
                onEdit={handleEditRole}
                onEditModules={handleEditRoleModules}
                onDelete={(role) => handleDeleteRole(role.tent_config_uuid)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={editingRole}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      <RoleModulesFormDialog
        open={roleModulesDialogOpen}
        onOpenChange={setRoleModulesDialogOpen}
        role={editingRoleModules}
        onSubmit={handleRoleModulesFormSubmit}
        loading={roleModulesFormLoading}
      />
    </div>
  );
};

export default ConfigurationSettings;
