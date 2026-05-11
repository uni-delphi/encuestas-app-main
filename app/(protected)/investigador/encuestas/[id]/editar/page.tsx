import { Breadcrumbs } from "@/components/breadcrombs/breadcrumbs";
import { ConfirmModal } from "@/components/confirm-modal/confirm-modal";
import SurveyMain from "@/components/survey/survey-main";
import { Survey } from "@/generated/prisma";

import { getEncuestaById } from "@/lib/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await params;
  const surveyData: any = await getEncuestaById(Number(data.id));
  
  return (
    <section>
      <span className="ml-auto">
        <Breadcrumbs
          items={[
            { label: "Panel", href: "/investigador" },
            { label: "Encuestas", href: "/investigador/encuestas" },
            { label: data.id, href: `/investigador/encuestas/${data.id}` },
          ]}
        />
      </span>
      <SurveyMain encuesta={surveyData} />
      
    </section>
  );
}
