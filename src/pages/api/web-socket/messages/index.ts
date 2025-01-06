import { getUserDataPages } from "@/actions/get-user-data";
import supabaseServerClientPages from "@/supabase/supabaseServerPage";
import { SocketIoApiResponse } from "@/types/app";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:SocketIoApiResponse){
    if(req.method !== "POST") return res.status(405).json({message: 'Method not allowed'});
    try{
        const userData = await getUserDataPages(req,res);
        if(!userData){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const {channelId, workspaceId} = req.query;
        if(!channelId || !workspaceId){
            return res.status(400).json({message: 'Bad request'});
        }
        const {content, fileUrl} = req.body;
        const supabase = supabaseServerClientPages(req,res);
        const {data: channelData, error: channelError} = await supabase.from('channels').select('*').eq('id', channelId).contains("members", [userData.id]);
        if(!channelData?.length){
            return res.status(403).json({message: 'Channel not found'});
        }
        const {error: creatingMessageError, data} = await supabase.from("messages").insert({
            user_id: userData.id,
            workspace_id: workspaceId,
            channel_id: channelId,
            content,
            file_url: fileUrl,
        }).select('*, user: user_id(*)').order('created_at', {ascending: true}).single();
        if(creatingMessageError){
            console.log('MESSAGE CREATION ERROR: ', creatingMessageError);
            return res.status(500).json({message: 'Internal server error'});
        }
        res?.socket?.server?.io?.emit(`channel:${channelId}:channel-messages`, data);
        return res.status(201).json({message: 'Message created', data});
    }catch(error){
        console.log('MESSAGE CREATION ERROR: ', error);
        return res.status(500).json({message: 'Internal server error'});
        
    }
}