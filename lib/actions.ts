"use server";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

import { TUser, TLoginUser } from "@/types/user";

import { RoleType } from "@/generated/prisma";

import * as Users from "@/lib/api/users";
import * as Encuestas from "@/lib/api/encuestas";
import * as Respuestas from "@/lib/api/respuestas";
import { Enunciados, Survey, Tecnologias } from "@/generated/prisma";
import { redirectStrategy } from "@/lib/constants";

export async function createUser(data: TUser) {
  let user = null;
  try {
    const userData = await Users.getUserByEmail(data.email);

    if (userData) {
      return true;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const result = await Users.createUser(data);
    user = result.id;
  } catch (error) {
    console.log("Error creando el usuario:", error);
    throw new Error("Error creando el usuario");
  }
}

export async function loginUser(data: TLoginUser) {
  let eventId = null;
  let result = null;
  try {
    result = await Users.logInUser(data);
    eventId = result?.id;
  } catch (error) {
    console.log("Error login:", error);
    throw new Error("Error login");
  } finally {
    if (result) {
      redirect(redirectStrategy[result?.role]);
    }
  }

  revalidatePath("/dashboard");
}

export async function searchUsers(query: string) {
  try {
    return Users.searchUsersAction(query);
  } catch (error) {
    console.log("Error en search user:", error);
    throw new Error("Error en search user");
  }
}

export async function changeUserRole(userEmail: string, role: RoleType) {
  try {
    const response = await Users.changeUserRoleAction(userEmail, role);
    revalidatePath("/admin");
    return response;
  } catch (error) {
    console.log("Error en changeUserRole:", error);
    throw new Error("Error en changeUserRole");
  }
}

export async function assignUserToSurvey(surveyId: number, userId: string) {
  try {
    return Users.assignUserToSurvey(surveyId, userId);
  } catch (error) {
    console.log("Error en assignUserToSurvey:", error);
    throw new Error("Error en assignUserToSurvey");
  }
}

export async function removeUserFromSurvey(surveyId: number, userId: string) {
  try {
    return Users.removeUserFromSurvey(surveyId, userId);
  } catch (error) {
    console.log("Error en removeUserFromSurvey:", error);
    throw new Error("Error en removeUserFromSurvey");
  }
}

export async function getAllEncuestas() {
  try {
    const response = await Encuestas.getAllEncuestas();
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEncuestas", error);
  }
}

export async function getEncuestas(page = 0, pageSize = 10) {
  return await Encuestas.getEncuestasAction(page, pageSize);
}

export const getEncuestaById = cache(async (id: number) => {
  try {
    const response = await Encuestas.getEncuestaByIdAction({ id });
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getEncuesta by id", error);
  }
});

export const getFullEncuestaById = cache(async (id: number) => {
  try {
    const response = await Encuestas.getFullEncuestaByIdAction({ id });
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getEncuesta by id", error);
  }
});

export async function getMyEncuestas(page = 0, pageSize = 10) {
  try {
    const response = await Encuestas.getMyEncuestas(page, pageSize);
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getMyEncuestas", error);
  }
}

export async function getMyEncuestasByAssigned(page = 0, pageSize = 10) {
  try {
    const response = await Encuestas.getMyEncuestasByAssignedAction(
      page,
      pageSize,
    );
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getMyEncuestasByAssigned", error);
  }
}

export async function getEncuestaBySlug(slug: string) {
  try {
    return await Encuestas.getEncuestaBySlugAction(slug);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getEncuestaBySlug", error);
  }
}

export async function getFullEncuestaBySlug(slug: string) {
  try {
    return await Encuestas.getFullEncuestaBySlugAction(slug);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getEncuestaBySlug", error);
  }
}

export async function getAllEncuestasInfo() {
  try {
    return await Encuestas.getEncuestaInfo();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEncuestas", error);
  }
}

export async function getTecnologia(title: string) {
  try {
    return await Encuestas.getTecnologia(title);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function createTecnologia(data: Tecnologias) {
  try {
    const response = await Encuestas.createTecnologiaAction(data);
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error creando la tecnologia", error);
  }
}

export async function updateTecnologia(data: Partial<Tecnologias>) {
  try {
    const response = await Encuestas.updateTecnologiaAction(
      data as Tecnologias,
    );
    revalidatePath("/admin");
    return response;
  } catch (error) {
    console.log("Error editando la tecnologia:", error);
    throw new Error("Error editando la tecnologia");
  }
}

export async function createEnunciado(data: Partial<Enunciados>) {
  try {
    const response = await Encuestas.createEnunciadoAction(data);
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error creando el enunciado", error);
  } finally {
    revalidatePath("/admin");
  }
}

export async function updateEnunciado(data: Partial<Enunciados>) {
  try {
    const response = await Encuestas.updateEnunciadoAction(data as Enunciados);
    revalidatePath("/admin");
    return response;
  } catch (error) {
    console.log("Error editando el enunciado:", error);
    throw new Error("Error editando el enunciado");
  } finally {
    revalidatePath("/admin");
  }
}

export async function getEnunciado({
  dataSlug,
  dataUserId,
  dataEnunciadoId,
}: {
  dataSlug: string;
  dataUserId: string;
  dataEnunciadoId: number;
}) {
  try {
    return await Encuestas.getEnunciadoAction({
      dataSlug,
      dataUserId,
      dataEnunciadoId,
    });
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function getSampleRespuestasByEnunciado(
  enunciadosId: number,
  respondentId: string,
  responseType: any,
) {
  try {
    return await Respuestas.getSampleRespuestasByEnunciado(
      enunciadosId,
      respondentId,
      responseType,
    );
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function getExampleResponses(enunciadosId: number) {
  try {
    return await Encuestas.getExampleResponses(enunciadosId);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function createResponse(data: any) {
  try {
    const response = await Respuestas.createResponse(data);
    revalidatePath("/");
    return response;
  } catch (error) {
    console.log("Error creando el createResponse:", error);
    throw new Error("Error creando el createResponse");
  }
  revalidatePath("/impresoras-3d/enunciado-sobre-impresoras-3d-de-plasticoas");
}

export async function updateSingleChoiceResponse(
  data: any,
  responseId: number,
) {
  try {
    const response = await Respuestas.updateSingleChoiceResponse(
      responseId,
      data,
    );
    revalidatePath("/");
    return response;
  } catch (error) {
    console.log("Error editando el updateSingleChoiceResponse:", error);
    throw new Error("Error editando el updateSingleChoiceResponse");
  }
}

export async function updateCheckboxResponse(data: any, responseId: number) {
  try {
    const response = await Respuestas.updateCheckboxResponse(responseId, data);
    revalidatePath("/");
    return response;
  } catch (error) {
    console.log("Error editando el updateCheckboxResponse:", error);
    throw new Error("Error editando el updateCheckboxResponse");
  }
}

export async function getResponsesForCSV(surveyId: number) {
  try {
    return await Respuestas.getResponsesForCSV(surveyId);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getResponsesForCSV", error);
  }
}

export async function getAllMyResponses(surveySlug: string | undefined) {
  try {
    return await Respuestas.getAllMyResponses(surveySlug!);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllMyResponses", error);
  }
}

export async function getAllEnunciados() {
  try {
    return await Encuestas.getAllEnunciados();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEnunciados", error);
  }
}

export async function getAllUsers(page = 0, pageSize = 10) {
  try {
    return await Users.getAllUsersActions(page, pageSize);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEnunciados", error);
  }
}

export async function getAllUsersAssignedToMySurveys(page = 0, pageSize = 10) {
  try {
    return await Users.getAllUsersAssignedToMySurveysAction(page, pageSize);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllUsersAssignedToMySurveys", error);
  }
}

export async function updateEncuesta(surveyId: number, data: Partial<Survey>) {
  
  try {
    const response = await Encuestas.updateEncuestaAction(surveyId, data);
    revalidatePath("/admin/encuestas");
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error updateEncuesta", error);
  }
}

export async function getSlugs(surveyId: number) {
  try {
    return await Encuestas.getSlugs(surveyId);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getSlugs", error);
  }
}

export async function createEncuesta(data: Partial<Survey>) {
  try {
    const response = await Encuestas.createEncuestaAction(data);
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error creando la encuesta", error);
  }
  revalidatePath("/admin");
}

export async function updateQuestionVisible(
  enunciadoId: number,
  questionId: number,
  isActive: boolean,
) {
  try {
    const response = await Encuestas.toggleQuestionEnunciadoAction(
      enunciadoId,
      questionId,
      isActive,
    );
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error creando la encuesta", error);
  }
  revalidatePath("/admin");
}
