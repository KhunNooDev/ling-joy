import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Enter your username' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }

        // Add your logic here to find the user and validate credentials
        const users = [
          {
            id: '1',
            name: 'User',
            email: 'user@example.com',
            username: 'user',
            password: 'password',
            role: 'User',
          },
          {
            id: '2',
            name: 'Admin',
            email: 'admin@example.com',
            username: 'admin',
            password: 'password',
            role: 'Admin',
          },
        ]
        const user = users.find((u) => u.username === credentials.username && u.password === credentials.password)
        if (user) {
          return user
        } else {
          // Redirect to error page if credentials are invalid
          throw new Error('Invalid username or password')
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token, user }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session // The return type will match the one returned in `useSession()`
    },
  },
  pages: {
    signIn: '/auth',
    signOut: '/auth',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
