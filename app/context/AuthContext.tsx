'use client'
import { SessionProvider } from 'next-auth/react'

interface AuthContextProps {
  children: React.ReactNode
}

import React from 'react'

export default function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}
