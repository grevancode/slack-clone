"use server";

import { supabaseServerClient } from "@/supabase/supabaseServerClient";
import {getUserData} from "./get-user-data";
import { updateUserWorkspace } from "./update-user-workspace";
import { addMemberToWorkspace } from "./add-member-to-workspace";

export const createWorkspace = async ({
    imageUrl,
    name,
    slug,
    invite_code,
}:{
    imageUrl?: string;
    name: string;
    slug: string;
    invite_code: string;
}) => {
    const supabase = await supabaseServerClient()
    const userData = await getUserData()
    if(!userData){
        return {error: 'No User data'};
    }
    const {error, data: workspaceRecord} = await supabase.from('workspaces').insert({
        image_url: imageUrl,
        name,
        super_admin: userData.id,
        slug,
        invite_code
    })
    .select('*');
    if(error){
        return {insertError: error};
    }
    const [updateUserWorkspaceData, updateUserWorkspaceError] = await updateUserWorkspace(userData.id, workspaceRecord[0].id);
    if(updateUserWorkspaceError){
        return {error: updateUserWorkspaceError};
    }

    const [addMemberToWorkspaceData, addMemberToWorkspaceError] = await addMemberToWorkspace(userData.id, workspaceRecord[0].id);
    if(addMemberToWorkspaceError){
        return {error: addMemberToWorkspaceError}
    } 


};