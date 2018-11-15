const crypto = require('crypto');

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function getGravatarUrl(email) {
    let hash = crypto.createHash('md5');
    hash.update(email);
    return 'https://www.gravatar.com/avatar/' + hash.digest('hex');
}

module.exports = { randomString, getGravatarUrl };
