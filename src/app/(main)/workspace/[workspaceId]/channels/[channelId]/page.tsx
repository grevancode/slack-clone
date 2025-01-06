import { getUserData } from "@/actions/get-user-data";
import { getCurrentWorkspaceData, getUserWorkspaceData } from "@/actions/workspaces";
import InfoSection from "@/components/info-section";
import Sidebar from "@/components/sidebar";
import Typography from "@/components/ui/typography";
import { redirect } from "next/navigation";
import {Workspace as UserWorkspace} from "@/types/app";
import { getUserWorkspaceChannels } from "@/actions/get-user-workspace-channels";
import ChatHeader from "@/components/chat-header";
import TextEditor from "@/components/text-editor";
import ChatGroup from "@/components/chat-group";

const ChannelId = async ({params : {workspaceId, channelId} }: {params: {
    workspaceId: string;
    channelId: string;
}}) => {
    const userData = await getUserData();
    if(!userData) return redirect("/auth");
    const [userWorkspaceData] = await getUserWorkspaceData(userData.workspaces!);
    const [currentWorkspaceData] = await getCurrentWorkspaceData(workspaceId);
    const userWorkspaceChannels = await getUserWorkspaceChannels(currentWorkspaceData.id, userData.id);
    const currentChannelData = userWorkspaceChannels.find(channel => channel.id === channelId);
    if(!currentChannelData) return redirect("/");


    return(
        <div className="hidden md:block">
            <ChatGroup 
                type="Channel" 
                userData={userData} 
                currentChannelData={currentChannelData} 
                currentWorkspaceData={currentWorkspaceData} 
                slug={workspaceId} 
                chatId={channelId} 
                userWorkspaceChannels={userWorkspaceChannels} 
                socketUrl="/api/web-socket/messages"
                socketQuery={{channelId: currentChannelData.id, workspaceId: currentWorkspaceData}}
                apiUrl="/api/messages"
                headerTitle={currentChannelData.name}
                paramKey="channelId"
                paramvalue={channelId}
                userWorkspaceData={userWorkspaceData as UserWorkspace[]}
            />
        </div>
    )
}

export default ChannelId;

