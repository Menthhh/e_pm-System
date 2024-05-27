import { Status } from "@/lib/models/Status";
import { connectToDb } from "@/lib/utils/utils.js";
import { NextResponse } from 'next/server';

export const GET = async (req, res) => {
    await connectToDb();
    try {
        const status = await Status.find();
        return NextResponse.json({ status: 200, status });
    } catch (error) {
        return NextResponse.json({ status: 500, error: error.message });
    }
}
