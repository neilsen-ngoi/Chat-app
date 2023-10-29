import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

// Registration functionality
export async function POST(request: Request) {
  try {
    // input should included: email, name, password
    const body = await request.json()

    console.log(body)
    const { email, name, password } = body

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }
    // //  store encrypted password
    const hashedPassword = await bcrypt.hash(password, 12)
    // // save inputed data to db
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })
    return NextResponse.json(user)
    // return new NextResponse('Ok')
  } catch (error: any) {
    console.log(error, 'REGISTRATION ERROR')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
