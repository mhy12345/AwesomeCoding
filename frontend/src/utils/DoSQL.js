/* eslint-disable camelcase,no-undef */

function getSQL(parent, query) { // 使用ajax，向后端数据库发出 query 请求，然后回调 handleResponse 处理响应
    var query_url = '/api' + query;
    return parent.$http.get(query_url).then((res) => {
        return new Promise((resolve, reject) => {
            if (res.body.status === 'SUCCESS.') {
                resolve(res.body);
            } else { // 回调函数处理响应
                reject(res.body);
            } // 处理错误操作
        });
    });
}

function getSQLColumns (parent, table_name) { // 加载表头
    return getSQL(parent, "/developer/show_columns?table_name=" + table_name);
}

function showSQL (parent, table_name) {
    return getSQL(parent, "/developer/show_table?table_name=" + table_name);
}

function insertSQL (parent, table_name, new_row) {
    var query = "/developer/do_query?sql=INSERT INTO " + table_name + " ";
    var values = [];
    var item;
    for (item in new_row) {
        if (new_row[item] === null || new_row[item] === '') {
            values.push('null');
        } else {
            values.push('\'' + new_row[item] + '\'');
        }
    }
    query += "values (" + values.join(',') + ")";
    return getSQL(parent, query);
}

function deleteSQL (parent, table_name, id) {
    var query = "/developer/do_query?sql=DELETE FROM " + table_name + " WHERE id = " + id;
    return getSQL(parent, query);
}

function updateSQL (parent, table_name, row) {
    var item;
    var query = "/developer/do_query?sql=UPDATE " + table_name + " SET ";
    var arr = [];
    for (item in row) {
        if (row[item] === null || row[item] === '') {
            arr.push(item + ' = null');
        } else {
            arr.push(item + ' = \'' + row[item] + '\'');
        }
    }
    query += arr.join(',');
    query += " WHERE id = " + row.id;
    return getSQL(parent, query);
}

function postSQL(parent, query, params) { // 向服务器发出post请求
    var query_url = '/api' + query;
    return parent.$http.post(query_url, params).then((resp) => {
        return new Promise((resolve, reject) => {
            if (resp.body.status === 'SUCCESS.') {
                resolve(resp.body);
            } else { // 回调函数处理响应
                reject(resp.body);
            } // 处理错误操作
        });
    });
}

function loginSQL (parent, user) {
    return postSQL(parent, "/user/login", user);
}

function loginbyPhoneSQL (parent, user) {
    return postSQL(parent, "/user/loginbyPhone", user);
}

function registerSQL (parent, user) {
    return postSQL(parent, "/user/register", user);
}

function forgetPasswordSQL (parent, user) {
    return postSQL(parent, "/user/forgetPassword", user);
}

function queryPhoneSQL(parent, user) {
    return postSQL(parent, "/user/queryPhone", user);
}

function queryPhoneExistSQL(parent, user) {
    return postSQL(parent, "/user/queryPhoneExist", user);
}

function changePasswordSQL(parent, user) {
    return postSQL(parent, "/user/changePassword", user);
}

function changeSQL(parent, user) {
    return postSQL(parent, "/user/change", user);
}

function sessionSQL (parent) {
    return getSQL(parent, "/user/session");
}

function logoutSQL (parent) {
    return getSQL(parent, "/user/logout");
}

export {
    showSQL,
    getSQLColumns,
    insertSQL,
    deleteSQL,
    updateSQL,
    loginSQL,
    registerSQL,
    changeSQL,
    sessionSQL,
    logoutSQL,
    forgetPasswordSQL,
    queryPhoneSQL,
    changePasswordSQL,
    queryPhoneExistSQL,
    loginbyPhoneSQL
};
