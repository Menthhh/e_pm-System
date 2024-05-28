import dotenv from 'dotenv';
dotenv.config();

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { User } from "@/lib/models/User.js";
import { RoleHasAction } from "@/lib/models/RoleHasAction";
import { Card } from "@/lib/models/Card";


const db_url = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

const connectToDb = async () => {
    if (cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect("mongodb://localhost:27017/e_pm", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
};



export const GET = async (req, { params }) => {
    await connectToDb();
    const { user_id } = params;
    try {
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
