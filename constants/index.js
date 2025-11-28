export const API_ENDPOINTS = {
  LOGIN_ONE: "/auth/login/step1",
  LOGIN_TWO: "/auth/login/step2",
  TENANT_SELECTION: "/auth/tenant-select/:globalSessionUuid",
  SESSION: "/auth/tenant/session",
  LOGOUT: "/auth/logout",
  GOOGLE_LOGIN: "/auth/google/login",
  GOOGLE_SIGNUP: "/auth/google/signup",
  SIGNUP: "/auth/signup",
  SEND_VERIFICATION_EMAIL: "/auth/send-verification",
  RESEND_VERIFICATION_EMAIL: "/auth/resend-verification",
  ONBOARDING_REGISTER: "/auth/register-tenant/:userUuid",
  FORGOT_PASSWORD: "/auth/forgot-password/send",
  FORGOT_PASSWORD_TENANTS: "/auth//forgot-password/tenants",
  VERIFY_FORGOT_PASSWORD: "/auth/verify-reset-token",
  RESET_PASSWORD: "auth/reset-password",

  // Controls > User Menus
  USER_NAV_MENUS: "/roles/menu/:userUuid/:branchUuid",
  // Controls > Roles
  GET_SUBSCRIBED_MENUS: "/roles/tenant/subscribed/menus/:tenantUuid",
  GET_TENT_ROLES: "/roles/tenant/roles/:tenantUuid",
  ADD_TENANT_ROLE: "/roles/tenant/roles/:tenantUuid",
  GET_TENANT_ROLE_BY_UUID: "/roles/tenant/role/details/:roleUuid",
  UPDATE_TENANT_ROLE: "/roles/tenant/role/:roleUuid",
  DELETE_TENANT_ROLE: "/roles/tenant/role/:tenantUuid/:roleUuid",
  // Controls > Users
  GET_TENANT_USERS: "/users/tenant/users/:tenantUuid",
  CREATE_TENANT_USER: "/users/tenant/users/:tenantUuid",
  UPDATE_TENANT_USER: "/users/tenant/user/:userUuid",
  DELETE_TENANT_USER: "/users/tenant/user/:userUuid",
  // Controls > Branches
  GET_TENANT_BRANCHES: "/branches/:tenantUuid",
  CREATE_TENANT_BRANCH: "/branches/:tenantUuid",
  UPDATE_TENANT_BRANCH: "/branches/:tenantUuid/:branchUuid",
  DELETE_TENANT_BRANCH: "/branches/:tenantUuid/:branchUuid",

  // Settings > General
  GET_TENT_DETAILS: "/settings/tent-details/:tenantUuid",
  // Settings > Profile
  GET_PROFILE: "/settings/user-profile/:userUuid",
  UPDATE_PROFILE: "/settings/user-profile/:userUuid",
  UPDATE_PASSWORD: "/auth/change-password",

  // Lookups
  COUNTRIES: "/lookups/countries",
  STATES_BY_COUNTRY: "/lookups/states/:countryCode",
  COUNTRY_DETAILS: "/lookups/country/:countryCode",
};

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/tenant-select",
  "/signup",
  "/signup/onboarding",
  "/singnup/plans",
  "/forgot-password",
  "/reset-password",
];
