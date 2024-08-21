import {Message} from "@/model/message";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessages ?: boolean,
    messages?: Array<Message>
}