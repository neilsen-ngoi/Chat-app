import React from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import getUsers from '../actions/getUsers'
// specific layout for users page
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const users = await getUsers()
  return (
    // @ts=expect-error Server Component
    <Sidebar>
      <div className="h-full">
        {UserList items={users}}
        {children}</div>
    </Sidebar>
  )
}
