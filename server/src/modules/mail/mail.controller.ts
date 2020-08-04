import { Request, Response } from 'express';
import { createTransport } from 'nodemailer';

export class MailController {
  private transporter = createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '44eeb0809d82b2',
      pass: '1f9831b09788e1',
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
        text: `¡Hola, ${name}. Te damos la bienvenida a nuestra empresa!

Con respecto a tus credenciales para ingresar a nuestro sistema, puede hacer
uso de este siguiendo las siguientes especificaciones:

Ingrese al siguiente enlace: http://localhost:8080/login

Utilice el siguiente correo electrónico y contraseña:
---------------------------------------------------------------------------------
Correo electrónico: ${email}
Contraseña: ${password}
---------------------------------------------------------------------------------

En caso de no poder acceder por favor llamar al siguiente teléfono
-> Tel: 2245-5485

¡Nos sentimos muy felices de que decidas trabajar con nostros!

Atentamente,
ADISJ`,
      });

      return res.status(200).send({ message: 'Crendeciales enviadas' });
    } catch (error) {
      console.log(error);

      return res.status(400).send({ message: 'Crendeciales no enviadas' });
    }
  };

  public newUsername = async (req: Request, res: Response) => {
    const { to, name, email } = req.body;

    try {
      await this.transporter.sendMail({
        from: '"ADISJ" <noreply@adisj.com>',
        to,
        subject: '🔐 Nuevo correo para el ingreso al sistema',
        text: `¡Hola, ${name}!

Si recibes este correo es porque se ha actualizado tu correo
electrónico a esta dirección, por favor utilizalo de ahora en
adelante para continuar ingresando a nuestro sistema.

-------------------------------------------------------------------------
Correo electrónico: ${email}
-------------------------------------------------------------------------

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

  public newUsernameAndPass = async (req: Request, res: Response) => {
    const { to, name, email, password } = req.body;

    try {
      await this.transporter.sendMail({
        from: '"ADISJ" <noreply@adisj.com>',
        to,
        subject: '🔐 Nuevas credenciales para el ingreso al sistema',
        text: `¡Hola, ${name}!

Hemos actualizado tus credenciales para ingresar a nuestro sistema,
puede hacer uso de este siguiendo las siguientes especificaciones:

Ingrese al siguiente enlace: http://localhost:8080/login

Utilice el siguiente correo electrónico y contraseña:
--------------------------------------------------------------------
Correo electrónico: ${email}
Contraseña: ${password}
--------------------------------------------------------------------

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
