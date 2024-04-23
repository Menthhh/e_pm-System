import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { Action } from "@/lib/models/Action.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { role_id, action_id } = body;
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
        const action = await Action.findById(action_id);
        if (!action) {
            return NextResponse.json({ message: "Action not found", file: __filename });
        }
        role.ACTION_LIST.push(action_id);
        await role.save();
        return NextResponse.json({ message: "Action added to role successfully", role });
    } catch(err) {
        return NextResponse.json({ message: "Action addition to role failed", file: __filename, error: err.message });
    }
};
