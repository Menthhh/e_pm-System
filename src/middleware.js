"use server";

import { NextResponse } from "next/server";
import { getSession } from "./lib/utils/utils";
import { Roles } from "./lib/utils/Roles";

const publicRoutes = [
  "/pages/login",
  "/pages/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/schedule-checker",
];

const developingRoutes = [
  "/pages/job-calendar",
  "/pages/dev-test",
];

const SA = {
  ID: Roles.SUPER_ADMIN_ID,
  name: Roles.SUPER_ADMIN,
  unaccessible_pages: [
    "/pages/admin/add-user-to-workgroup",
    "/pages/dashboard",
    "/pages/activate-remove-job",
    "/pages/edit-job-item-template",
    "/pages/edit-job-template",
    "/pages/job-approve",
    "/pages/job-calendar",
    "/pages/job-item-template",
    "/pages/job-manage",
    "/pages/job-renew",
    "/pages/job-template",
  ],
};

const ADMIN_GROUP = {
  ID: Roles.ADMIN_GROUP_ID,
  name: Roles.ADMIN_GROUP,
  unaccessible_pages: [
    "/pages/SA/create-role",
    "/pages/SA/create-workgroup",
    "/pages/SA/edit-role",
    "/pages/SA/edit-workgroup",
  ],
  unaccessible_api: [],
};

export default async function middleware(req) {
  const endpoint = req.nextUrl.pathname;

  // Public and developing routes are accessible by anyone
  if (publicRoutes.includes(endpoint) || developingRoutes.includes(endpoint)) {
    return NextResponse.next();
  }

  // Get user session and role
  const token = await getSession();
  const userRoleId = token?.Role;

  if (!userRoleId) {
    return NextResponse.redirect(new URL('/pages/login', req.nextUrl));
  }

  // Check role-based access
  if (
    (userRoleId === SA.ID && SA.unaccessible_pages.includes(endpoint)) ||
    (userRoleId === ADMIN_GROUP.ID && ADMIN_GROUP.unaccessible_pages.includes(endpoint))
  ) {
    return NextResponse.redirect(new URL('/pages/denied', req.nextUrl));
  }

  // Add CORS headers to all API responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|api/checker).*)'],
};
