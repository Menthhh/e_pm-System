import { Card } from '@lib/models/Card.js';
import { connectToDb } from "@/lib/utils/utils.js"; 


export const GET = async (req, res) => {
   
    await connectToDb();
    try {
        const cards = await Card.find();
        return NextResponse.json({ status: 200, cards });
    } catch (err) {
        return NextResponse.json({status: 500, file: __filename, error: err.message});
    }
}

 