export type TUser = {
  name?: string | null;
  lastName?: string | null;
  country: string;
  state: string;
  education: string;
  sector: string;
  institution: string;
  expertees: string;
  years: string;
  email: string;
  password: string;
  validatedPassword?: string;
  role?: string;
};

export type TLoginUser = {
  email: string;
  password: string;
}