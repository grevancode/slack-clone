"use client";

import { Channel, User, Workspace } from "@/types/app";
import { FC, useEffect, useState } from "react";
import ChatHeader from "./chat-header";
import Typography from "./ui/typography";
import InfoSection from "./info-section";
import Sidebar from "./sidebar";
import TextEditor from "./text-editor";
import ChatMessages from "./chat-messages";
import SearchBar from "./search-bar";
import { useSearchParams } from "next/navigation";
import VideoChat from "./video-chat";

type ChatGroupProps = {
    type: 'Channel' | 'DirectMessage';
    socketUrl: string;
    apiUrl: string;
    headerTitle: string;
    chatId: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "recipientId";
    paramvalue: string;
    userData: User;
    currentWorkspaceData: Workspace;
    currentChannelData: Channel | undefined;
    userWorkspaceData: Workspace[];
    userWorkspaceChannels: Channel[];
    slug: string;
}

const ChatGroup:FC<ChatGroupProps> = ({
    apiUrl,
    chatId,
    headerTitle,
    paramKey,
    paramvalue,
    socketQuery,
    type,
    userData,
    currentWorkspaceData,
    currentChannelData,
    userWorkspaceChannels,
    userWorkspaceData,
    slug,
    socketUrl
    
}) => {
    const [isVideoCall, setIsVideoCall] = useState<boolean>(false);
    const searchParams = useSearchParams();
    useEffect(() => {
        const callParam = searchParams?.get('call');
        setIsVideoCall(callParam === "true");
    }, [searchParams, chatId]);
    return(
        <>
            {' '}
            <div className="h-[calc(100vh-256px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar]:w-2">
                <Sidebar currentWorkspaceData={currentWorkspaceData} userData={userData} userWorkspacesData={userWorkspaceData} />
                <InfoSection currentWorkspaceData={currentWorkspaceData} userData={userData} userWorkspaceChannels={userWorkspaceChannels} currentChannelId={
                    type === 'Channel' ? currentChannelData?.id : undefined
                } />
                <SearchBar currentWorkspaceData={currentWorkspaceData} currentChannelData={currentChannelData} loggedInUserId={userData.id} />
                <div className="p-4 relative w-full overflow-hidden">
                    <ChatHeader title={headerTitle} chatId={chatId} userData={userData} />
                    <div className="mt-10">
                        {!isVideoCall && (
                            <ChatMessages 
                            userData={userData} 
                            name={currentChannelData?.name ?? "USERNAME"} 
                            workspaceData={currentWorkspaceData} 
                            chatId={chatId} 
                            type={type} 
                            apiUrl={apiUrl} 
                            socketUrl={socketUrl} 
                            socketQuery={socketQuery} 
                            paramKey={paramKey}
                            paramValue={paramvalue}
                            channelData={currentChannelData}  
                        />
                        )}
                        {isVideoCall && <VideoChat chatId={type === "Channel" ?  currentChannelData?.id! : chatId} userData={userData} />}
                    </div>
                </div>
                
            </div>
            <div className="m-4">
                {!isVideoCall && <TextEditor apiUrl={socketUrl} recipientId={type === "DirectMessage" ? chatId : undefined} type={type} channel={currentChannelData} workspaceData={currentWorkspaceData} userData={userData}  />}
                
            </div>
        </>
    )
}

export default ChatGroup;