export interface ISURVEY {
  id: number;
  title: string;
  description: string | null;
  createdById: string;
  tecnologias: any[];
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  hasEnded: boolean;
  endDate: Date;
  createdBy?: ICREATEDBY;
};

export interface ICREATEDBY {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string;
}

export interface IDATATYPE {
  [key: string]: IDATAQUESTION;
}

export interface IDATAQUESTION {
  order: string;
  answers: IANSWER[];
}

export interface IANSWER {
  id: string;
  name: string;
}

export interface IENUNCIADO {
  id: number;
  title: string;
  description: string;
  slug: string;
  tecnologiaId: number;
  createdAt: Date;
  updatedAt: Date;
  questions: IQUESTION[];
  response: IRESPONSES[];
}

export interface IQUESTION {
  id: number;
  text: string;
  type: string;
  inputType: string;
  additionalInfo: string;
  createdAt: Date;
  updatedAt: Date;
  responses: IRESPONSES[];
}

export interface IRESPONSES {
  id: number;
  respondentId: string;
  questionId: number;
  enunciadosId: number;
  answer: string;
  responseType: string;
  singleChoiceId: number | null;
  checkboxId: number | null;
  createdAt: Date;
  updatedAt: Date;
  singleChoice: ISINGLECHOICE;
  checkbox: ICHECKBOX;
}

export interface ISINGLECHOICE {
  id: number;
  questionId: number;
  choice: any;
  createdAt: Date;
  answer: string | null;
  responseId: number;
  enunciadosId: number;
}

export interface ICHECKBOX {
  id: number;
  questionId: number;
  choices: TCHOICES[];
  createdAt: Date;
  answer: string | null;
  responseId: number;
  enunciadosId: number;
}

export type TCHOICES =
  | "Social"
  | "Tecnológica"
  | "Económica"
  | "Ambiental"
  | "Política"
  | "Cultural";

export interface IENUNCIADOPROPS {
  id: number;
  title: string;
  description: string;
  slug: string;
  tecnologiaId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRESPONSEDATA {
  respondentId: string;
  questionId: number;
  enunciadosId: number;
  responseType: string;
  answer: string;
  singleChoice: {};
  checkbox: ICHECKBOX;
}
