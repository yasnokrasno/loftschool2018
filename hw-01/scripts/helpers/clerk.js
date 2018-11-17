// use console.log only when debugMode is true
class Clerk {
  constructor (mode) {
    this.debugIsOn = mode;
  }
  log (...args) {
    this.debugIsOn && console.log('Librarian: ', ...args);
  }
}
module.exports.Clerk = Clerk;
