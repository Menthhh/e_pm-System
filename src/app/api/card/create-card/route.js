import { Card } from '../../../../lib/models/Card.js';
import { connectToDb } from "@/lib/utils/utils.js"; 
import { NextResponse } from 'next/server';


export const POST = async (req, res) => {
    const body = await req.json();
    const { title, detail, link } = body;
    await connectToDb();
    try {
        const card = new Card({
            TITLE: title,
            DETAIL: detail,
            LINK: link,
        });
        await card.save();
        return NextResponse.json({ status: 200, card });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
}

 