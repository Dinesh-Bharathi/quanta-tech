// Mock API for Role Modules
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockRoleModules = [
  {
    id: "1",
    role_id: "role_1",
    role_name: "Admin",
    role_description: "Full system administrator",
    modules: [
      "dashboard",
      "inventory",
      "inventory_products",
      "inventory_categories",
      "inventory_warehouses",
      "inventory_movements",
      "team",
      "team_members",
      "team_roles",
      "team_invitations",
      "users",
      "billing",
      "settings_general",
      "settings_security",
      "settings_theme",
      "settings_configuration",
    ],
    modules_count: 16,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    role_id: "role_2",
    role_name: "Manager",
    role_description: "Department manager with limited access",
    modules: [
      "dashboard",
      "inventory",
      "inventory_products",
      "inventory_categories",
      "team",
      "team_members",
      "users",
    ],
    modules_count: 7,
    status: "active",
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-18T11:15:00Z",
  },
  {
    id: "3",
    role_id: "role_3",
    role_name: "Employee",
    role_description: "Basic employee access",
    modules: ["dashboard", "inventory_products"],
    modules_count: 2,
    status: "active",
    created_at: "2024-01-17T08:00:00Z",
    updated_at: "2024-01-17T08:00:00Z",
  },
  {
    id: "4",
    role_id: "role_4",
    role_name: "Viewer",
    role_description: "Read-only access",
    modules: ["dashboard"],
    modules_count: 1,
    status: "inactive",
    created_at: "2024-01-18T07:00:00Z",
    updated_at: "2024-01-19T16:45:00Z",
  },
];

export const roleModulesApi = {
  // Get all role modules with filtering
  getRoleModules: async (tentUuid, filters = {}) => {
    await delay(800); // Simulate API delay

    let filteredData = [...mockRoleModules];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.role_name.toLowerCase().includes(searchLower) ||
          item.role_description.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (filters.role) {
      filteredData = filteredData.filter(
        (item) => item.role_id === filters.role
      );
    }

    return {
      data: filteredData,
      total: filteredData.length,
      page: 1,
      limit: 10,
    };
  },

  // Create new role module assignment
  createRoleModule: async (tentUuid, data) => {
    await delay(1000);

    const newRoleModule = {
      id: `role_module_${Date.now()}`,
      role_id: data.role_id,
      role_name: `Role ${data.role_id}`, // In real app, this would be fetched
      role_description: "Role description",
      modules: data.modules,
      modules_count: data.modules.length,
      status: data.status ? "active" : "inactive",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockRoleModules.push(newRoleModule);
    return { data: newRoleModule };
  },

  // Update role module assignment
  updateRoleModule: async (id, data) => {
    await delay(1000);

    const index = mockRoleModules.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockRoleModules[index] = {
        ...mockRoleModules[index],
        role_id: data.role_id,
        modules: data.modules,
        modules_count: data.modules.length,
        status: data.status ? "active" : "inactive",
        updated_at: new Date().toISOString(),
      };
      return { data: mockRoleModules[index] };
    }
    throw new Error("Role module assignment not found");
  },

  // Delete role module assignment
  deleteRoleModule: async (id) => {
    await delay(500);

    const index = mockRoleModules.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deleted = mockRoleModules.splice(index, 1)[0];
      return { data: deleted };
    }
    throw new Error("Role module assignment not found");
  },

  // Get role module by ID
  getRoleModuleById: async (id) => {
    await delay(300);

    const roleModule = mockRoleModules.find((item) => item.id === id);
    if (roleModule) {
      return { data: roleModule };
    }
    throw new Error("Role module assignment not found");
  },
};
