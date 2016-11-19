const crypto = require('crypto')

module.exports = {
  sha1: (string) => {
    var shasum = crypto.createHash('sha1');
    shasum.update();
    console.log(shasum.digest('hex'));
  }
};
