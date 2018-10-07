// cookie 的创建、获取操作

function getCookie() {
    var cookie = {};
    var list = document.cookie.split(';');
    // console.log('in get: ', list);
    for (var item of list) {
        var elems = item.split('=');
        if (elems.length < 2) continue;
        cookie[elems[0].trim()] = elems[1].trim();
    }
    return cookie;
}
/* cookie 形如:
var cookie = {
    nickname: '',
    password: ''
};
*/

function createCookie(cookie, expire_secs) {
    var d = new Date();
    d.setTime(d.getTime() + expire_secs * 1000);
    var expires = d.toUTCString();
    for (var cname in cookie) {
        document.cookie = cname + '=' + cookie[cname] + ';' + 'expires=' + expires;
    }
}

export {getCookie, createCookie}