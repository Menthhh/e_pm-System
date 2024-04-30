"use server"
import { NextResponse } from "next/server.js";
import { getSession } from "./lib/utils/utils.js";

const publicRoutes = [
    "/pages/login",
    "/pages/register",
    "/api/auth/login",
    "/api/auth/register",
];

const developingRoutes = [
    "/pages/dashboard"
]

const SA = {
    "role_id": process.env.SA_ROLE_ID, 
    "role_name": "SA",
    "unaccessible_pages": [
        "/pages/admin/add-user-to-workgroup",
    ],
    "unaccessible_api": [
        
    ]
}

const ADMIN_GROUP = {
    "role_id": process.env.ADMIN_GROUP_ROLE_ID,
    "role_name": "Admin Group",
    "unaccessible_pages": [
        "/pages/SA/create-role",
        "/pages/SA/create-workgroup",
        "/pages/SA/edit-role",
        "/pages/SA/edit-workgroup",
    ],
    "unaccessible_api": [
        
    ]
}

export default async function middleware(req) {
    const endpoint = req.nextUrl.pathname;
    
    if (publicRoutes.includes(endpoint)) return NextResponse.next();

    if (developingRoutes.includes(endpoint)) return NextResponse.next(); 
    
    const token = await getSession();
    const userRoleId = token.Role;

    if (!userRoleId) return NextResponse.redirect(new URL('/pages/login', req.nextUrl));
    
    else if (
        (userRoleId === SA.role_id && SA.unaccessible_pages.includes(endpoint)) ||
        (userRoleId === ADMIN_GROUP.role_id && ADMIN_GROUP.unaccessible_pages.includes(endpoint))    
    ) return NextResponse.redirect(new URL('/pages/denied', req.nextUrl));
     
        
    else return NextResponse.next();
    
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
