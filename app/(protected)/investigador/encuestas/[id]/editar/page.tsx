import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
  const data = await params;
  console.log("🚀 ~ Page ~ params:", data)
  
  return (
    <section className="px-10 py-20">Aca va el formulario para editar la encuesta {data.id}</section>
  )
}
