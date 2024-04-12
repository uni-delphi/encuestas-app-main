import { authOptions } from '@/auth.config';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Finalizado() {
  const session = await getServerSession(authOptions);  
  if (!session || !session.user) redirect("/");
  return (
    <div>Finalizado</div>
  )
}
