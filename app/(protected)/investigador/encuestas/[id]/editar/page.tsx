import SurveyMain from "@/components/survey/survey-main";
import { getEncuestaById } from "@/lib/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await params;
    const surveyData: any = await getEncuestaById(Number(data.id));
  console.log("🚀 ~ Page ~ params:", data);

  return (
    <section className="px-10 py-20">
      Aca va el formulario para editar la encuesta {data.id}
      <div>
        <SurveyMain encuesta={surveyData}/>
      </div>
    </section>
  );
}
