import { NextResponse } from 'next/server'

import { pusherServer } from '@/app/libs/Pusher'
import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'

interface IParams {
  conversationId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()
    const { conversationId } = params
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unathourized', { status: 401 })
    }

    // find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse('Invalid', { status: 400 })
    }

    // find last msg
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (!lastMessage) {
      return NextResponse.json(conversation)
    }
    // update seen of last msg
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })
    // update all connections with new seen
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    })

    //if last user has already seen the message, no need to go futher
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation)
    }

    // update last message seen
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage
    )

    return new NextResponse('Success')
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_SEEN')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
