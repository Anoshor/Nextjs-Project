import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { use } from "react";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}:{
    params: {mid:string}
}) {

    const messageid = params.mid;
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
        const updatedres = await UserModel.updateOne(
            {_id : userId},
            {$pull: {messages: {_id: messageid}}}
        )

        if(updatedres.modifiedCount === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "Message not found"
            }),{status: 404})
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Message deleted"
        }),{status: 200})


    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: "Error deleting message"
        }),{status: 500})
    }


}