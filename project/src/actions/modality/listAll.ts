import { prisma } from "@/lib/prisma"

export const listAllModalities = async () => {
    return prisma.modality.findMany()
}