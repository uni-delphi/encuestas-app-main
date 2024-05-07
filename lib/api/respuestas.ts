import { db } from "../prisma";

export async function getSampleRespuestasByEnunciado(
  enunciadosId: number,
  respondentId: string,
  responseType: any
) {
  return await db.response.findMany({
    where: {
      enunciadosId,
      responseType,
      NOT: {
        respondentId,
      },
    },
    include: {
      singleChoice: true,
      checkbox: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 15, // Limita a 5 respuestas de single choice por pregunta
  });
}

export async function getResponsesForCSV() {
  const formattedData = await db.response.findMany({
    include: {
      respondent: true,
      singleChoice: {
        include: {
          question: true,
        },
      },
      checkbox: {
        include: {
          question: true,
        },
      },
      enunciados: {
        include: {
          tecnologia: {
            select: {
              title: true,
            }
          },
        },
      },
      question: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return formattedData.map((res) => {
    return {
      technology: res.enunciados.tecnologia.title,
      enunciado: res.enunciados.title,
      question: res.question?.text,
      createdAt: res.createdAt,
      checkboxChoises:
        res.responseType === "CHECKBOX"
          ? JSON.stringify(
              res.checkbox?.choices
                .map((item) =>
                  item.replace(/"/g, "").replace(/]/g, "").replace(/\[/g, "")
                )
                .join("|")
            )
          : res.singleChoice?.choice,
      respuestas:
        res.responseType === "CHECKBOX"
          ? res.checkbox?.answer
          : res.singleChoice?.answer,
      respondentName: `${res.respondent?.name} ${res.respondent?.lastName}`,
      respondentEmail: res.respondent.email,
      respondentCountry: res.respondent.country,
      respondentState: res.respondent.state,
      respondentEducation: res.respondent.education,
      respondentSector: res.respondent.sector,
      respondentInstitution: res.respondent.institution,
      respondentExpertees: res.respondent.expertees,
      respondentYears: res.respondent.years,
    };
  });
}

export async function getAllMyResponses(userId: string){
  return await db.response.findMany({
    where: {
      respondentId: userId,
    },
    include: {
      singleChoice: {
        include: {
          question: true,
        },
      },
      checkbox: {
        include: {
          question: true,
        },
      },
      enunciados: {
        include: {
          tecnologia: true,
        },
      },
      question: {
        include: {
          responses: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function createResponse(newResponseData: any) {
  const data: any = {
    respondentId: newResponseData.respondentId,
    questionId: newResponseData.questionId,
    enunciadosId: newResponseData.enunciadosId,
    responseType: newResponseData.responseType,
    answer: newResponseData.answer,
  };

  // Depending on the response type, add additional data for singleChoice or checkbox
  if (newResponseData.responseType === "SINGLE_CHOICE") {
    data.singleChoice = {
      create: {
        choice: newResponseData.singleChoice.choice,
        answer: newResponseData.singleChoice.answer,
        questionId: newResponseData.questionId,
      },
    };
  } else if (newResponseData.responseType === "CHECKBOX") {
    data.checkbox = {
      create: {
        choices: { set: newResponseData.checkbox.choices },
        answer: newResponseData.checkbox.answer,
        questionId: newResponseData.questionId,
      },
    };
  }

  return await db.response.create({
    data,
    // Include relations
    include: {
      singleChoice: true,
      checkbox: true,
    },
  });
}

export async function updateSingleChoiceResponse(
  responseId: number,
  data: any
) {
  return await db.singleChoiceResponse.update({
    where: {
      id: responseId,
    },
    data,
  });
}

export async function updateCheckboxResponse(responseId: number, data: any) {
  return await db.checkboxResponse.update({
    where: {
      id: responseId,
    },
    data,
  });
}
