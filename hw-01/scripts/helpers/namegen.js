class NameGen {
  constructor () {
    this.chSrc = 'qwer1tyu2iop3~asd4fghj_5klzx_6cvbn7m89';
    this.chLen = this.chSrc.length;
    this.extSrc = ['.css', '.scss', '.less', '.js', '.jsх', '.txt', '.po', '.json'];
  }
  generateName (len = 4, index) {
    let name = '';
    for (let i = 1; i <= len; i++) {
      name += this.chSrc[Math.floor(Math.random() * this.chLen)];
    }
    name = (typeof index === 'undefined') ? name : name + '_' + index;
    return name;
  }
  generateFileName (len = 4, index) {
    const name = this.generateName(len, index);
    const ext = this.extSrc[Math.floor(Math.random() * this.extSrc.length)];
    return name + ext;
  }
}

module.exports = new NameGen();
