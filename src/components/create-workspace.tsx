"use client";

import { FaPlus } from "react-icons/fa";
import { Button } from "./ui/button";
import Typography from "./ui/typography";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { Input } from "./ui/input";
import ImageUpload from "./imagen-upload";
import slugify from "slugify";
import {v4 as uuidv4} from "uuid";
import { createWorkspace } from "@/actions/create-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { useState } from "react";

const CreateWorkspace = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const {imageUrl, updateImageUrl} = useCreateWorkspaceValues()
    const formSchema = z.object({
        name: z.string().min(2, {message: "Workspace namebe at least 2 characters long",}),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {}
    })
    async function onSubmit({name}: z.infer<typeof formSchema>){
        const slug = slugify(name, {lower: true});
        const invite_code = uuidv4();
        setIsSubmitting(true);
        const result = await createWorkspace({name, slug, invite_code, imageUrl});
        setIsSubmitting(false);
        if(result?.error){
            console.error(result.error);
        }
        form.reset();
        updateImageUrl('')
        router.refresh();
        toast.success('Workspace created successfully');
    }
    return(
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(prevValue => !prevValue)}>
            <DialogTrigger>
                
                <div className="flex items-center gap-2 p-2">
            <Button variant="secondary">
                <FaPlus />
            </Button>
            <Typography variant="p" text="Add Workspace" />
        </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-4">
                        <Typography variant="h4" text="Create a new workspace" />
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField control={form.control} name="name" render={({field}) => <FormItem>
                            <FormLabel>
                                <Typography text="Name" variant="p" />
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormDescription>
                                <Typography variant="p" text="This is the name of your workspace" />
                            </FormDescription>
                            <FormMessage />
                        </FormItem>}
                        />
                        <ImageUpload />
                        <Button type="submit" disabled={isSubmitting} >
                            <Typography variant="p" text="Submit" />
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        
    )
}

export default CreateWorkspace;