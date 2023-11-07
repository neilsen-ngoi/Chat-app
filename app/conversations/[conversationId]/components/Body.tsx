'use client'
import MessageBox from './MessageBox'
import useConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import { useRef, useState } from 'react'

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages)
  console.log(messages)
  // scrolls to btm latest msg
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()
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
