
import { NextResponse } from 'next/server';
import { User } from "@/lib/models/User.js";
import { RoleHasAction } from "@/lib/models/RoleHasAction";
import { Card } from "@/lib/models/Card";
import { connectToDb } from "@/app/api/mongo/index.js";
import mongoose from 'mongoose';
export const dynamic = 'force-dynamic';
export const GET = async (req, { params }) => {
    await connectToDb();
    const { user_id } = params;
    try {
        console.log(user_id)
        // Fetch user's actions
        const user = await User.findById(user_id);
        const user_roleID = new mongoose.Types.ObjectId(user.ROLE);

        const userActions = await RoleHasAction.aggregate([
            {
                $match: { ROLE_ID: user_roleID }
            },
            {
                $lookup: {
                    from: "actions",
                    localField: "ACTION_ID",
                    foreignField: "_id",
                    as: "actionDetails"
                }
            },
            {
                $unwind: "$actionDetails"
            },
            {
                $project: {
                    _id: "$actionDetails._id",
                    name: "$actionDetails.ACTION_NAME"
                }
            }
        ]);


        const cards = await Card.find();

        const matchedCards = cards.filter(card => {
            return card.ACTION_LIST.some(actionId => {
                return userActions.some(userAction => userAction._id.toString() === actionId.toString());
            });
        });

        return NextResponse.json({ status: 200, cards: matchedCards });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
};
