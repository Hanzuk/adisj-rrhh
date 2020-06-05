import { Router } from 'express';

import { OvertimeController } from './overtime.controller';
import Auth from '../../middleware/auth';
import { Rol } from '../../utils/enums';

export class OvertimeModule {
  public router: Router;
  private controller: OvertimeController;

  constructor() {
    this.router = Router();
    this.controller = new OvertimeController();
    this.setRoutes();
  }

  private setRoutes() {
    //Obtiene todas la solicitudes de horas extras
    this.router.get('/', this.controller.findAll);
    //Crea una nueva solicitud
    this.router.post(
      '/',
      Auth.role([Rol.Secretario, Rol.Chofer]),
      this.controller.create
    );
    //Acepta, rechaza la solicitud de horas extras
    this.router.put(
      '/admin/:overtimeId',
      Auth.role([Rol.Admin]),
      this.controller.approveOrReject
    );
    this.router.put('/:overtimeId', this.controller.update);
    this.router.delete(
      '/:overtimeId',
      Auth.role([Rol.Admin]),
      this.controller.delete
    );
  }
}
