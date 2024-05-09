export type TCSVRESPONSE = {
    technology?: string;
    enunciado?: string;
    question?: string;
    createdAt: Date;
    checkboxChoises?: string;
    respuestas?: string;
    respondentName?: string;
    respondentEmail: string;
    respondentCountry: string;
    respondentState: string;
    respondentEducation: string;
    respondentSector: string;
    respondentInstitution: string;
    respondentExpertees: string;
    respondentYears: string
  };

  export interface TRESPONSE {
      id: number;
      respondentId: string;
      questionId: number | null;
      enunciadosId: number;
      answer: string;
      responseType: string | null;
      singleChoiceId: number | null;
      checkboxId: number | null;
      createdAt: Date;
      updatedAt: Date;  
  }