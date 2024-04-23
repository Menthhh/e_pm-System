import { connectToDb } from "@/lib/utils/utils.js";
import { Role } from "@/lib/models/Role.js";
import { Action } from "@/lib/models/Action.js";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { role_id, action_id } = body; // Change action_id to match the field name in the request body
    try {
        const role = await Role.findById(role_id);
        if (!role) {
            return NextResponse.json({ message: "Role not found", file: __filename });
        }
        
        // Iterate over each action_id
        for (const actionID of action_id) {
            // Check if the actionID is already present in ACTION_LIST
            if (!role.ACTION_LIST.includes(actionID)) {
                // If not present, push it to the ACTION_LIST
                role.ACTION_LIST.push(actionID);
            } else {
                console.log(`Action ${actionID} already exists in the role's ACTION_LIST`);
            }
        }

        // Filter out null values and return the updated roleActions
        const roleActions = role.ACTION_LIST.filter(actionID => actionID !== null);

        await role.save(); // Save the updated role

        return NextResponse.json({ status: 200, roleActions });
    } catch(err) {
        return NextResponse.json({ message: "Action addition to role failed", file: __filename, error: err.message });
    }
};
