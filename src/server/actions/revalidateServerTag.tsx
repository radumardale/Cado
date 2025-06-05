"use server"

import { revalidateTag } from "next/cache"

export const revalidateServerTag = async (name: string) => {
    revalidateTag(name);
}