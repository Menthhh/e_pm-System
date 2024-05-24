"use server"
import { NextResponse } from "next/server.js";
import { getSession } from "./lib/utils/utils.js";
import { Roles } from "./lib/utils/Roles.js";

const publicRoutes = [
    "/pages/login",
    "/pages/register",
    "/api/auth/login",
    "/api/auth/register",
];

const developingRoutes = [
    "/pages/job-calendar",
]

const SA = {
    "ID": Roles.SUPER_ADMIN_ID, 
    "name": Roles.SUPER_ADMIN,
    "unaccessible_pages": [
        "/pages/admin/add-user-to-workgroup",
        "/pages/dashboard"
    ],
    "unaccessible_api": [
        
    ]
}

const ADMIN_GROUP = {
    "ID": Roles.ADMIN_GROUP_ID,
    "name": Roles.ADMIN_GROUP,
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
    
    // if (endpoint !== '/api/checker') {
    //     try {
    //         const response = await fetch(`${config.host}/api/checker`);
    //         const data = await response.json();
    //         if (data.status === 200) {
    //             console.log("Run Checking API Successfully!");
    //         }
    //     } catch (err) {
    //         console.error("Error:", err);
    //     }
    // }
    const token = await getSession();
    const userRoleId = token.Role;

    if (!userRoleId) return NextResponse.redirect(new URL('/pages/login', req.nextUrl));
    
    else if (
        (userRoleId === SA.ID && SA.unaccessible_pages.includes(endpoint)) ||
        (userRoleId === ADMIN_GROUP.ID && ADMIN_GROUP.unaccessible_pages.includes(endpoint))    
    ) return NextResponse.redirect(new URL('/pages/denied', req.nextUrl));
     
        
    else return NextResponse.next();
    
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|api/checker).*)'],
}
