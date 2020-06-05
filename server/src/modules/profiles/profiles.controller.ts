import { Request, Response } from 'express';
import { ProfilesBusiness } from './profiles.business';
import { Rol } from '../../utils/enums';

export class ProfilesController {
  constructor(private business = new ProfilesBusiness()) {}

  public myInfo = async (req: Request, res: Response) => {
    const { id } = res.locals.authenticated;

    try {
      const info = await this.business.getMyInfo(id);
      return res.status(200).send(info);
    } catch (error) {
      return res
        .status(400)
        .send({ message: 'No se pudo obtener la informacion' });
    }
  };

  public editInfo = async (req: Request, res: Response) => {
    const { id } = res.locals.authenticated;
    const { correo, telefonos, direccion } = req.body;

    try {
      await this.business.editMyInfo({ id, correo }, telefonos, direccion);
      return res
        .status(200)
        .send({ message: 'Informacion de contacto actualizada' });
    } catch (error) {
      return res
        .status(400)
        .send({ message: 'No se pudo actualizar la informacion de contacto' });
    }
  };
}
