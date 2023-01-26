import { ADMIN, STUDENT, TEACHER } from "./constants";

export interface User {
  _id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
}

export type UserRole = typeof TEACHER | typeof STUDENT | typeof ADMIN