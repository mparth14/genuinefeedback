import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) { 
    await dbConnect()

    try {
        const host = request.headers.get('host');
        const url = `https://${host}`; 
        const {searchParams} = new URL(request.url);        ;
        const queryParam = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: 'username format not valid'
            },{
            status: 400
            })
        }
        
        const {username} = result.data
        const isUsernameUniqueAndVerified = await UserModel.findOne({username,isVerified:true})
        if(isUsernameUniqueAndVerified){
            return Response.json({
                success: false,
                message: 'username is already taken'
            },{
            status: 400
            })
        }

        return Response.json({
            success: true,
            message: 'Username is available.'
        },{
        status: 200
        })

    } catch (error) {
        console.log('error establishsing connection to DB: ', error)
        return Response.json({
            success: false,
            message: 'error checking username'
        },{
        status: 500
        })
    }
}