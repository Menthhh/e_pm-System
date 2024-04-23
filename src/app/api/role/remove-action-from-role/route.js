import { Role } from "@/lib/models/Role.js";
import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server'; // or 'next/server' depending on your Next.js version

export const DELETE = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { role_id, actionListID } = body;

    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found" }, { status: 404 });
        }

        // Remove each action in the role from the actionList
        actionListID.forEach(async (actionId) => {
            role.ACTION_LIST = role.ACTION_LIST.filter(action => action.toString() !== actionId);
        });
        
        await role.save();
        return NextResponse.json({ status: 200, roleActions: role.ACTION_LIST});
    } catch (err) {
        return NextResponse.json({ message: "Role deletion failed", file: __filename, error: err.message }, { status: 500 });
    }
};
