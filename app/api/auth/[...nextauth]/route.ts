import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import prisma from '@/app/libs/prismadb'

// login authentication for Github and google
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // loging authentication with email
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      //  check login for email and password
      async authorize(credentials) {
        // check if email and password has been passed into form
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials')
        }
        // if yes, continue search for user
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })
        // check if user exist
        /* use case, user has not registered up with email, instead with git or google and has not
        therefore set a unique password
        */
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials')
        }
        //check if inputed password matches what is database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        if (!isCorrectPassword) {
          throw new Error('Invalid Credentials')
        }
        // if all checks pass then return user
        return user
      },
    }),
  ],
  // useful info for debugging
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
// required since route handler is located in api folder based on docs
export { handler as GET, handler as POST }
