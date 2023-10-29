'use client'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'

interface DesktopItemProps {
  label: string
  icon: any
  href: string
  onClick?: () => void
  active?: boolean
}
// freaking sidebar stuff
const DesktopItem: React.FC<DesktopItemProps> = ({
  label, 
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  //why is this a thing
  const handleClick = () => {
    if (onClick) {
      return onClick()
    }
  }
  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
      group
      flex
      gap-x-3
      rounded-md
      p-3
      text-sm
      leading-6
      font-semibold
      text-gray-500
      hover:text-black
      hover:bg-gray-100
      `,
          active && 'bg-gray-100 text-black'
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        {/* hide the span and show only in server side, improve seo */}
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )
}

export default DesktopItem
