import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    // additional elements for group chats
    const {
      userId, //one-on-one convo
      isGroup, // group chats
      memebers,
      name,
    } = body
    if (!currentUser?.id || currentUser?.email) {
      return new NextResponse('Unathorized', { status: 401 })
    }
    if (isGroup && (!memebers || memebers.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 })
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              // connect user by id
              ...memebers.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      })
      return NextResponse.json(newConversation)
    }
  } catch (error: any) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
