
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
    
  }
};
/**
 * @swagger
 * /api/machine/get-machines:
 *   get:
 *     summary: Get all machines
 *     tags:
 *       - Machine
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 machines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Machine'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 file:
 *                   type: string
 *                   example: "/path/to/file.js"
 *                 error:
 *                   type: string
 */

export const GET = async (req, res) => {
    await connectToDb();
    try {
        const machines = await Machine.find();
        const data = machines.map(machine => {
            return {
                _id: machine._id,
                wd_tag: machine.WD_TAG,
                name: machine.MACHINE_NAME
            };
        });
        return NextResponse.json({ status: 200, machines : data });
    } catch (err) {
        return NextResponse.json({ status: 500, file: __filename, error: err.message });
    }
}

