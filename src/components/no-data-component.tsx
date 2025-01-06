"use client";

import { FC, useState } from "react";
import Typography from "./ui/typography";
import { Button } from "./ui/button";
import CreateChannelDialog from "./create-channel-dialog";

const NoDataScreen : FC<{
    workspaceName: string;
    userId: string;
    workspaceId: string;
}> = ({userId, workspaceId, workspaceName}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    return(
        <div className="w-full h-[calc(100vh-63px)] p-4">
            <Typography text={`Welcome to # ${workspaceName} workspace`} variant="h3" />
            <Typography text="Get Started by creating a channel or  direct message" variant="p" className="my-3" />
            <div className="w-fit">
                <Button className="w-full my-2" onClick={() => setDialogOpen(true)}>
                    <Typography text="Create Channel" variant="p" />
                </Button>
            </div>
            <CreateChannelDialog userId={userId} workspaceId={workspaceId} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    )
}

export default NoDataScreen;