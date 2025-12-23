import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/db"
import { verifyPassword, isValidEmail, sanitizeEmail } from "./lib/security"
import { checkRateLimit, getRemainingTime } from "./lib/rate-limit"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
  interface User {
    id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = sanitizeEmail(credentials.email as string)
        const password = credentials.password as string

        // Validação de email
        if (!isValidEmail(email)) {
          return null
        }

        // Rate limiting por email para prevenir brute force
        const rateLimitKey = `login:${email}`
        if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
          // Log apenas em desenvolvimento - não expor informação sensível
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `Rate limit excedido para ${email}. Tentar novamente em ${Math.ceil(getRemainingTime(rateLimitKey) / 60000)} minutos`
            )
          }
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        // Não revelar se o usuário existe ou não (timing attack mitigation)
        // Sempre executar verificação de hash mesmo se usuário não existir
        const dummyHash = "$2b$12$dummy.hash.to.prevent.timing.attacks"
        const hashToCheck = user?.password || dummyHash

        const passwordMatch = await verifyPassword(password, hashToCheck)

        if (!user || !passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})
