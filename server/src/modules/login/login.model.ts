import { Rol } from '../users/users.model';

export interface ILogin {
  id: number;
  email: string;
  password: string;
  rol: Rol;
}

export class Login {
  id: number;
  email: string;
  password: string;
  rol: Rol;

  constructor(email: string, password: string, rol: Rol, id?: number) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.rol = rol;
  }
}
