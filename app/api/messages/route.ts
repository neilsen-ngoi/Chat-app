import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { pusherServer } from '@/app/libs/Pusher'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const { message, image, conversationId } = body
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unathorized', { status: 401 })
    }
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    })

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    })

    await pusherServer.trigger(conversationId, 'messages:new', newMessage)
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1]

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversationUpdate', {
        id: conversationId,
        messages: [lastMessage],
      })
    })

    return NextResponse.json(newMessage)
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
