
import { Machine } from "../../../../lib/models/Machine.js";
import { NextResponse } from 'next/server.js';

import mongoose from "mongoose";
const db_url = process.env.MONGODB_URI;

const connection = {};

const connectToDb = async () => {
  console.log("Connecting to DB");
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(db_url);
    connection.isConnected = db.connections[0].readyState;
    console.log("New connection");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
/**
 * @swagger
 * /api/machine/create-machine:
 *   post:
 *     summary: Create a new machine
 *     description: Endpoint to create a new machine.
 *     tags:
 *       - Machine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               WD_TAG:
 *                 type: string
 *               MACHINE_NAME:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with created machine data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 machine:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     WD_TAG:
 *                       type: string
 *                     MACHINE_NAME:
 *                       type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 file:
 *                   type: string
 *                 error:
 *                   type: string
 */

export const POST = async (req, res) => {
    await connectToDb();
    const body = await req.json();
    const { WD_TAG, MACHINE_NAME } = body;
    try {
        const machine = new Machine({
            WD_TAG,
            MACHINE_NAME
        });
        await machine.save();

        const data = {
            "wd_tag": machine.WD_TAG,
            "name": machine.MACHINE_NAME
        }

        return NextResponse.json({ status: 200, machine });
    } catch (error) {
        return NextResponse.json({ status: 500, file: __filename, error: error.message });
    }
}

