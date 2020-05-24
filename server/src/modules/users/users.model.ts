import { Rol, Phone, Address } from './interfaces/users.interfaces';

export class User {
  //TODO: Incluir la jornada
  idCard: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthdate: string;
  email: string;
  password: string;
  phones: Phone[];
  address: Address;
  salary: number;
  rol: Rol;

  constructor(
    idCard: string,
    name: string,
    lastName1: string,
    lastName2: string,
    birthdate: string,
    email: string,
    password: string,
    phones: Phone[],
    address: Address,
    salary: number,
    rol: Rol
  ) {
    this.idCard = idCard;
    this.name = name;
    this.lastName1 = lastName1;
    this.lastName2 = lastName2;
    this.birthdate = birthdate;
    this.email = email;
    this.password = password;
    this.phones = phones;
    this.address = address;
    this.salary = salary;
    this.rol = rol;
  }
}

export class TemporaryUser extends User {
  departureDate: string;
  description: string;

  constructor(
    idCard: string,
    name: string,
    lastName1: string,
    lastName2: string,
    birthdate: string,
    email: string,
    password: string,
    phones: Phone[],
    address: Address,
    departureDate: string,
    description: string,
    salary: number,
    rol: Rol
  ) {
    super(
      idCard,
      name,
      lastName1,
      lastName2,
      birthdate,
      email,
      password,
      phones,
      address,
      salary,
      rol
    );
    this.departureDate = departureDate;
    this.description = description;
  }
}
