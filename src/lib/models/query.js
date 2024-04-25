import mongoose from "mongoose";

export const compareIds = async (id1, id2, db) => {
    const id1 = new mongoose.Types.ObjectId(id1);
    const id2 = new mongoose.Types.ObjectId(id2);

    pipline = [
        {
            $match: {
                $expr: {
                    $eq: [id1, id2]
                }
            }
        }
    ];
    const result = await db.aggregate(pipeline);
    return result
}
