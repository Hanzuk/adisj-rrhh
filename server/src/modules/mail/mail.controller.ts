import { Request, Response } from 'express';
// import { hash, compare } from 'bcryptjs';
import { createTransport } from 'nodemailer';

export class MailController {
  private transporter = createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'e1a68701ed5251',
      pass: '0616e84e54e07a',
    },
  });

  constructor() {}

  public sendCredentials = async (req: Request, res: Response) => {
    const { to, name, email, password } = req.body;

    try {
      await this.transporter.sendMail({
        from: '"ADISJ" <noreply@adisj.com>',
        to,
        subject: '🔐 Credenciales para el ingreso al sistema',
        text: `¡Hola, ${name}!

Con respecto a sus credenciales para el sistema, puede hacer uso
de este siguiendo las siguientes especificaciones:

Ingrese a la siguiente dirección: http://localhost:8080/login

Utilice el siguiente correo electrónico y contraseña:
-------------------------------
Correo electrónico: ${email}
Contraseña: ${password}
-------------------------------

En caso de no poder acceder por favor llamar al siguiente teléfono
-> Tel: 2245-5485

Atentamente,
ADISJ`,
      });

      return res.status(200).send({ message: 'Crendeciales enviadas' });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: 'Crendeciales no enviadas' });
    }
  };
}
