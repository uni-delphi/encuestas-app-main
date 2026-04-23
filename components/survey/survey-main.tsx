"use client";

import { useSurveyManager } from "@/hooks/use-survey-manager";
import {
  TechnologyForm,
  type TecnologiaWithSlug,
} from "@/components/technology/technology-form";

import { TechnologyList } from "@/components/technology/technology-list";

import { Tecnologias, Enunciados } from "@/generated/prisma";
import {
  StatementForm,
  type StatementFormValues,
  type Statement,
} from "@/components/statement/statement-form";
import { StatementList } from "@/components/statement/statement-list";
import { QuestionForm } from "@/components/question/question-form";
import { QuestionFormValues } from "@/lib/schemas/question";

import QuestionList from "@/components/question/question-list";

import {
  SurveyForm,
  type SurveyFormValues,
  type Survey,
} from "@/components/survey/survey-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { Question } from "@/generated/prisma";

type TecnologiaWithEnunciados = Tecnologias & {
  enunciados: Enunciados[];
};

export default function SurveyMain({
  encuesta,
}: {
  encuesta: (Survey & { tecnologias: TecnologiaWithEnunciados[] }) | null;
}) {
  console.log("🚀 ~ SurveyMain ~ encuesta:", encuesta);

  const {
    survey,
    questions,
    statementsForList,
    showTechForm,
    setShowTechForm,
    showStatementForm,
    setShowStatementForm,
    showQuestionForm,
    setShowQuestionForm,
    editingTech,
    setEditingTech,
    editingStatement,
    setEditingStatement,
    handleSurveySubmit,
    handleAddTecnologia,
    handleDeleteTecnologia,
    handleEditTecnologia,
    handleAddStatement,
    handleDeleteStatement,
    handleEditStatement,
    handleAddQuestion,
    handleDeleteQuestion,
  } = useSurveyManager(encuesta);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">
          Gestor de Contenido
        </h1>

        {/* ── Encuesta: siempre visible ── */}
        <section className="space-y-2">
          <div className="flex gap-4">
            <div className="w-1/3">
              <SurveyForm
                onSubmit={handleSurveySubmit}
                defaultValues={encuesta}
              />
            </div>
            <div className="w-2/3">
              {/* ── Jerarquía de contenido ── */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Contenido de la encuesta
                </h2>

                <Tabs defaultValue="tecnologias" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tecnologias">
                      Tecnologías
                      {encuesta && (
                        <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {encuesta?.tecnologias.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="enunciados"
                      disabled={encuesta?.tecnologias.length === 0}
                    >
                      Enunciados
                      {encuesta && (
                        <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {statementsForList.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="preguntas"
                      disabled={StatementList.length === 0}
                    >
                      Preguntas
                      {questions.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {questions.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab: Tecnologías */}
                  <TabsContent value="tecnologias">
                    <div className="flex flex-col gap-6 pt-4">
                      {showTechForm || editingTech ? (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setShowTechForm(false);
                              setEditingTech(null); // 👈 limpia ambos
                            }}
                            className="absolute right-2 top-2 z-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <TechnologyForm
                            onSubmit={handleAddTecnologia}
                            defaultValues={
                              editingTech
                                ? {
                                    ...editingTech,
                                    slug: editingTech.slug ?? undefined,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowTechForm(true)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nueva Tecnología
                        </Button>
                      )}
                      <TechnologyList
                        tecnologias={encuesta?.tecnologias ?? []}
                        onDelete={handleDeleteTecnologia}
                        onEdit={(tech) => {
                          setEditingTech({
                            ...tech,
                            slug: tech.slug ?? null, // 👈 null → undefined
                          });
                          setShowTechForm(false);
                        }}
                        /*onSelect={(id) => {
                    setSelectedTecnologiaId(id);
                    setActiveTab("enunciados"); // navega automáticamente
                  }}*/
                      />
                    </div>
                  </TabsContent>

                  {/* Tab: Enunciados */}
                  <TabsContent value="enunciados">
                    <div className="flex flex-col gap-6 pt-4">
                      {showStatementForm || editingStatement ? ( // 👈 igual que tecnologías
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setShowStatementForm(false);
                              setEditingStatement(null); // 👈 limpia ambos
                            }}
                            className="absolute right-2 top-2 z-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <StatementForm
                            onSubmit={handleAddStatement}
                            tecnologias={encuesta?.tecnologias ?? []}
                            defaultValues={
                              editingStatement
                                ? {
                                    ...editingStatement,
                                    slug: editingStatement.slug ?? undefined,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowStatementForm(true)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nuevo Enunciado
                        </Button>
                      )}

                      <StatementList
                        enunciados={statementsForList}
                        onDelete={handleDeleteStatement}
                        onEdit={(statement) => {
                          setEditingStatement(statement);
                          setShowStatementForm(false);
                        }}
                      />
                    </div>
                  </TabsContent>

                  {/* Tab: Preguntas */}
                  <TabsContent value="preguntas">
                    <div className="flex flex-col gap-6 pt-4">
                      {!showQuestionForm ? (
                        <Button
                          onClick={() => setShowQuestionForm(true)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nueva Pregunta
                        </Button>
                      ) : (
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowQuestionForm(false)}
                            className="absolute right-2 top-2 z-10"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cerrar formulario</span>
                          </Button>
                          <QuestionForm
                            onSubmit={handleAddQuestion}
                            statements={statementsForList as any[]}
                          />
                        </div>
                      )}
                      <QuestionList
                        questions={questions}
                        onDelete={handleDeleteQuestion}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
