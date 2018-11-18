/**
 * Emulate Promise.all behavior.
 * PromiseAllCounter is storing array of flags and execute callback
 * when all flags in array become 'true'
 */
class PromiseAllCounter {
  constructor (callback = () => {}, ...cbArgs) {
    this.flags = [];
    this.onComplete = callback;
    this.onCompleteArgs = cbArgs;
  }
  setCallbacksCount (length) {
    this.flags = Array(+length).fill(false);
    return this;
  }
  complete (cbIndex) {
    if (!(+cbIndex in this.flags)) return;
    this.flags[cbIndex] = true;
    if (this.checkCompleteness()) {
      this.onComplete(...this.onCompleteArgs);
      return true;
    } else {
      return false;
    }
  }
  checkCompleteness () {
    for (let m = 0; m < this.flags.length; m++) {
      if (!this.flags[m]) return false; // there are still not completed callbacks
    }
    return true;
  }
}

module.exports = PromiseAllCounter;
