import { workspaceInvite } from "@/actions/workspaces";
import { supabaseServerClient } from "@/supabase/supabaseServerClient";
import { redirect } from "next/navigation";

const InvitePage = async ({params: {invite: inviteCode}}:{params: {invite: string}}) => {
    await workspaceInvite(inviteCode);
    const supabase = await supabaseServerClient();
    const {data} = await supabase.from('workspaces').select('*').eq('invite_code', inviteCode).single();
    if(data){
        redirect(`workspace/${data.id}`);
    }else{
        redirect('/create-workspace');
    }
    return(
        <div>InvitePage</div>
    )
}

export default InvitePage;