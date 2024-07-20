import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername});

        if(!user) {
            // console.log("Error in check-username-unique GET route", errorr)
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 500 });
        }

        const valid = user.verifyCode === code && new Date(user.verifycodeExpire) > new Date()
        if(valid) {
            user.isverified = true
            await user.save()

            return new Response(JSON.stringify({
                success: true,
                message: "User verified successfully"
            }), {status: 200})
        } else if(user.verifyCode !== code) {
            return new Response(JSON.stringify({
                success: false,
                message: "Invalid code"
            }), {status: 400})
        } else {         
            return new Response(JSON.stringify({
                success: false,
                message: "Code expired"
            }), {status: 400})
        }


    } catch (error) {
        console.log("Error Verifying user", error)
        return new Response(JSON.stringify({
            success: false,
            message: "Error verifying user"
        }), { status: 500 });
    }
}

