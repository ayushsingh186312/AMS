"use server"

import { db } from "@/lib/db"

export async function createRequest(userId: number, softwareId: number, accessType: string, reason: string) {
  try {
    // Check if user already has a pending request for this software
    const existingRequest = await db.request.findFirst({
      where: {
        userId,
        softwareId,
        status: "Pending",
      },
    })

    if (existingRequest) {
      return {
        success: false,
        error: "You already have a pending request for this software",
      }
    }

    await db.request.create({
      data: {
        userId,
        softwareId,
        accessType,
        reason,
        status: "Pending",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating request:", error)
    return { success: false, error: "Failed to create request" }
  }
}

export async function getUserRequests(userId: number) {
  try {
    const requests = await db.request.findMany({
      where: { userId },
      include: {
        software: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return requests
  } catch (error) {
    console.error("Error fetching user requests:", error)
    throw new Error("Failed to fetch requests")
  }
}

export async function getPendingRequests() {
  try {
    const requests = await db.request.findMany({
      where: { status: "Pending" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        software: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return requests
  } catch (error) {
    console.error("Error fetching pending requests:", error)
    throw new Error("Failed to fetch pending requests")
  }
}

export async function updateRequestStatus(requestId: number, status: "Approved" | "Rejected") {
  try {
    await db.request.update({
      where: { id: requestId },
      data: { status },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating request:", error)
    return { success: false, error: "Failed to update request" }
  }
}
