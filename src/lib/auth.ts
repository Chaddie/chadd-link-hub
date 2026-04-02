import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (!process.env.DATABASE_URL) return null;

        try {
          const { prisma } = await import("./prisma");
          const bcrypt = await import("bcryptjs");
          if (!prisma) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user?.passwordHash) return null;

          const ok = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.email,
            isAdmin: user.isAdmin,
          };
        } catch (e) {
          console.error("Auth error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
