import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not authenticated.'
        },{
            status: 401
        })
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: true},
            {new: true}
        )
        if(!updatedUser){
            console.log("Failed to update user status to update messages.")
            return Response.json({
                success: false,
                message: 'Failed to update user status to update messages!'
            },{
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: 'User accepting message updated successfully!',
            updatedUser
        },{
            status: 200
        })
    } catch (error) {
        console.log(".")
        return Response.json({
            success: false,
            message: 'Failed to update user status to update messages.'
        },{
            status: 500
        })
    }
}

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not authenticated.'
        },{
            status: 401
        })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById({userId: userId})
        if(!foundUser){
            console.log("Failed to find user.")
            return Response.json({
                success: false,
                message: 'Failed to find user!'
            },{
                status: 404
            })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
            message: 'User found!'
        },{
            status: 200
        })
    } catch (error) {
        console.log("Error finding user. ", error)
            return Response.json({
                success: false,
                message: 'Failed to find user!'
            },{
                status: 500
            })
    }
    
}