"use server";

import { createClient } from "@/utils/supabase/server";

export const getChats = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("error", error);

  if (error) {
    throw new Error(error.message);
  }

  console.log("data", data);

  return data;
}