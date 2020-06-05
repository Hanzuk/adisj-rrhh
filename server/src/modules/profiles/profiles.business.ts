import { ProfilesRepository } from './profiles.repository';
import { Phone, Address, Profile } from './profile.model';

export class ProfilesBusiness {
  constructor(private repository = new ProfilesRepository()) {}

  public async getMyInfo(userId: number) {
    return await this.repository.getMyInfo(userId);
  }

  public async editMyInfo(
    employee: Profile,
    phones: Phone[],
    address: Address
  ) {
    await this.repository.editMyInfo(employee, phones, address);
  }
}
