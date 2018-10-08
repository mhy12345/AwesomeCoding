// json的深复制和浅复制
function copy(a) {
    var b = {};
    for (let prop in a) {
        b[prop] = a[prop];
    }
    return b;
}

function deepCopy(a) {
    var b = {};
    for (var prop in a) {
        if (typeof a[prop] === 'object')
            b[prop] = deepCopy(a[prop]);
        else
            b[prop] = a[prop];
    }
    return b;
}

export {copy, deepCopy}