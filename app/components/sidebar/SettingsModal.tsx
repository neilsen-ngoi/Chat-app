'use client'

import { User } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Result } from "postcss"
import { useState } from "react"
import { FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Modal from "../Modal"

interface SettingsModalProps {
  currentUser: User
  isOpen?: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentUser, isOpen, onClose, }) => {
  //hooks
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: {
    errors
  } } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  })
  // 
  const image = watch('image')
  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, { shouldValidate: true })
  }

  const onsubmit: SubmitHandler<FieldValues> = (data) => {
    axios.post('/api/settings', data)
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error('something has gone wrong'))
      .finally(() => setIsLoading(false))
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className="space-y-12 ">
          <div className=" border-b border-gray-900/10 pb-12">
            <h2 className=" text-base font-semibold leading-7 text-gray-900 ">Profile</h2>
            <p className=" mt-1 text-sm leading-6 text-gray-600">Edit your info</p>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal