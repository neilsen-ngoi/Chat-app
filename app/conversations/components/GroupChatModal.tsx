'use client'

import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

import Modal from "@/app/components/Modal"
import { User } from "@prisma/client"

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users }) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: " ",
      members: []
    }
  })
  const members = watch('members')
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios.post('/api/conversations', { ...data, isGroup: true })
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error("something went wrong"))
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" space-y-12"></div>
      </form>

    </Modal>
  )
}

export default GroupChatModal