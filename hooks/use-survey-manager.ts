// hooks/use-survey-manager.ts
import { useState } from "react";
import { Tecnologias, Enunciados } from "@/generated/prisma";
import { type TecnologiaWithSlug } from "@/components/technology/technology-form";
import { type StatementFormValues, type Statement } from "@/components/statement/statement-form";
import { type SurveyFormValues, type Survey } from "@/components/survey/survey-form";
import { type QuestionFormValues } from "@/lib/schemas/question";
import { Question } from "@/generated/prisma";

type TecnologiaWithEnunciados = Tecnologias & { enunciados: Enunciados[] };

export function useSurveyManager(
  encuesta: (Survey & { tecnologias: TecnologiaWithEnunciados[] }) | null
) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [tecnologias, setTecnologias] = useState<Tecnologias[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // ── UI state ──────────────────────────────────────────────────────
  const [showTechForm, setShowTechForm] = useState(false);
  const [showStatementForm, setShowStatementForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Tecnologias | null>(null);
  const [editingStatement, setEditingStatement] = useState<Enunciados | null>(null);

  // ── Derived data ──────────────────────────────────────────────────
  const statementsForList: (Enunciados & { tecnologiaTitle: string })[] =
    encuesta?.tecnologias.flatMap((t) =>
      t.enunciados.map((e) => ({ ...e, tecnologiaTitle: t.title }))
    ) ?? [];

  // ── Survey ────────────────────────────────────────────────────────
  const handleSurveySubmit = (data: SurveyFormValues) => {
    const now = new Date();
    setSurvey({
      id: survey?.id ?? Date.now(),
      title: data.title,
      description: data.description || undefined,
      endDate: data.endDate,
      isActive: data.isActive,
      hasEnded: false,
      responseCount: survey?.responseCount ?? 0,
      createdAt: survey?.createdAt ?? now,
      updatedAt: now,
    } as Survey);
  };

  // ── Tecnologías ───────────────────────────────────────────────────
  const handleAddTecnologia = (data: TecnologiaWithSlug) => {
    if (editingTech) {
      setTecnologias((prev) =>
        prev.map((t) => (t.id === editingTech.id ? { ...t, ...data } : t))
      );
      setEditingTech(null);
    } else {
      setShowTechForm(false);
    }
  };

  const handleDeleteTecnologia = (id: number) => {
    setTecnologias((prev) => prev.filter((t) => t.id !== id));
    const orphanIds = statements.filter((s) => s.tecnologiaId === id).map((s) => s.id);
    setStatements((prev) => prev.filter((s) => s.tecnologiaId !== id));
    setQuestions((prev) => prev.filter((q) => !orphanIds.includes(q.id)));
  };

  const handleEditTecnologia = (tech: Tecnologias) => {
    setEditingTech({ ...tech, slug: tech.slug ?? null });
    setShowTechForm(false);
  };

  // ── Enunciados ────────────────────────────────────────────────────
  const handleAddStatement = (data: StatementFormValues & { slug: string }) => {
    if (editingStatement) {
      // await updateStatement({ id: editingStatement.id, ...data })
      setEditingStatement(null);
    } else {
      // await createStatement(data)
      setShowStatementForm(false);
    }
  };

  const handleDeleteStatement = (id: number) => {
    setStatements((prev) => prev.filter((s) => s.id !== id));
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditStatement = (statement: Enunciados) => {
    setEditingStatement(statement);
    setShowStatementForm(false);
  };

  // ── Preguntas ─────────────────────────────────────────────────────
  const handleAddQuestion = (data: QuestionFormValues) => {
    setShowQuestionForm(false);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return {
    // state
    survey,
    tecnologias,
    statements,
    questions,
    statementsForList,
    // UI state
    showTechForm, setShowTechForm,
    showStatementForm, setShowStatementForm,
    showQuestionForm, setShowQuestionForm,
    editingTech, setEditingTech,
    editingStatement, setEditingStatement,
    // handlers
    handleSurveySubmit,
    handleAddTecnologia,
    handleDeleteTecnologia,
    handleEditTecnologia,
    handleAddStatement,
    handleDeleteStatement,
    handleEditStatement,
    handleAddQuestion,
    handleDeleteQuestion,
  };
}