import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';
import { Role } from "@/lib/models/Role";
import { Workgroup } from "@/lib/models/Workgroup";
import { UserHasRole } from "@/lib/models/UserHasRole";

export const GET = async (req, params) => {
    await connectToDb();
    try {
        const users = await User.find();
        if (!users) {
            return NextResponse.json({ message: "No users found", file: __filename });
        }

        const userHasRoles = await UserHasRole.find();
        
        const data = [];

        for (const user of users) {
            const userRole = userHasRoles.find(ur => ur.USER_ID.equals(user._id));
            let roleName = "No role";

            if (userRole) {
                const role = await Role.findById(userRole.ROLE_ID);
                if (role) {
                    roleName = role.ROLE_NAME;
                }
            }

            data.push({
                _id: user._id,
                emp_number: user.EMP_NUMBER,
                email: user.EMAIL,
                name: user.EMP_NAME,
                role: roleName
            });
        }
        
        return NextResponse.json({ status: 200, user: data });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
