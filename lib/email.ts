/**
 * Email utility functions
 *
 * TODO: Integrate with Resend or SendGrid for production
 * For now, this is a placeholder implementation
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  // In development, just log the email
  if (process.env.NODE_ENV === "development") {
    console.log("=== EMAIL ===")
    console.log("To:", options.to)
    console.log("Subject:", options.subject)
    console.log("HTML:", options.html)
    console.log("=============")
    return { success: true }
  }

  // TODO: Implement actual email sending with Resend
  // Example:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html,
  //   text: options.text,
  // })

  return { success: true }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  return sendEmail({
    to: email,
    subject: "Verify your email - ServiceHub",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify your email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to ServiceHub!</h1>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to ServiceHub! Please verify your email by visiting: ${verificationUrl}`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  return sendEmail({
    to: email,
    subject: "Reset your password - ServiceHub",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset your password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Reset your password</h1>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Reset your password by visiting: ${resetUrl}`,
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to ServiceHub!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to ServiceHub</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to ServiceHub, ${name}!</h1>
            <p>Your email has been verified and your account is now active.</p>
            <p>You can now:</p>
            <ul>
              <li>Find and hire local service professionals</li>
              <li>Get quotes from multiple providers</li>
              <li>Read reviews from other customers</li>
              <li>Save your favorite professionals</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Get Started
              </a>
            </div>
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Need help? Contact us at support@servicehub.com
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to ServiceHub, ${name}! Your account is now active.`,
  })
}
