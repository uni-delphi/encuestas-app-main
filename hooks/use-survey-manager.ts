// hooks/use-survey-manager.ts
import { useState } from "react";
import { Survey, Tecnologias, Enunciados, Question } from "@/generated/prisma";
import {
  type SurveyFormValues,
} from "@/components/survey/survey-form";
import { type QuestionFormValues } from "@/lib/schemas/question";
import { createEnunciado, createTecnologia, updateEncuesta, updateEnunciado, updateTecnologia } from "@/lib/actions";
import { TecnologiaFormValues } from "@/components/technology/technology-form";
import { StatementFormValues } from "@/components/statement/statement-form";

type TecnologiaWithEnunciados = Tecnologias & { enunciados: Enunciados[] };

export function useSurveyManager(
  encuesta: (Survey & { tecnologias: (Tecnologias & { enunciados: Enunciados[] })[] }) | null
) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [tecnologias, setTecnologias] = useState<Tecnologias[]>([]);
  const [statements, setStatements] = useState<Enunciados[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // ── UI state ──────────────────────────────────────────────────────
  const [showTechForm, setShowTechForm] = useState(false);
  const [showStatementForm, setShowStatementForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTech, setEditingTech] = useState<Tecnologias | null>(null);
  const [editingStatement, setEditingStatement] = useState<Enunciados | null>(
    null,
  );

  // ── Derived data ──────────────────────────────────────────────────
  const statementsForList: (Enunciados & { tecnologiaTitle: string })[] =
    encuesta?.tecnologias.flatMap((t) =>
      t.enunciados.map((e) => ({ ...e, tecnologiaTitle: t.title })),
    ) ?? [];

  // ── Survey ────────────────────────────────────────────────────────
  const handleSurveySubmit = (sureyData: SurveyFormValues & any) => {
    const {id} = sureyData;
    
    updateEncuesta(id, sureyData.data);

  };

  // ── Tecnologías ───────────────────────────────────────────────────
  const handleAddTecnologia = async (data: TecnologiaFormValues & any) => {
    try {
      if (editingTech) {

        const resp = await updateTecnologia({
          ...data,
          id: editingTech.id,
        } as Tecnologias);

        setTecnologias((prev) =>
          prev.map((t) => (t.id === editingTech.id ? { ...t, ...data } : t)),
        );
        setEditingTech(null);
      } else {
        const resp = await createTecnologia({ ...data } as Tecnologias);

        setTecnologias((prev) => [...prev, resp]);
        setShowTechForm(false);
      }
    } catch (error) {
      console.error("Error adding tecnologia:", error);
    }
  };

  const handleDeleteTecnologia = (id: number) => {
    setTecnologias((prev) => prev.filter((t) => t.id !== id));
    const orphanIds = statements
      .filter((s) => s.tecnologiaId === id)
      .map((s) => s.id);
    setStatements((prev) => prev.filter((s) => s.tecnologiaId !== id));
    setQuestions((prev) => prev.filter((q) => !orphanIds.includes(q.id)));
  };

  const handleEditTecnologia = (tech: Tecnologias) => {
    setEditingTech({ ...tech, slug: tech.slug ?? null });
    setShowTechForm(false);
  };

  // ── Enunciados ────────────────────────────────────────────────────
  const handleAddStatement = async (data: StatementFormValues & any) => {
    try {
      if (editingStatement) {
        const resp = await updateEnunciado({
          ...data,
          id: editingStatement.id,
        } as Enunciados);
        setEditingStatement(null);
      } else {
        const resp = await createEnunciado({ ...data, tecnologiaId: Number(data.tecnologiaId) } as Enunciados);
        setStatements((prev) => [...prev, resp]);
        setShowStatementForm(false);
      }
    } catch (error) {
      console.error("Error adding statement:", error);
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

  const handleDisplayQuestion = (id: number) => {
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
    // handlers
    handleSurveySubmit,
    handleAddTecnologia,
    handleDeleteTecnologia,
    handleEditTecnologia,
    handleAddStatement,
    handleDeleteStatement,
    handleEditStatement,
    handleAddQuestion,
    handleDisplayQuestion,
  };
}
