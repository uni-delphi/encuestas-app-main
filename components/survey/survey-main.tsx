"use client"

import { useState } from "react"
import { TechnologyForm, type TecnologiaWithSlug } from "@/components/technology/technology-form"
import { TechnologyList, type Tecnologia } from "@/components/technology/technology-list"
import { StatementForm, type StatementFormValues, type Statement } from "@/components/statement/statement-form"
import { StatementList } from "@/components/statement/statement-list"
import { SurveyForm, type SurveyFormValues, type Survey } from "@/components/survey/survey-form"
import { SurveyList } from "@/components/survey/survey-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

export default function SurveyMain() {
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([])
  const [statements, setStatements] = useState<Statement[]>([])
  const [surveys, setSurveys] = useState<Survey[]>([])
  
  // Estados para mostrar/ocultar formularios
  const [showTechForm, setShowTechForm] = useState(false)
  const [showStatementForm, setShowStatementForm] = useState(false)
  const [showSurveyForm, setShowSurveyForm] = useState(false)

  const handleAddTecnologia = (data: TecnologiaWithSlug) => {
    const now = new Date()
    const newTech: Tecnologia = {
      id: Date.now(),
      title: data.title,
      description: data.description || undefined,
      slug: data.slug,
      endDate: data.endDate,
      isActive: data.isActive,
      createdAt: now,
    }
    setTecnologias((prev) => [newTech, ...prev])
    setShowTechForm(false)
  }

  const handleDeleteTecnologia = (id: number) => {
    setTecnologias((prev) => prev.filter((tech) => tech.id !== id))
  }

  const handleAddStatement = (data: StatementFormValues & { slug: string }) => {
    const now = new Date()
    const selectedTech = tecnologias.find((t) => t.id === Number(data.tecnologiaId))
    const newStatement: Statement = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      slug: data.slug,
      tecnologiaId: Number(data.tecnologiaId),
      tecnologiaTitle: selectedTech?.title || "Desconocida",
      createdAt: now,
      updatedAt: now,
    }
    setStatements((prev) => [newStatement, ...prev])
    setShowStatementForm(false)
  }

  const handleDeleteStatement = (id: number) => {
    setStatements((prev) => prev.filter((s) => s.id !== id))
  }

  const handleAddSurvey = (data: SurveyFormValues & { slug: string }) => {
    const now = new Date()
    const newSurvey: Survey = {
      id: Date.now(),
      title: data.title,
      description: data.description || undefined,
      slug: data.slug,
      endDate: data.endDate,
      isActive: data.isActive,
      hasEnded: false,
      responseCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setSurveys((prev) => [newSurvey, ...prev])
    setShowSurveyForm(false)
  }

  const handleDeleteSurvey = (id: number) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id))
  }

  const tecnologiasForSelect = tecnologias.map((t) => ({ id: t.id, title: t.title }))

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Gestor de Contenido
        </h1>
        
        <Tabs defaultValue="tecnologias" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="tecnologias">Tecnologias</TabsTrigger>
            <TabsTrigger value="enunciados">Enunciados</TabsTrigger>
            <TabsTrigger value="encuestas">Encuestas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tecnologias">
            <div className="flex flex-col gap-6">
              {!showTechForm ? (
                <Button 
                  onClick={() => setShowTechForm(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Tecnologia
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowTechForm(false)}
                    className="absolute right-2 top-2 z-10"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar formulario</span>
                  </Button>
                  <TechnologyForm onSubmit={handleAddTecnologia} />
                </div>
              )}
              <TechnologyList
                tecnologias={tecnologias}
                onDelete={handleDeleteTecnologia}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="enunciados">
            <div className="flex flex-col gap-6">
              {!showStatementForm ? (
                <Button 
                  onClick={() => setShowStatementForm(true)}
                  className="w-full"
                  disabled={tecnologias.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {tecnologias.length === 0 
                    ? "Crea una tecnologia primero" 
                    : "Nuevo Enunciado"
                  }
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowStatementForm(false)}
                    className="absolute right-2 top-2 z-10"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar formulario</span>
                  </Button>
                  <StatementForm
                    onSubmit={handleAddStatement}
                    tecnologias={tecnologiasForSelect}
                  />
                </div>
              )}
              <StatementList
                statements={statements}
                onDelete={handleDeleteStatement}
              />
            </div>
          </TabsContent>

          <TabsContent value="encuestas">
            <div className="flex flex-col gap-6">
              {!showSurveyForm ? (
                <Button 
                  onClick={() => setShowSurveyForm(true)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Encuesta
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSurveyForm(false)}
                    className="absolute right-2 top-2 z-10"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar formulario</span>
                  </Button>
                  <SurveyForm onSubmit={handleAddSurvey} />
                </div>
              )}
              <SurveyList
                surveys={surveys}
                onDelete={handleDeleteSurvey}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
