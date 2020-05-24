export enum Rol {
  ADMIN = 1,
  SECRETARY = 2,
  DRIVER = 3,
  TEMPORARY = 4,
}

export enum PhoneType {
  MOBILE = 1,
  HOME = 2,
}

export interface Phone {
  type: PhoneType;
  number: string;
}

export interface Address {
  province: number;
  canton: number;
  district: number;
  address: string;
}
