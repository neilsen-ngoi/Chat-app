'use client'

import { useEffect, useMemo, useState } from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { find } from 'lodash'

import { User } from '@prisma/client'
import useConversation from '@/app/hooks/useConversation'
import { FullConversationType } from '@/app/types'
import ConversationBox from './ConversationBox'
import GroupChatModal from './GroupChatModal'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/app/libs/Pusher'

interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems, users
}) => {
  const [items, setItems] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { conversationId, isOpen } = useConversation()
  const session = useSession()
  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  useEffect(() => {
    if (!pusherKey) {
      return
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current
        }
        return [conversation, ...current]
      })
    }

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return { ...currentConversation, messages: conversation.messages }
        }
        return currentConversation
      }))
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
      })
      if (conversationId === conversation.id) {
        router.push('/conversations')
      }
    }

    //server
    pusherClient.subscribe(pusherKey)
    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:update', updateHandler)
    pusherClient.bind('conversation:remove', removeHandler)
    return () => {
      // client
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind("conversation:new", newHandler)
      pusherClient.unbind('conversation:update', updateHandler)
      pusherClient.unbind('conversation:remove', removeHandler)
    }
  }, [pusherKey, conversationId, router])


  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <aside
        className={clsx(
          `
    fixed
    inset-y-0
    pb-20
    lg:pb-0 
    lg:left-20
    lg:w-80
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
    `,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="text-xl
          font-bold text-neutral-800"
            >
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
          rounded-full
          text-gray-600
          p-2 bg-gray-100
          cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  )
}

export default ConversationList
