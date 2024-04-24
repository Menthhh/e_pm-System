import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { Workgroup } from "@/lib/models/Workgroup";
import { NextResponse } from 'next/server';

export const DELETE = async (req, res) => {
    await connectToDb();
    const {user_id, workgroup_id} = await req.json();
    try {
        const workgroup = await Workgroup.findById(workgroup_id);
        if (!workgroup) {
            return NextResponse.json({ message: "Workgroup not found" });
        }
        const user = await User.findById(user_id);
        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }
        workgroup.USER_LIST.pull(user_id);
        await workgroup.save();
        return NextResponse.json({ status:200, workgroup });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }

};
