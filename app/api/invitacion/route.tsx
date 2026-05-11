// app/api/invitacion/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  console.log("🚀 ~ GET ~ searchParams:", searchParams)
  const token = searchParams.get("t")

  if (!token) {
    return NextResponse.redirect(new URL("/error?reason=token-missing", request.url))
  }

  const invitation = await prisma.surveyInvitation.findUnique({
    where: { token },
    include: { survey: true },
  })

  if (!invitation) {
    return NextResponse.redirect(new URL("/error?reason=token-invalido", request.url))
  }

  if (invitation.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/error?reason=token-expirado", request.url))
  }

  if (invitation.usedAt !== null) {
    return NextResponse.redirect(
      new URL(`/encuestas/${invitation.survey.slug}?reason=ya-utilizado`, request.url)
    )
  }

  // Redirigir pasando el token como contexto — la página de la encuesta
  // lo usa para identificar al respondente sin necesidad de cuenta
  return NextResponse.redirect(
    new URL(`/encuestas/${invitation.survey.slug}`, request.url)
  )
}