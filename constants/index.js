export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SESSION: "/auth/session",
  LOGOUT: "/auth/logout",

  // Controls > User Menus
  USER_NAV_MENUS: "/controls/menu/:userUuid",
  // Controls > Roles
  GET_TENT_ROLES: "/controls/tenant/roles/:tentUuid",

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
  "/signup",
  "/forgot-password",
  "/reset-password",
];
