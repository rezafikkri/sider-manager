export default class UnauthorizeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizeError';
  }
}
