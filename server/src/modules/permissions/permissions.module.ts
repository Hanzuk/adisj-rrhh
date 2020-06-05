import { Router } from 'express';

import { PermissionsController } from './permissions.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class PermissionsModule {
  public router: Router;
  private controller: PermissionsController;

  constructor() {
    this.router = Router();
    this.controller = new PermissionsController();
    this.setRoutes();
  }

  private setRoutes() {
    //Obtiene todos los permisos
    this.router.get('/', this.controller.findAll);
    //Crea un nuevo permiso
    this.router.post(
      '/',
      Auth.role([Rol.Chofer, Rol.Secretario, Rol.Temporal]),
      this.controller.create
    );
    //Actuliza un permiso
    this.router.put(
      '/admin/:permissionId',
      Auth.role([Rol.Admin]),
      this.controller.updateAdmin
    );
    this.router.put('/:permissionId', this.controller.update);
    this.router.delete('/:permissionId', this.controller.delete);
  }
}
