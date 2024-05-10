"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

import { TUser, TLoginUser } from "@/types/user";

import * as Users from "@/lib/api/users";
import * as Encuestas from "@/lib/api/encuestas";
import * as Respuestas from "@/lib/api/respuestas";

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
  try {
    const result = await Users.logInUser(data);
    console.log("login:", result);
    eventId = result?.id;
  } catch (error) {
    console.log("Error login:", error);
    throw new Error("Error login");
  }
  if (eventId) {
    redirect(`/estado/1`);
  }

  revalidatePath("/dashboard");
}

export async function getAllEncuestas(userId: string) {
  try {
    const response = await Encuestas.getAllEncuestas(userId);
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEncuestas", error);
  }
}

export async function getEncuesta() {
  try {
    const response = await Encuestas.getEncuesta();
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getEncuesta", error);
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

export async function getEnunciado({
  dataSlug,
  dataUserId,
  dataEnunciadoId,
}: {
  dataSlug: string;
  dataUserId: string;
  dataEnunciadoId: string;
}) {
  try {
    return await Encuestas.getEnunciado({
      dataSlug,
      dataUserId,
      dataEnunciadoId,
    });
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function getSampleRespuestasByEnunciado(enunciadosId: number, respondentId: string, responseType: any){
  try {
    return await Respuestas.getSampleRespuestasByEnunciado(enunciadosId, respondentId , responseType);
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
    revalidatePath('/')
    return response;
  } catch (error) {
    console.log("Error creando el createResponse:", error);
    throw new Error("Error creando el createResponse");
  }  
  revalidatePath("/impresoras-3d/enunciado-sobre-impresoras-3d-de-plasticoas");
}

export async function updateSingleChoiceResponse(data: any, responseId: number) {
  try {
    const response = await Respuestas.updateSingleChoiceResponse(responseId, data);
    revalidatePath('/')
    return response;
  } catch (error) {
    console.log("Error editando el updateSingleChoiceResponse:", error);
    throw new Error("Error editando el updateSingleChoiceResponse");
  }
}

export async function updateCheckboxResponse(data: any, responseId: number) {
  try {
    const response = await Respuestas.updateCheckboxResponse(responseId, data);
    revalidatePath('/')
    return response;
  } catch (error) {
    console.log("Error editando el updateCheckboxResponse:", error);
    throw new Error("Error editando el updateCheckboxResponse");
  }
}

export async function getResponsesForCSV() {
  try {
    return await Respuestas.getResponsesForCSV();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getResponsesForCSV", error);
  }
}

export async function getAllMyResponses(userId: string) {
  try {
    return await Respuestas.getAllMyResponses(userId);
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

export async function getAllUsers() {
  try {
    return await Users.getAllUsers();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEnunciados", error);
  }
}

export async function updateEncuesta(surveyId: number, data: any) {
  try {
    const response =  await Encuestas.updateEncuesta(surveyId, data);
    revalidatePath('/');
    return response;
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}

export async function getSlugs() {
  try {
    return await Encuestas.getSlugs();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getSlugs", error);
  }
}