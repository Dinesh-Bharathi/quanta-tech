export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SESSION: "/auth/session",
  LOGOUT: "/auth/logout",
  GOOGLE_LOGIN: "/auth/google/login",
  GOOGLE_SIGNUP: "/auth/google/signup",
  SIGNUP: "/auth/signup",
  SEND_VERIFICATION_EMAIL: "/auth/send-verification",
  RESEND_VERIFICATION_EMAIL: "/auth/resend-verification",
  ONBOARDING_REGISTER: "/auth/register-tenant/:userUuid",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_FORGOT_PASSWORD: "/auth/verify-reset-token",
  RESET_PASSWORD: "auth/reset-password",

  // Controls > User Menus
  USER_NAV_MENUS: "/controls/menu/:userUuid/:branchUuid",
  // Controls > Roles
  GET_SUBSCRIBED_MENUS: "/controls/tenant/subscribed/menus/:tentUuid",
  GET_TENT_ROLES: "/controls/tenant/roles/:tentUuid",
  ADD_TENANT_ROLE: "/controls/tenant/roles/:tentUuid",
  GET_TENANT_ROLE_BY_UUID: "/controls/tenant/role/details/:roleUuid",
  UPDATE_TENANT_ROLE: "/controls/tenant/role/:roleUuid",
  DELETE_TENANT_ROLE: "/controls/tenant/role/:tentUuid/:roleUuid",
  // Controls > Users
  GET_TENANT_USERS: "/controls/tenant/users/:tentUuid",
  CREATE_TENANT_USER: "/controls/tenant/users/:tentUuid",
  UPDATE_TENANT_USER: "/controls/tenant/users/:userUuid",
  DELETE_TENANT_USER: "/controls/tenant/users/:userUuid",
  // Controls > Branches
  GET_TENANT_BRANCHES: "/branches/:tentUuid",
  CREATE_TENANT_BRANCH: "/branches/:tentUuid",
  UPDATE_TENANT_BRANCH: "/branches/:tentUuid/:branchUuid",
  DELETE_TENANT_BRANCH: "/branches/:tentUuid/:branchUuid",

  // Settings > General
  GET_TENT_DETAILS: "/settings/tent-details/:tentUuid",
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
  "/signup",
  "/signup/onboarding",
  "/singnup/plans",
  "/forgot-password",
  "/reset-password",
];
