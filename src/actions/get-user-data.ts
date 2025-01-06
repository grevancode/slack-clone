"use server";
import { supabaseServerClient } from "@/supabase/supabaseServerClient";
import supabaseServerClientPages from "@/supabase/supabaseServerPage";
import { User } from "@/types/app";
import { NextApiRequest, NextApiResponse } from "next";

export const getUserData = async (): Promise<User | null> => {
    const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('NO USER', user);
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id);

  if (error) {
    console.log(error);
    return null;
  }

  return data ? data[0] : null;
}

export const getUserDataPages = async (req: NextApiRequest, res: NextApiResponse): Promise<User | null> => {
  const supabase = supabaseServerClientPages(req, res);
  const {
    data: {user},} = await supabase.auth.getUser();
  if(!user){
    console.log('NO USER', user);
    return null;
  }
  const {data, error} = await supabase.from("users").select('*').eq('id', user.id);
  if(error){
    console.log(error);
    return null;
  }
  return data ? data[0] : null;
};


