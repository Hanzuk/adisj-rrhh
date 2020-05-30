import { Router } from 'express';

import { UsersController } from './users.controller';
import Auth from '../../middleware/auth';
import { Rol } from 'src/utils/enums';

export class UsersModule {
  public router: Router;
  private controller: UsersController;

  constructor() {
    this.router = Router();
    this.controller = new UsersController();
    this.setRoutes();
  }

  private setRoutes() {
    //Obtiene todos los empleados
    this.router.get('/', /*Auth.role(Rol.Admin),*/ this.controller.findAll);
    //Obtiene un empleado especifico
    this.router.get('/:userId', this.controller.findOne);

    // Crea un nuevo empleado
    this.router.post('/', /*Auth.role(Rol.Admin),*/ this.controller.create);

    //Actualiza la informacion de un empleado
    this.router.put(
      '/:userId',
      /*Auth.role(Rol.Admin),*/ this.controller.update
    );
    //Empleado cualquiera actuliza su informacion de contacto
    this.router.put('/:userId/contact', this.controller.updateContact);

    //Re-contrata un empleado temporal
    this.router.put(
      '/:userId/re-hire',
      /*Auth.role(Rol.Admin),*/ this.controller.reHire
    );

    //Elimina un empleado especifico
    this.router.delete(
      '/:userId',
      /*Auth.role(Rol.Admin),*/ this.controller.delete
    );
  }
}
