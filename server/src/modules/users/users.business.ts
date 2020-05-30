import { UsersRepository } from './repositories/users.repository';
import { User, Address, Phone } from './models/user.model';
import { TempUser } from './models/temp.model';

export class UsersBusiness {
  constructor(private repository: UsersRepository = new UsersRepository()) {}

  async create(user: User | TempUser) {
    await this.repository.create(user);
  }

  async findOne(userId: number) {
    return await this.repository.findOne(userId);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async update(user: User | TempUser) {
    await this.repository.update(user);
  }

  async updateContact(contact: {
    id: number;
    correo: string;
    telefonos: Phone[];
    direccion: Address;
  }) {
    await this.repository.updateContact(contact);
  }

  async reHire(
    userId: number,
    newHireDate: Date = new Date(),
    newOutDate: Date,
    newDescription: string
  ) {
    const user = await this.repository.findOne(userId);

    if (user.tipo_empleado !== 'Temporal') {
      throw new Error('Temporary employees only');
    }

    await this.repository.reHire(
      userId,
      newHireDate,
      newOutDate,
      newDescription
    );
  }
}
