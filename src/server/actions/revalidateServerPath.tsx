"use server"

import { revalidatePath } from "next/cache"

export const revalidateServerPath = async (name: string, type?: "layout" | "page" | undefined) => {
    revalidatePath(name, type);
}