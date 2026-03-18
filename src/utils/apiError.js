class apiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    erros = [],
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.erros = erros;
    this.stack = stack;
    this.message = message;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiError };
