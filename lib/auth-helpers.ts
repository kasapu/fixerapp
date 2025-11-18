import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: true,
      professionalProfile: true,
    },
  })

  return user
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  return session
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth()

  if (session.user.role !== role) {
    throw new Error("Forbidden: Insufficient permissions")
  }

  return session
}

export async function requireCustomer() {
  return requireRole(UserRole.CUSTOMER)
}

export async function requireProfessional() {
  return requireRole(UserRole.PROFESSIONAL)
}

export async function requireAdmin() {
  return requireRole(UserRole.ADMIN)
}

export function hasRole(session: any, role: UserRole): boolean {
  return session?.user?.role === role
}

export function isCustomer(session: any): boolean {
  return hasRole(session, UserRole.CUSTOMER)
}

export function isProfessional(session: any): boolean {
  return hasRole(session, UserRole.PROFESSIONAL)
}

export function isAdmin(session: any): boolean {
  return hasRole(session, UserRole.ADMIN)
}
