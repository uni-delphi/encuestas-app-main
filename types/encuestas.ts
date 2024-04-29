export type Encuestas = {
  id: string;
  nombre: string | null;
  descripcion: string | null;
  hasEnded: boolean;
  hasStarted: boolean;
};

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
  singleChoiceId: number;
  checkboxId: number;
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
  answer: string;
  responseId: number;
  enunciadosId: number;
}

export interface ICHECKBOX {
  id: number;
  questionId: number;
  choices: TCHOICES[];
  createdAt: Date;
  answer: string;
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
