import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface Iparams {
  conversationId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: Iparams }
) {
  try {
    const { conversationId } = params

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    if (!existingConversation) {
      return new NextResponse('invalid ID', { status: 400 })
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    })

    return NextResponse.json(deleteConversation)
  } catch (error: any) {
    console.log(error, 'Error_conversation_delete')
    return new NextResponse('Internal', { status: 500 })
  }
}
