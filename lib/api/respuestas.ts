import { db } from "../prisma";

export async function getAllRespuestasByEnunciado(enunciadosId: number, respondentId: string) {
  return await db.response.findMany({
    where: {
      enunciadosId,
      NOT: {
        respondentId,
      },
    },
    include: {
      singleChoice: true,
      checkbox: true,
    },
    orderBy: {
      id: "asc",
    },
    take: 30
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
