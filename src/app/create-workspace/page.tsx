"use client";
import { createWorkspace } from "@/actions/create-workspace";
import ImagenUpload from "@/components/imagen-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/typography";
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";
import {v4 as uuid} from "uuid";
const  CreateWorkSpace = () => {
    const {currStep} = useCreateWorkspaceValues();
    let stepInView = null;
    switch(currStep){
        case 1:
            stepInView = <Step1 />;
            break;
        case 2: 
            stepInView = <Step2 />;
            break;
        default:
            stepInView = <Step1 />;
    }
    return(
        <div className="w-screen h-screen grid place-content-center bg-neutral-800 text-white">
            <div className="p-3 max-w-[550px]">
                <Typography text={`step ${currStep} of 2`} variant="p" className="mb-4" />
                {stepInView}
            </div>
        </div>
    )
}



export default CreateWorkSpace;
const Step1 = () => {
    const {name, updateValues, setCurrStep, imageUrl} = useCreateWorkspaceValues();
    return(
        <>
            <Typography text="What is the name of your company or team" className="my-4" />
            <Typography text="This will be the game of your Slackzz workspace - choose something that your team will recognize" className="text-neutral-300" variant="p" />
            <form className="mt-6">
                <fieldset>
                    <Input className="bg-neutral-700 text-white border-neutral-600" type="text" value={name} placeholder="Enter your company name" onChange={event => updateValues({name: event.target.value})} />
                    <Button onClick={() => setCurrStep(2)} type="button" className="mt-10" disabled={!name}>
                        <Typography text="Next" variant="p" />
                    </Button>
                </fieldset>
            </form>
        </>
    )
}

const Step2 = () => {
    const {setCurrStep, updateImageUrl, imageUrl, name} = useCreateWorkspaceValues();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const handleSubmit = async() => {
        setIsSubmitting(true);
        const slug = slugify(name);
        const invite_code = uuid();
        const error = await createWorkspace({imageUrl, name, slug, invite_code})
        setIsSubmitting(false);
        if(error?.error){
            setCurrStep(3);
            return toast.error("Couldn't create workspace, Please try again.")
        }
        toast.success("Workspace created successfully");
        router.push("/");
        
    };
    return(
        <>
            <Button size="sm" variant="link" onClick={() => setCurrStep(1)} className="text-white">
                <Typography text="Back" variant="p" />
            </Button>
            <form>
                <Typography text="Add workspace avatar" className="my-4" />
                <Typography text="This image can be changed later in your workspace settings." className="text-neutral-300" variant="p" />
                <fieldset className="mt-6 flex flex-col items-center space-y-9">
                    <ImagenUpload />
                    <div className="space-x-5">
                        <Button onClick={() => {
                            updateImageUrl('');
                            handleSubmit();
                        }}>
                            <Typography text="Skip for now" variant="p" />
                        </Button>
                        {imageUrl ? 
                            (
                                <Button variant="destructive" type="button" onClick={handleSubmit} size="sm">
                                    <Typography text="Submit" variant="p" />
                                </Button>
                            ) 
                            : 
                            (
                                <Button type="button" size="sm" className="text-white bg-gray-500">
                                    <Typography text="Select and Image" variant="p" />
                                </Button>
                            )}
                    </div>
                </fieldset>
            </form>
        </>
    )
}
