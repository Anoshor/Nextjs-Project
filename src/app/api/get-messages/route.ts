import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { use } from "react";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if(!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "You are not authenticated"
        }),{status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id); // Convert the user id to a mongoose ObjectId from a STRING

    try {
        
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort : { "messages.createdAt" : -1 } },
            { $group: {_id : '$_id', messages: { $push: '$messages' } }}
        ])

        if(!user || user.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                messages: "User not found"
            }),{status: 401})
        }

        return new Response(JSON.stringify({
            success: true,
            messages: user[0].messages
        }),{status: 200})

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            messages: "Error fetching messages"
        }),{status: 500})
    }

}