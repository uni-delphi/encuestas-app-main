"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, RefreshCw, Link, Check, Loader2 } from "lucide-react"
import { Survey } from "@/generated/prisma"
import { createInvitation } from "@/lib/actions"

interface GeneradorLinkEncuestaProps {
  encuestas: Survey[]
}

const BASE_URL = "https://prospectiva.campusnorte.unc.edu.ar/api/invitacion?t="

export function GeneradorLinkEncuesta({ encuestas }: GeneradorLinkEncuestaProps) {
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const [copiado, setCopiado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string>("")

  const linkGenerado = token ? `${BASE_URL}${token}` : ""
  const puedeGenerar = encuestaSeleccionada && email.includes("@") && !cargando

  const handleGenerar = useCallback(async () => {
    if (!encuestaSeleccionada || !email) return

    setCargando(true)
    setError("")

    try {
      const nuevoToken = await createInvitation(Number(encuestaSeleccionada), email)
      setToken(nuevoToken)
      setCopiado(false)
    } catch (err) {
      setError("Error al generar el link. Intentá de nuevo.")
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [encuestaSeleccionada, email])

  const copiarLink = useCallback(async () => {
    if (!linkGenerado) return
    try {
      await navigator.clipboard.writeText(linkGenerado)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }, [linkGenerado])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Generador de Link de Invitación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="encuesta">Encuesta</Label>
          <Select
            value={encuestaSeleccionada}
            onValueChange={(value) => {
              setEncuestaSeleccionada(value)
              setToken("")
            }}
          >
            <SelectTrigger id="encuesta">
              <SelectValue placeholder="Seleccionar encuesta..." />
            </SelectTrigger>
            <SelectContent>
              {encuestas.map((encuesta) => (
                <SelectItem key={encuesta.id} value={String(encuesta.id)}>
                  {encuesta.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email del usuario</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setToken("")
            }}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button onClick={handleGenerar} disabled={!puedeGenerar} className="w-full">
          {cargando ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar Link"
          )}
        </Button>

        {linkGenerado && (
          <div className="space-y-3 pt-4 border-t">
            <Label>Link generado</Label>
            <div className="p-3 bg-muted rounded-md break-all text-sm font-mono">
              {linkGenerado}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={copiarLink} className="flex-1">
                {copiado ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleGenerar} disabled={cargando} className="flex-1">
                {cargando ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerar Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}