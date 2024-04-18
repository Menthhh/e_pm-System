import { connectToDb } from "@/lib/utils/utils.js";
import { Action } from "@/lib/models/Action.js";
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    await connectToDb();
    try {
        const actions = await Action.find();
        return NextResponse.json({ message: "Read all actions successful", actions });
    } catch (err) {
        return NextResponse.json({ message: "Read all actions failed", file: __filename, error: err.message });
    }
};
