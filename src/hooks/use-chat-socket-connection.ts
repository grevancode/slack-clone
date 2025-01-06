import { useSocket } from "@/providers/web-socket";
import { MessageWithUser } from "@/types/app";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type useChatSocketConnectionProps = {
    addKey: string;
    queryKey: string;
    updateKey: string;
    paramValue: string;
}

export const useChatSocketConnection = ({addKey, queryKey, updateKey, paramValue}: useChatSocketConnectionProps) => {
    const {socket} = useSocket();
    const queryClient = useQueryClient();
    const handleUpdateMessage = (message:any) => {
        queryClient.setQueryData([queryKey, paramValue], (prev:any) => {
            if(!prev || !prev.pages || !prev.pages.lenght){
                return prev;
            }
            const newData = prev.pages.map((page:any) => ({
                ...page,
                data: page.data.map((data:MessageWithUser) => {
                    if(data.id === message.id){
                        return message;
                    }
                    return data;
                }),
            }));
            return {
                ...prev,
                pages: newData,
            };
        });
    };
    const handleNewMessage = (message:MessageWithUser) => {
        queryClient.setQueryData([queryKey, paramValue], (prev: any) => {
            if(!prev || !prev.pages || prev.pages.lenght === 0) return prev;
            const newPages = [...prev.pages];
            newPages[0] = {
                ...newPages[0],
                data: [message, ...newPages[0].data],
            };
            return{
                ...prev,
                pages: newPages,
            };
        });
    };
    useEffect(() => {
        if(!socket) return;
        socket.on(updateKey, handleUpdateMessage);
        socket.on(addKey, handleNewMessage);
        return () => {
            socket.off(updateKey, handleUpdateMessage);
            socket.off(addKey, handleNewMessage);
        };
    }, [addKey, queryClient, queryKey, socket, updateKey]);
};