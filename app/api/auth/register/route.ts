import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations/auth"
import { sendVerificationEmail } from "@/lib/email"
import { UserRole, BusinessType } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 12)

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    // Create user and profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          role: validatedData.role,
          phone: validatedData.phone,
        },
      })

      // Create verification token
      await tx.verificationToken.create({
        data: {
          identifier: validatedData.email,
          token: verificationToken,
          type: "email_verification",
          expiresAt,
        },
      })

      // Create profile based on role
      if (validatedData.role === UserRole.CUSTOMER) {
        await tx.customerProfile.create({
          data: {
            userId: newUser.id,
            firstName: validatedData.firstName || "",
            lastName: validatedData.lastName || "",
          },
        })
      } else if (validatedData.role === UserRole.PROFESSIONAL) {
        await tx.professionalProfile.create({
          data: {
            userId: newUser.id,
            businessName: validatedData.businessName || "",
            businessType: BusinessType.INDIVIDUAL,
          },
        })
      }

      return newUser
    })

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
