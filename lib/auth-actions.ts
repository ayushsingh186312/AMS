"use server"

import { cookies } from "next/headers"
import { SignJWT } from "jose"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"

export async function signup(username: string, password: string) {
  try {
    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return { success: false, error: "Username already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with default role as Employee
    await db.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "Employee",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function login(username: string, password: string) {
  try {
    // Find user
    const user = await db.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { success: false, error: "Invalid username or password" }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, error: "Invalid username or password" }
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return { success: true, role: user.role }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Failed to login" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  return { success: true }
}
