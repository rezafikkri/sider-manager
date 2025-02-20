export default class MustUpgradeLicenseKeyError extends Error {
  constructor() {
    super('mustUpgradeLicenseKey');
    this.name = 'MustUpgradeLicenseKeyError';
  }
}
