import { required, regex, confirmed, numeric } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
  ...required,
  message: 'Este campo es requerido.',
});

extend('alpha_spaces', {
  ...regex,
  message: 'Solo letras y espacios.',
});

extend('dni', {
  ...regex,
  message: 'El formato para la cédula es incorrecto.',
});

extend('phone', {
  ...regex,
  message: 'El formato para el teléfono es incorrecto.',
});

extend('address', {
  ...regex,
  message: 'Evita usar caracteres especiales.',
});

extend('myEmail', {
  ...regex,
  message: 'El formato para el correo no es el deseado.',
});

extend('password', {
  ...regex,
  message: 'El formato para la contraseña no es el deseado.',
});

extend('passConfirmed', {
  ...confirmed,
  message: 'Las contraseñas no coincide.',
});

extend('salary', {
  ...regex,
  message: 'Este monto no es permitido.',
});

extend('numeric', {
  ...numeric,
  message: 'Solo caracteres númericos.',
});
