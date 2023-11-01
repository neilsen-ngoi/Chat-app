'use client'

import React, { useState } from 'react'
import useRoutes from '@/app/hooks/useRoutes'
import DesktopItem from './DesktopItem'
import Avatar from '@/app/components/Avatar'

// as defined in prisma schema
import { User } from '@prisma/client'

interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidbar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes()
  const [isOpen, setIsOpen] = useState(false)

  console.log({ currentUser })

  return (
    <div
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl-px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px]
  lg:pb-4 lg:flex lg:flex-col justify-between"
    >
      <nav className="mt-4 flex flex-col justify-between">
        <ul
          role="list"
          className="
          flex 
          flex-col 
          items-center 
          space-y-1"
        >
          {/* special component to map over the routes */}
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              label={item.label}
              href={item.href}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>
      </nav>
      <nav
        className="mt-4
      flex flex-col justify-between items-center"
      >
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer
        hover:opacity-75 transition"
        >
          <Avatar user={currentUser} />
        </div>
      </nav>
    </div>
  )
}

export default DesktopSidbar
