import { required, digits, regex, confirmed, numeric } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
  ...required,
  message: 'Este campo es requerido.',
});

extend('dni', {
  ...digits,
  message: 'El formato para la cédula es incorrecto.',
});

extend('phone', {
  ...digits,
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

// extend('email', {
//   ...email,
//   message: 'This field must be a valid email',
// });

// extend('confirmed', {
//   ...confirmed,
//   message: 'This field confirmation does not match',
// });

// extend('length', {
//   ...length,
//   message: 'This field must have 2 options',
// });
