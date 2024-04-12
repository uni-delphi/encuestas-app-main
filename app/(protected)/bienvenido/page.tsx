import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth.config";
import { redirect } from 'next/navigation';

export default async function Bienvenido() {
  const session = await getServerSession(authOptions);  
  if (!session || !session.user) redirect("/");

  return (
    <div>Bienvenido</div>
  )
}
