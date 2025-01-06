import { getUserData, getUserDataPages } from "@/actions/get-user-data";
import supabaseServerClientPages from "@/supabase/supabaseServerPage";
import { SocketIoApiResponse } from "@/types/app";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req:NextApiRequest,
    res:SocketIoApiResponse,
){
    if(!['DELETE', 'PATCH'].includes(req.method!)){
        return res.status(405).json({error: 'method not allowed'});
    }
    try{
        const userData = await getUserDataPages(req, res);
        if(!userData){
            return res.status(401).json({error: 'Unauthorized'});
        }
        const {messageId, channelId} = req.query as Record<string, string>;
        const {content} = req.body;
        const supabase = supabaseServerClientPages(req, res);
        const {data:messageData, error} = await supabase.from("messages").select("*, user: user_id (*)").eq('id', messageId).single();
        if(error || !messageData){
            return res.status(404).json({error: 'Message not found'});
        }
        const isMessageOwner = messageData.user_id === userData.id;
        const isAdmin = userData.type === "admin";
        const isRegulator = userData.type === "regulator";
        const canEditMessage = isMessageOwner || !messageData.is_deleted;
        if(!canEditMessage){
            return res.status(403).json({error: 'Fordiben'});
        }
        if(req.method === "PATCH"){
            if(!isMessageOwner){
                return res.status(403).json({error: 'Forbidden'});
            }
            await updateMessageContent(supabase, messageId, content);
        }else if(req.method === 'DELETE'){
            await deleteMessage(supabase, messageId);
        }
        const {data: updateMessage, error: messageError} = await supabase.from("messages").select("*, user: user_id (*)").order('created_at', {ascending: true}).eq('id', messageId).single();
        if(messageError || !updateMessage){
            return res.status(404).json({error: "Message not found"});
        }
        res?.socket?.server?.io?.emit(`channel:${channelId}:channel-messages:update`, updateMessage);
        return res.status(200).json({message: updateMessage});
    }catch(error){
        console.log("MESSAGE ID ERROR", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

async function updateMessageContent(supabase:SupabaseClient, messageId: string, content: string){
    await supabase.from('messages').update({
        content,
        updated_at: new Date().toISOString(),
    }).eq('id', messageId).select('*, user: user_id (*)').single();
}

async function deleteMessage(supabase:SupabaseClient, messageId: string){
    await supabase.from("messages").update({content: 'This message has been deleted', file_url: null, is_deleted: true}).eq('id', messageId).select('*, user: user_id (*)').single();
}