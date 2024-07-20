import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { MessageSchema } from "@/schemas/messageSchema";
import {Message} from "@/model/User"


export async function POST(request: Request) {
    await dbConnect();

    const {username, content} = await request.json();

    try {
        
        const user = await UserModel.findOne({username});

        if(!user) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }),{status: 404})
        }

        //is user accepting

        if(!user.isAcceptingMessage) {
            return new Response(JSON.stringify({
                success: false,
                message: "User is not accepting messages"
            }),{status: 403})
        }


        const newMessage: Message = {content, createdAT : new Date()} as Message;

        user.message.push(newMessage as Message);

        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: "Message sent successfully"
        }),{status: 200})


    } catch (error) {
        console.log("Error sending message: ", error)
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to send message"
        }),{status: 500})
    }
}