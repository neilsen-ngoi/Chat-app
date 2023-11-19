'use client'
import axios from 'axios'
import { useRef, useState, useEffect } from 'react'
import { find } from 'lodash'

import MessageBox from './MessageBox'
import { FullMessageType } from '@/app/types'
import useConversation from '@/app/hooks/useConversation'
import { pusherClient } from '@/app/libs/Pusher'
interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages)
  // scrolls to btm latest msg
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    // show latest message
    bottomRef?.current?.scrollIntoView()

    const messageHandler = (message: FullMessageType) => {
      setMessages((current) => {
        if (find(current, { id: message.id })) { return current }
        return [...current, message]
      })
    }

    pusherClient.bind('messages:new', messageHandler)
    // unmount
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          isLast={i === messages.length - 1}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}

export default Body
