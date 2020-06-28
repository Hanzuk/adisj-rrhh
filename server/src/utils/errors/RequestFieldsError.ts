export class RequiredFieldsError {
  message: string;
  code: string;
  stacktrace: string[];

  constructor(message: string = 'Insuficientes campos para esta petición') {
    this.message = message;
    this.code = 'REQUIRED_FIELDS';
    this.stacktrace = new Error(this.message).stack.split('\n');
  }
}
