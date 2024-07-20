import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()

    try {

        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get("username") ///api/cuu?username=abc
        }

        //validate with zod
        const res = UserNameQuerySchema.safeParse(queryParam)

        console.log("res", res)

        if(!res.success) {
            const usernameError = res.error.format().username?._errors || []
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid username",
            }), {status: 400})
        }

        const {username} = res.data

        const existingVerifiedUser = await UserModel.findOne({username, isverified: true})

        if(existingVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "Username already exists",
            }), {status: 400})
        }

        else {
            return new Response(JSON.stringify({
                success: true,
                message: "Username is Unique",
            }), {status: 200})
        }

    } catch (error) {
        console.log("Error in check-username-unique GET route", error)
        return new Response(JSON.stringify({
            success: false,
            message: "Error in check-username-unique GET route"
        }), { status: 500 });
    }
}