import { PermissionsRepository } from './permissions.repository';
import { Permission } from './permission.model';

export class PermissionsBusiness {
  constructor(private repository = new PermissionsRepository()) {}

  async create(permission: Permission) {
    await this.repository.create(permission);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async onlyAdminUpdate(permissionId: number, permission: Permission) {
    await this.repository.onlyAdminUpdate(permissionId, permission);
  }

  async allUpdate(permissionId: number, permission: Permission) {
    await this.repository.allUpdate(permissionId, permission);
  }
}
