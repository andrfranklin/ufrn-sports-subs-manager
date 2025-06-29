'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createModality(name: string) {
  try {
    const modality = await prisma.modality.create({
      data: {
        name
      }
    })

    revalidatePath('/modalities')
    return { success: true, data: modality }
  } catch (error) {
    console.error('Error creating modality:', error)
    return { success: false, error: 'Failed to create modality' }
  }
}

export async function getModalities() {
  try {
    const modalities = await prisma.modality.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, data: modalities }
  } catch (error) {
    console.error('Error fetching modalities:', error)
    return { success: false, error: 'Failed to fetch modalities' }
  }
}

export async function deleteModality(id: string) {
  try {
    await prisma.modality.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    revalidatePath('/modalities')
    return { success: true }
  } catch (error) {
    console.error('Error deleting modality:', error)
    return { success: false, error: 'Failed to delete modality' }
  }
} 