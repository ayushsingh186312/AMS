"use server"

import { db } from "@/lib/db"

export async function getSoftwareList() {
  try {
    const software = await db.software.findMany({
      orderBy: { name: "asc" },
    })
    return software
  } catch (error) {
    console.error("Error fetching software:", error)
    throw new Error("Failed to fetch software")
  }
}

export async function createSoftware(name: string, description: string, accessLevels: string[]) {
  try {
    await db.software.create({
      data: {
        name,
        description,
        accessLevels,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating software:", error)
    return { success: false, error: "Failed to create software" }
  }
}
