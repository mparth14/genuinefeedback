import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";

export async function POST(request:Request) {
    await dbConnect()
    
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: 'User not found.'
            },{
                status: 404
            })
        }

        const isCodeValid = await user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeExpired){
            user.isVerified = true;
            await user.save()
            return Response.json({
                success: true,
                message: 'Account successfully verified.'
            },{
                status: 200
            })
        }
        else if(!isCodeExpired){
            return Response.json({
                success: false,
                message: 'Code is expired. Please try again'
            },{
                status: 400
            })
        }
        else{
            return Response.json({
                success: false,
                message: 'Incorrect verification code.'
            },{
                status: 400
            })
        }
    } catch (error) {
        console.error("Error verifying user! ", error);
        return Response.json({
            success: false,
            message: 'Error verifying user!'
        },{
            status: 500
        })
    }
}