import { getUserData } from "@/actions/get-user-data";
import { getUserWorkspaceChannels } from "@/actions/get-user-workspace-channels";
import { getUserWorkspaceData } from "@/actions/workspaces";
import { getCurrentWorkspaceData } from "@/actions/workspaces";
import InfoSection from "@/components/info-section";
import NoDataScreen from "@/components/no-data-component";
import Sidebar from "@/components/sidebar";
import { Workspace as UserWorkspace } from "@/types/app";
import { redirect } from "next/navigation";
import React from "react";

const Workspace = async ({params: {workspaceId}}: {params: {workspaceId: string}}) => {
    const userData = await getUserData();
    if(!userData) return redirect("/auth");
    const [userWorkspaceData, userWorkspaceError] = await getUserWorkspaceData(userData.workspaces!);
    const [currentWorkspaceData, currentWorkspaceError] = await getCurrentWorkspaceData(workspaceId);
    console.log(currentWorkspaceData)
    const userWorkspaceChannels = await getUserWorkspaceChannels(
        currentWorkspaceData.id,
        userData.id,

    )
    console.log(userWorkspaceChannels)
    //if(userWorkspaceChannels.length){
        //redirect(`/workspace/${workspaceId}/channels/${userWorkspaceChannels[0].id}`);
    //}
    return(
        <>
            <div className="hidden md:block">
                <Sidebar currentWorkspaceData={currentWorkspaceData} userData={userData} userWorkspacesData={userWorkspaceData as UserWorkspace[]} />
            </div>
            <InfoSection currentWorkspaceData={currentWorkspaceData} userData={userData} userWorkspaceChannels={userWorkspaceChannels} currentChannelId="" />
            <NoDataScreen userId={userData.id} workspaceId={currentWorkspaceData.id} workspaceName={currentWorkspaceData.name} />
            <div className="md:hidde block min-h-screen">
                Mobile
            </div>
        </>
    );
}

export default Workspace;