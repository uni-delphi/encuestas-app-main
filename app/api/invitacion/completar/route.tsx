// app/api/invitacion/completar/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 })
  }

  const invitation = await prisma.surveyInvitation.findUnique({
    where: { token },
  })

  if (!invitation || invitation.usedAt !== null) {
    return NextResponse.json({ error: "Invitación inválida o ya utilizada" }, { status: 400 })
  }

  await prisma.surveyInvitation.update({
    where: { token },
    data: { usedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}