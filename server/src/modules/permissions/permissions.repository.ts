import DB from '../../database/database';
import { Permission } from './permission.model';

export class PermissionsRepository {
  async create(permission: Permission) {
    await DB.query('INSERT INTO permisos SET ?', permission);
  }

  async findAll(): Promise<Permission[]> {
    const result = await DB.query(
      'SELECT id, id_empleado, id_estado, titulo, descripcion, fecha_solicitud, fecha_salida, horas, solo_admin, activo FROM permisos',
      ''
    );

    return [...result];
  }

  async onlyAdminUpdate(permissionId: number, permission: Permission) {
    await DB.query('UPDATE permisos SET ? WHERE id = ?;', [
      permission,
      permissionId,
    ]);
  }

  async allUpdate(permissionId: number, permission: Permission) {
    await DB.query('UPDATE permisos SET ? WHERE id = ?;', [
      permission,
      permissionId,
    ]);
  }
}
