import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import SurveyMain from "@/components/survey/survey-main";
import { Survey } from "@/generated/prisma";
import { getEncuestaById } from "@/lib/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await params;
  const surveyData: any = await getEncuestaById(Number(data.id));
  console.log("🚀 ~ Page ~ surveyData:", surveyData);

  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/admin" },
          { label: "Encuestas", href: "/admin/encuestas" },
          { label: data.id, href: `/admin/encuestas/${data.id}` },
        ]}
      />
      <SurveyMain encuesta={surveyData} />
    </section>
  );
}
