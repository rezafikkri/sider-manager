export default class ActivationKeyInvalidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ActivationKeyInvalidError';
  }
}
