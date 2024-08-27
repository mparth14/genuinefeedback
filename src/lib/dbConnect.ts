import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

export async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI as string || '')
        connection.isConnected = db.connections[0].readyState
    }
    catch(error){
        console.log("error: ", error);
        process.exit(1);
    }
}