"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

import { TUser, TLoginUser } from "@/types/user";

import * as Users from "@/lib/api/users";
import * as Encuestas from "@/lib/api/encuestas";

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

export async function getAllEncuestas() {
  try {
    return await Encuestas.getAllEncuestas();
  } catch (error: any) {
    console.log(error);
    throw Error("Error getAllEncuestas", error);
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

export async function getEnunciados(slug: string) {
  try {
    return await Encuestas.getEnunciados(slug);
  } catch (error: any) {
    console.log(error);
    throw Error("Error getTecnologia", error);
  }
}