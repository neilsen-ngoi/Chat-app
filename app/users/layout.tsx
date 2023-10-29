import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
// specific layout for users page
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // @ts=expect-error Server Component
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  )
}
