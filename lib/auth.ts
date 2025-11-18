import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            customerProfile: true,
            professionalProfile: true,
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Check if email is verified for login
        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          name:
            user.customerProfile
              ? `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
              : user.professionalProfile?.businessName || user.email,
          image:
            user.customerProfile?.profilePicture ||
            user.professionalProfile?.profilePicture ||
            null,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Create new user with Google account
          await prisma.user.create({
            data: {
              email: user.email!,
              passwordHash: "", // No password for OAuth users
              emailVerified: true, // Auto-verify OAuth emails
              emailVerifiedAt: new Date(),
              role: UserRole.CUSTOMER, // Default to customer
            },
          })
        } else if (!existingUser.emailVerified) {
          // Auto-verify email if signing in with Google
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              emailVerified: true,
              emailVerifiedAt: new Date(),
            },
          })
        }
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.emailVerified = token.emailVerified as boolean
      }

      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut({ session }) {
      console.log(`User signed out`)
    },
  },
  debug: process.env.NODE_ENV === "development",
}
