import { connectToDb } from "@/lib/utils/utils.js";
import { User } from "@/lib/models/User.js";
import { NextResponse } from 'next/server';


export const GET = async (req, {params}) => {
    await connectToDb();
    
    const { user_id } = params;
    try {
        const user = await User.findById(user_id);
        const userRole = user.ROLE;

        if (!user) {
            return NextResponse.json({ message: "User not found", file: __filename,  });
        }


        return NextResponse.json({status:200, user, role: userRole });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }

};
