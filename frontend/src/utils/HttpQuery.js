/* eslint-disable camelcase,no-undef */
<<<<<<< HEAD
//var root_url = require('../../config/http_root_url');
=======
>>>>>>> release-version-3.0
import axios from 'axios';
var root_url = '';

function postQuery(parent, query) { // 使用ajax，向后端数据库发出 query 请求，然后回调 handleResponse 处理响应
    var query_url = '/api' + query;
    //console.log('[get] request sent!', query_url);
    axios.post(query_url, {

    })
    return parent.$http.post(query_url).then((res) => {
        console.log(res);
        return new Promise((resolve, reject) => {
            if (res.body.status === 'SUCCESS.') {
                resolve(res.body);
            } else { // 回调函数处理响应
                reject(res.body);
            } // 处理错误操作
        });
    });
}

export {
    getQuery
};
