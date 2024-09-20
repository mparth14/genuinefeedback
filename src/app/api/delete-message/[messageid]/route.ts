import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"

export async function DELETE(request: Request, {params} : {params: {messageid: string}}){
    
    const messageId = params.messageid
    
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

    try {
        const response = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(response.modifiedCount == 0){
            return Response.json({
                success: false,
                message: 'Not found or already deleted.'
            },{
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: 'Message successfully deleted.'
        },{
            status: 201
        })
    } catch (error) {
        console.error('error in delete message route', error)
        return Response.json({
            success: false,
            message: 'Error deleting message.'
        },{
            status: 500
        })
    }
}