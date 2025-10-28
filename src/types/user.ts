export interface AppUser {
  id: string;
  name: string;
  email?: string;
  age?: number;
}

export type OptionalAppUser = AppUser | null;
