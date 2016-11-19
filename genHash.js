const crypto = require('crypto')

module.exports = {
  sha1: (string) => {
    var shasum = crypto.createHash('sha1')
    shasum.update(string)
    return shasum.digest('hex')
  },
  checksum: (str, algorithm, encoding) => {
    return crypto
        .createHash(algorithm || 'sha1')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}
};
