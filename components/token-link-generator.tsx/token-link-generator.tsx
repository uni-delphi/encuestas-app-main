"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Link2, RefreshCw } from "lucide-react";
import { Survey } from "@/generated/prisma";
import { SurveyInvitation } from "../survey-invitation/survey-invitation";

// Datos de ejemplo - reemplaza con tus encuestas reales
// URL base hardcodeada - modifica aqui segun tu dominio
const BASE_URL = "https://prospectiva.campusnorte.unc.edu.ar/api/invitacion";

const surveys = [
  {
    id: "1",
    name: "Encuesta de Satisfacción",
    slug: "satisfaccion-cliente-2024",
  },
  { id: "2", name: "Feedback de Producto", slug: "feedback-producto-v2" },
  { id: "3", name: "Clima Laboral", slug: "clima-laboral-q1" },
  {
    id: "4",
    name: "Evaluación de Servicio",
    slug: "evaluacion-servicio-anual",
  },
];

function generateTokenFromSlug(slug: string): string {
  // Codifica el slug en base64 y añade un identificador único
  const timestamp = Date.now().toString(36);
  const random = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encodedSlug = btoa(slug);
  return `${encodedSlug}.${timestamp}.${random}`;
}

export function TokenLinkGenerator({ encuestas, usuarios }: any) {
  const [selectedSurvey, setSelectedSurvey] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedSurveyData = encuestas.find(
    (s: Survey & any) => s.id === +selectedSurvey,
  );

  const generatedLink = token
    ? `${BASE_URL}${BASE_URL.includes("?") ? "&" : "?"}p=${token}`
    : null;

  const handleGenerateToken = () => {
    if (!selectedSurveyData) return;
    setToken(generateTokenFromSlug(selectedSurveyData.slug));
    setCopied(false);
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateToken = () => {
    if (!selectedSurveyData) return;
    setToken(generateTokenFromSlug(selectedSurveyData.slug));
    setCopied(false);
  };

  const handleSurveyChange = (value: string) => {
    setSelectedSurvey(value);
    setToken(null);
    setCopied(false);
  };

  return (
    <>
      <Card className="w-full mb-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Generador de Enlace
          </CardTitle>
          <CardDescription>
            Selecciona una encuesta y genera un enlace con token unico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Encuesta
            </label>
            <Select value={selectedSurvey} onValueChange={handleSurveyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una encuesta" />
              </SelectTrigger>
              <SelectContent>
                {encuestas.map((survey: Survey) => (
                  <SelectItem key={survey.id} value={`${survey.id}`}>
                    <div className="flex flex-col items-start">
                      <span>{survey.title}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {survey.slug}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!token ? (
            <Button
              onClick={handleGenerateToken}
              className="w-full"
              disabled={!selectedSurvey}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Generar Token
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Enlace generado
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerateToken}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Regenerar
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={generatedLink || ""}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-emerald-600" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Encuesta seleccionada:
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSurveyData?.title}
                  </p>
                  <code className="text-xs font-mono text-muted-foreground">
                    {selectedSurveyData?.slug}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Token generado:
                  </p>
                  <code className="block text-sm font-mono break-all">
                    {token}
                  </code>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <SurveyInvitation encuesta={selectedSurveyData} usuarios={usuarios} />
    </>
  );
}
