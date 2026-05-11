import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const generateTokenFromSlug = (slug: string): string => {
  // Codifica el slug en base64 y añade un identificador único
  const timestamp = Date.now().toString(36);
  const random = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encodedSlug = btoa(slug);
  return `${encodedSlug}.${timestamp}.${random}`;
} //revertir para verificar si existe esa encuesta y si el token es valido desp asignar a la encuesta con la tabla de relacion  

}

/*
export async function POST(req: NextRequest) {
  try {
    const { u, n, t } = await req.json();

    const response = await fetch(
      `${process.env.BASE_URL}/api/user/user_pass_reset.json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: u,
          hashed_pass: t,
          timestamp: n,
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al verificar el usuario" },
        { status: response.status },
      );
    }

    const result = await response.json();

    // ✅ Capturamos la cookie que setea el servidor externo
    const setCookieHeader = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json({ ...result, setCookieHeader });

    // ✅ La reenviamos al browser para que quede disponible en el cliente
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: "Error inesperado consulte al administrador", details: String(error) },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    const getHeaderToken = await fetch(
      `${process.env.BASE_URL}/services/session/token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Cookie: `${data.setCookieHeader.split(";")[0]}`,
        },
      },
    );

    const tokenResult = await getHeaderToken.text();

    if (!tokenResult) {
      return NextResponse.json({
        error: "Error inesperado al obtener el token",
        details: tokenResult,
      });
    }
    
    const getProfileRes = await fetch(
      `${process.env.BASE_URL}/api/user/${data.u}.json?pass-reset-token=${data.pass_reset_token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": tokenResult as string,
          Cookie: `${data.setCookieHeader.split(";")[0]}`,
        },
        body: JSON.stringify({ pass: data.newPassword }),
      },
    );

    const result = await getProfileRes.json();

    if (!result) {
      return NextResponse.json(
        {
          error: "Error inesperados con la actualización de la contraseña",
          details: result?.statusText,
        },
        { status: result?.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error inesperado consulte al administrador", details: error },
      { status: 500 },
    );
  }
}
*/