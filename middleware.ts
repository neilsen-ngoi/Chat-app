import { withAuth } from 'next-auth/middleware'

// protecting the routes
export default withAuth({
  pages: {
    signIn: '/',
  },
})

export const config = {
  matcher: ['/users/:path*', '/conversations/:path*'],
}
