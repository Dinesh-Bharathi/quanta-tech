export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SESSION: "/auth/session",
  LOGOUT: "/auth/logout",

  // Controls > User Menus
  USER_NAV_MENUS: "/controls/menu/:userUuid",
  // Controls > Roles
  GET_SUBSCRIBED_MENUS: "/controls/tenant/subscribed/menus/:tentUuid",
  GET_TENT_ROLES: "/controls/tenant/roles/:tentUuid",
  ADD_TENANT_ROLE: "/controls/tenant/roles/:tentUuid",
  GET_TENANT_ROLE_BY_UUID: "/controls/tenant/role/permission/:roleUuid",
  UPDATE_TENANT_ROLE: "/controls/tenant/role/permission/:roleUuid",

  // Settings > General
  GET_TENT_DETAILS: "/settings/tent-details/:tentUuid",
  // Settings > Profile
  GET_PROFILE: "/settings/user-profile/:userUuid",
  UPDATE_PROFILE: "/settings/user-profile/:userUuid",
  UPDATE_PASSWORD: "/auth/change-password",
};

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
