import DB from '../../database/database';
import { Permission } from './permission.model';

export class PermissionsRepository {
  async create(permission: Permission) {
    await DB.query('INSERT INTO permisos SET ?', permission);
  }

  async findAll(): Promise<Permission[]> {
    const result = await DB.query(
      `SELECT p.id
        , p.id_empleado
          , p.id_estado
          , p.titulo
          , p.descripcion
          , p.fecha_solicitud
          , p.fecha_salida
          , p.horas
          , p.solo_admin
          , p.activo
          , CONCAT(e.nombre, ' ', e.p_apellido) as empleado
      FROM permisos p
      INNER JOIN empleados e ON p.id_empleado = e.id;`,
      ''
    );

    return [...result];
  }

  async onlyAdminUpdate(permissionId: number, permission: Permission) {
    await DB.query('UPDATE permisos SET ? WHERE id = ?;', [permission, permissionId]);
  }

  async allUpdate(permissionId: number, permission: Permission) {
    await DB.query('UPDATE permisos SET ? WHERE id = ?;', [permission, permissionId]);
  }
}
