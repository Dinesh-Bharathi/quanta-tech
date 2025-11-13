export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  SESSION: "/auth/session",
  LOGOUT: "/auth/logout",
  GOOGLE_LOGIN: "/auth/google/login",
  GOOGLE_SIGNUP: "/auth/google/signup",
  SIGNUP: "/auth/signup",
  SEND_VERIFICATION_EMAIL: "/auth/send-verification",
  RESEND_VERIFICATION_EMAIL:"/auth/resend-verification",


  // Controls > User Menus
  USER_NAV_MENUS: "/controls/menu/:userUuid",
  // Controls > Roles
  GET_SUBSCRIBED_MENUS: "/controls/tenant/subscribed/menus/:tentUuid",
  GET_TENT_ROLES: "/controls/tenant/roles/:tentUuid",
  ADD_TENANT_ROLE: "/controls/tenant/roles/:tentUuid",
  GET_TENANT_ROLE_BY_UUID: "/controls/tenant/role/details/:roleUuid",
  UPDATE_TENANT_ROLE: "/controls/tenant/role/:roleUuid",
  DELETE_TENANT_ROLE: "/controls/tenant/role/:roleUuid",
  // Controls > Users
  GET_TENANT_USERS: "/controls/tenant/users/:tentUuid",
  CREATE_TENANT_USER: "/controls/tenant/users/:tentUuid",
  UPDATE_TENANT_USER: "/controls/tenant/users/:userUuid",
  DELETE_TENANT_USER: "/controls/tenant/users/:userUuid",

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
  "/signup/onboarding",
  "/singnup/plans",
  "/forgot-password",
  "/reset-password",
];
