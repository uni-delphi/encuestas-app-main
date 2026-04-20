import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import SurveyMain from "@/components/survey/survey-main";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await params;
  console.log("🚀 ~ Page ~ params:", data);

  return (
    <section>
      <Breadcrumbs
              items={[
                { label: "Panel", href: "/admin" },
                { label: "Encuestas", href: "/admin/encuestas" },
                { label: data.id, href: `/admin/encuestas/${data.id}` },
              ]}
            />
      Aca va el formulario para editar la encuesta {data.id}
      <div>
        <SurveyMain />
      </div>
    </section>
  );
}
