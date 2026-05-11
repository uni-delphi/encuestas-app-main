"use server";
import { cache } from "react";
import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

import { TUser, TLoginUser } from "@/types/user";
import { RoleType } from "@/generated/prisma";
import * as Users from "@/lib/api/users";
import * as Encuestas from "@/lib/api/encuestas";
import * as Respuestas from "@/lib/api/respuestas";
import { Enunciados, Survey, Tecnologias } from "@/generated/prisma";
import { redirectStrategy } from "@/lib/constants";

const invalidate = (tag: string) => revalidateTag(tag, "default");

async function getSessionUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");
  return session.user.id;
}

function userCache<TArgs extends unknown[], TResult>(
  fn: (userId: string, ...args: TArgs) => Promise<TResult>,
  keyPrefix: string,
  tags: string[],
) {
  return async (...args: TArgs): Promise<TResult> => {
    const userId = await getSessionUserId();
    return unstable_cache(
      () => fn(userId, ...args),
      [`${keyPrefix}-${userId}-${JSON.stringify(args)}`],
      { tags: [...tags, `user-${userId}`], revalidate: false }
    )();
  };
}

// — Auth ——————————————————————————————————————————————————

export async function createUser(data: TUser) {
  try {
    const userData = await Users.getUserByEmail(data.email);
    if (userData) return true;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    return await Users.createUser(data);
  } catch (error) {
    throw new Error(`Error creando el usuario: ${error}`);
  }
}

export async function loginUser(data: TLoginUser) {
  let result = null;
  try {
    result = await Users.logInUser(data);
  } catch (error) {
    throw new Error(`Error login: ${error}`);
  } finally {
    if (result) redirect(redirectStrategy[result?.role]);
  }
  revalidatePath("/dashboard");
}

export async function searchUsers(query: string) {
  try {
    return Users.searchUsersAction(query);
  } catch (error) {
    throw new Error(`Error en search user: ${error}`);
  }
}

export async function changeUserRole(userEmail: string, role: RoleType) {
  try {
    const response = await Users.changeUserRoleAction(userEmail, role);
    revalidatePath("/admin");
    return response;
  } catch (error) {
    throw new Error(`Error en changeUserRole: ${error}`);
  }
}

export async function createInvitation(surveyId: number, email: string) {
  try {
    const response = await Users.createInvitationAction(surveyId, email);
    revalidatePath("/investigador/usuarios");
    return response;
  } catch (error) {
    throw new Error(`Error en createInvitation: ${error}`);
  }
}

export async function assignUserToSurvey(surveyId: number, userId: string) {
  try {
    return Users.assignUserToSurvey(surveyId, userId);
  } catch (error) {
    throw new Error(`Error en assignUserToSurvey: ${error}`);
  }
}

export async function removeUserFromSurvey(surveyId: number, userId: string) {
  try {
    return Users.removeUserFromSurvey(surveyId, userId);
  } catch (error) {
    throw new Error(`Error en removeUserFromSurvey: ${error}`);
  }
}

// — Encuestas globales ————————————————————————————————————

export const getAllEncuestasInfo = unstable_cache(
  async () => {
    try {
      return await Encuestas.getEncuestaInfo();
    } catch (error: any) {
      throw new Error(`Error getAllEncuestasInfo: ${error}`);
    }
  },
  ["all-encuestas-info"],
  { tags: ["encuestas"], revalidate: 3600 }
);

export const getAllEnunciados = unstable_cache(
  async () => {
    try {
      return await Encuestas.getAllEnunciados();
    } catch (error: any) {
      throw new Error(`Error getAllEnunciados: ${error}`);
    }
  },
  ["all-enunciados"],
  { tags: ["enunciados"], revalidate: false }
);

export const getTecnologia = unstable_cache(
  async (title: string) => {
    try {
      return await Encuestas.getTecnologia(title);
    } catch (error: any) {
      throw new Error(`Error getTecnologia: ${error}`);
    }
  },
  ["tecnologia-by-title"],
  { tags: ["tecnologias"], revalidate: false }
);

// Paginadas — sin cache (demasiadas combinaciones)
export async function getEncuestas(page = 0, pageSize = 10) {
  return await Encuestas.getEncuestasAction(page, pageSize);
}

export async function getAllUsers(page = 0, pageSize = 10) {
  try {
    return await Users.getAllUsersActions(page, pageSize);
  } catch (error: any) {
    throw new Error(`Error getAllUsers: ${error}`);
  }
}

export async function getAllUsersAssignedToMySurveys(page = 0, pageSize = 10) {
  try {
    return await Users.getAllUsersAssignedToMySurveysAction(page, pageSize);
  } catch (error: any) {
    throw new Error(`Error getAllUsersAssignedToMySurveys: ${error}`);
  }
}

// — Encuestas por usuario ————————————————————————————————

// getAllEncuestas filtra responses por userId — necesita userCache
export const getAllEncuestas = userCache(
  async (userId: string) => {
    try {
      return await Encuestas.getAllEncuestas(userId); // pasás userId como param
    } catch (error: any) {
      throw new Error(`Error getAllEncuestas: ${error}`);
    }
  },
  "all-encuestas",
  ["encuestas"]
);

export const getEncuestaById = userCache(
  async (_userId: string, id: number) => {
    try {
      return await Encuestas.getEncuestaByIdAction({ id });
    } catch (error: any) {
      throw new Error(`Error getEncuestaById: ${error}`);
    }
  },
  "encuesta-by-id",
  ["encuestas"]
);

export const getFullEncuestaById = userCache(
  async (_userId: string, id: number) => {
    try {
      return await Encuestas.getFullEncuestaByIdAction({ id });
    } catch (error: any) {
      throw new Error(`Error getFullEncuestaById: ${error}`);
    }
  },
  "full-encuesta-by-id",
  ["encuestas"]
);

export const getEncuestaBySlug = userCache(
  async (_userId: string, slug: string) => {
    try {
      return await Encuestas.getEncuestaBySlugAction(slug);
    } catch (error: any) {
      throw new Error(`Error getEncuestaBySlug: ${error}`);
    }
  },
  "encuesta-by-slug",
  ["encuestas"]
);

export const getFullEncuestaBySlug = userCache(
  async (_userId: string, slug: string) => {
    try {
      return await Encuestas.getFullEncuestaBySlugAction(slug);
    } catch (error: any) {
      throw new Error(`Error getFullEncuestaBySlug: ${error}`);
    }
  },
  "full-encuesta-by-slug",
  ["encuestas"]
);

// getMyEncuestas y getMyEncuestasByAssigned necesitan userId como param en la API
export const getMyEncuestas = userCache(
  async (userId: any, page: number = 0, pageSize: number = 10) => {
    try {
      return await Encuestas.getMyEncuestas(userId, page, pageSize);
    } catch (error: any) {
      throw new Error(`Error getMyEncuestas: ${error}`);
    }
  },
  "my-encuestas",
  ["encuestas"]
);

export const getMyEncuestasByAssigned = userCache(
  async (userId: string, page: number = 0, pageSize: number = 10) => {
    try {
      return await Encuestas.getMyEncuestasByAssignedAction(userId, page, pageSize);
    } catch (error: any) {
      throw new Error(`Error getMyEncuestasByAssigned: ${error}`);
    }
  },
  "my-encuestas-assigned",
  ["encuestas"]
);

export const getEnunciado = userCache(
  async (   
    _userId, 
    dataSlug: string,
    dataUserId: string,
    dataEnunciadoId: number
  ) => {
    try {
      return await Encuestas.getEnunciadoAction({ dataSlug, dataUserId, dataEnunciadoId });
    } catch (error: any) {
      throw new Error(`Error getEnunciado: ${error}`);
    }
  },
  "enunciado",
  ["enunciados"]
);

// — Tecnologias ———————————————————————————————————————————

export async function createTecnologia(data: Tecnologias) {
  try {
    const response = await Encuestas.createTecnologiaAction(data);
    invalidate("tecnologias");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error creando la tecnologia: ${error}`);
  }
}

export async function updateTecnologia(data: Partial<Tecnologias>) {
  try {
    const response = await Encuestas.updateTecnologiaAction(data as Tecnologias);
    invalidate("tecnologias");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error) {
    throw new Error(`Error editando la tecnologia: ${error}`);
  }
}

export async function deleteTecnologia(techId: number) {
  try {
    const response = await Encuestas.deleteTecnologiaAction(techId);
    invalidate("tecnologias");
    invalidate("enunciados");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error en deleteTecnologia: ${error}`);
  }
}

// — Enunciados ————————————————————————————————————————————

export async function createEnunciado(data: Partial<Enunciados>) {
  try {
    const response = await Encuestas.createEnunciadoAction(data);
    invalidate("enunciados");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error creando el enunciado: ${error}`);
  }
}

export async function updateEnunciado(data: Partial<Enunciados>) {
  try {
    const response = await Encuestas.updateEnunciadoAction(data as Enunciados);
    invalidate("enunciados");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error) {
    throw new Error(`Error editando el enunciado: ${error}`);
  }
}

export async function deleteEnunciado(enunciadoId: number) {
  try {
    const response = await Encuestas.deleteEnunciadoAction(enunciadoId);
    invalidate("enunciados");
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error en deleteEnunciado: ${error}`);
  }
}

export async function getSampleRespuestasByEnunciado(
  enunciadosId: number,
  respondentId: string,
  responseType: any,
) {
  try {
    return await Respuestas.getSampleRespuestasByEnunciado(enunciadosId, respondentId, responseType);
  } catch (error: any) {
    throw new Error(`Error getSampleRespuestasByEnunciado: ${error}`);
  }
}

export async function getExampleResponses(enunciadosId: number) {
  try {
    return await Encuestas.getExampleResponses(enunciadosId);
  } catch (error: any) {
    throw new Error(`Error getExampleResponses: ${error}`);
  }
}

// — Respuestas ————————————————————————————————————————————

export async function createResponse(data: any) {
  try {
    const response = await Respuestas.createResponse(data);
    revalidatePath("/");
    return response;
  } catch (error) {
    throw new Error(`Error creando el createResponse: ${error}`);
  }
}

export async function updateSingleChoiceResponse(data: any, responseId: number) {
  try {
    const response = await Respuestas.updateSingleChoiceResponse(responseId, data);
    revalidatePath("/");
    return response;
  } catch (error) {
    throw new Error(`Error editando el updateSingleChoiceResponse: ${error}`);
  }
}

export async function updateCheckboxResponse(data: any, responseId: number) {
  try {
    const response = await Respuestas.updateCheckboxResponse(responseId, data);
    revalidatePath("/");
    return response;
  } catch (error) {
    throw new Error(`Error editando el updateCheckboxResponse: ${error}`);
  }
}

export async function getResponsesForCSV(surveyId: number) {
  try {
    return await Respuestas.getResponsesForCSV(surveyId);
  } catch (error: any) {
    throw new Error(`Error getResponsesForCSV: ${error}`);
  }
}

export async function getAllMyResponses(surveySlug: string | undefined) {
  try {
    return await Respuestas.getAllMyResponses(surveySlug!);
  } catch (error: any) {
    throw new Error(`Error getAllMyResponses: ${error}`);
  }
}

// — Survey mutations ——————————————————————————————————————

export async function updateEncuesta(surveyId: number, data: Partial<Survey>) {
  try {
    const response = await Encuestas.updateEncuestaAction(surveyId, data);
    invalidate("encuestas");
    revalidatePath("/admin/encuestas");
    return response;
  } catch (error: any) {
    throw new Error(`Error updateEncuesta: ${error}`);
  }
}

export async function getSlugs(surveyId: number) {
  try {
    return await Encuestas.getSlugs(surveyId);
  } catch (error: any) {
    throw new Error(`Error getSlugs: ${error}`);
  }
}

export async function createEncuesta(data: Partial<Survey>) {
  try {
    const response = await Encuestas.createEncuestaAction(data);
    invalidate("encuestas");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error creando la encuesta: ${error}`);
  }
}

export async function updateQuestionVisible(
  enunciadoId: number,
  questionId: number,
  isActive: boolean,
) {
  try {
    const response = await Encuestas.toggleQuestionEnunciadoAction(enunciadoId, questionId, isActive);
    invalidate("enunciados");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error updateQuestionVisible: ${error}`);
  }
}

export async function deleteSurvey(surveyId: number) {
  try {
    const response = await Encuestas.deleteSurveyAction(surveyId);
    invalidate("encuestas");
    invalidate("tecnologias");
    invalidate("enunciados");
    revalidatePath("/admin");
    return response;
  } catch (error: any) {
    throw new Error(`Error en deleteSurvey: ${error}`);
  }
}