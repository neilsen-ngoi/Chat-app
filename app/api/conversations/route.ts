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
      members,
      name,
    } = body
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unathorized', { status: 401 })
    }
    if (isGroup && (!members || members.length < 3 || !name)) {
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
              ...members.map((member: { value: string }) => ({
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

    // one to one chat - finding existing conversation
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    })

    const singleConversation = existingConversations[0]
    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }
    // create new 1 to 1 conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    })
    return NextResponse.json(newConversation)
  } catch (error: any) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
