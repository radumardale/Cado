"use server"

import { revalidatePath } from "next/cache"

export const revalidateServerPath = async (name: string) => {
    revalidatePath(name);
}