export class CustomError extends Error {
  data;

  constructor(message: string, field: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);

    this.data = {
      message,
      field,
    };
  }
}
