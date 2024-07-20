import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { use } from "react";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if(!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "You are not authenticated"
        }),{status: 401})
    }

    const userId = user._id;

    const {acceptMessages} = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }),{status: 401})
        }

        return new Response(JSON.stringify({
            success: true,
            message: "User's message settings updated successfully"
        }),{status: 200})
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to update user's message settings"
        }),{status: 500})
    }
}

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

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }),{status: 404})
        }
    
        return new Response(JSON.stringify({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
            message: "User found",
        }),{status: 200})
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to get user's message settings"
        }),{status: 500})
    }
        
}