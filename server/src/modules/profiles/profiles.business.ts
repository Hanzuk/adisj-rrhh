import { ProfilesRepository } from './profiles.repository';
import { Phone, Address, Profile } from './profile.model';

export class ProfilesBusiness {
  constructor(private repository = new ProfilesRepository()) {}

  public async getMyInfo(userId: number) {
    return await this.repository.getMyInfo(userId);
  }

  public async editMyInfo(
    userId: number,
    newInfo: {
      cedula: string;
      nombre: string;
      p_apellido: string;
      s_apellido: string;
      fecha_nacimiento: Date;
      codigo_provincia: number;
      codigo_canton: number;
      codigo_distrito: number;
      direccion: string;
      telefonos: { numero: string; tipo_telefono: number }[];
    },
    oldPhones: number[]
  ) {
    await this.repository.editMyInfo(userId, newInfo, oldPhones);
  }
}
