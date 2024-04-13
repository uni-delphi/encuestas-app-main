"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

import { TUser, TLoginUser } from "@/types/user";
import * as Users from "@/lib/api/users";
import { signIn } from "next-auth/react";

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
    redirect(`/maquinarias/1`);
  }

  revalidatePath("/dashboard");
}
