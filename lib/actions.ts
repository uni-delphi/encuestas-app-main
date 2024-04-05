"use server";

import { TUser, TLoginUser } from "@/types/user";
import * as Users from "@/lib/api/users";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(data: TUser) {
  let eventId = null;
  try {
    const result = await Users.createUser(data);
    console.log("Evento creado:", result);
    eventId = result.id;
  } catch (error) {
    console.log("Error creando el evento:", error);
    throw new Error("Error creando el evento");
  }
  if (eventId) {
    redirect(`/dashboard/evento/${eventId}`);
  }

  revalidatePath("/dashboard");
}

export async function loginUser(data: TLoginUser) {
  let eventId = null;
  try {
    const result = await Users.createUser(data);
    console.log("Evento creado:", result);
    eventId = result.id;
  } catch (error) {
    console.log("Error creando el evento:", error);
    throw new Error("Error creando el evento");
  }
  if (eventId) {
    redirect(`/dashboard/evento/${eventId}`);
  }

  revalidatePath("/dashboard");
}
