'use client'

import React from "react"

interface SelectProps {
  label: string
  value?: Record<string, any>
  onChange: (value: Record<string, any>) => void
  options: Record<string, any>[]
  disabled?: boolean
}
const Select: React.FC<SelectProps> = ({ label, value, onChange, options, disabled }) => {
  return (

    <div className=" z-[100]">
      <label className=" text-sm block font-medium leading-6 text-gray-600">
        {label}
      </label>
    </div>
  )
}

export default Select