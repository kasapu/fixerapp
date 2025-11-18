import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      })

      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
      include: {
        customerProfile: true,
        professionalProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    })

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    })

    // Send welcome email
    const userName = user.customerProfile
      ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
      : user.professionalProfile?.businessName || "User"

    await sendWelcomeEmail(user.email, userName)

    return NextResponse.json(
      {
        message: "Email verified successfully! You can now log in.",
        success: true,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Email verification error:", error)

    return NextResponse.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification token", valid: false },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Verification token has expired", valid: false },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { valid: true, email: verificationToken.identifier },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Token validation error:", error)

    return NextResponse.json(
      { error: "An error occurred", valid: false },
      { status: 500 }
    )
  }
}
