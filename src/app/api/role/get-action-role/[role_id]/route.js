import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { NextResponse } from 'next/server';
import { Action } from "@/lib/models/Action.js";

export const GET = async (req, {params}) => {
    await connectToDb();
    const { role_id } = params;
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
 
        const roleActions = await Promise.all(role.ACTION_LIST.map(async (actionId) => {
            const action = await Action.findOne({ _id: actionId });
            return {
                _id: action._id,
                name: action.ACTION_NAME,
            };
        }));
        
        return NextResponse.json({ status: 200, role_actions: roleActions });
    } catch (err) {
        return NextResponse.json({ message: "Role retrieval failed", file: __filename, error: err.message });
    }

};
