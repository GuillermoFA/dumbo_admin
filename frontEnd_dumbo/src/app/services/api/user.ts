export interface User {
  token: string;
  id: number;
  rut: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  points: number;
  roleId: number;
  role: Role;
}

export interface Role{
  id: number;
  name: string;
}

