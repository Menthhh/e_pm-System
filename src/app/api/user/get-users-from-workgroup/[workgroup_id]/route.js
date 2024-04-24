import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';
import { UserHasRole } from "@/lib/models/UserHasRole";
import { Role } from "@/lib/models/Role";

export const GET = async (req, param) => {
    await connectToDb();
    try {
        const users = await User.find();
        let data = []
        if (!users) {
            return NextResponse.json({ message: "No users found", file: __filename });
        }

        for (let i = 0; i < users.length; i++) {
            let role_name = "No Role"; // Default role name
            const userHasRole = await UserHasRole.findOne({ USER_ID: users[i]._id });
            if (userHasRole) {
                const role = await Role.findById(userHasRole.ROLE_ID);
                if (role) {
                    role_name = role.ROLE_NAME;
                }
            }

            let user = {
                _id: users[i]._id,
                emp_number: users[i].EMP_NUMBER,
                email: users[i].EMAIL,
                name: users[i].EMP_NAME,
                role: role_name
            }
            data.push(user)
        }
        return NextResponse.json({ status: 200, user: data });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message});
    }
};
