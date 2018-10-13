function doSQL (parent, query)      // 使用ajax，向后端数据库发出 query 请求，然后回调 handleResponse 处理响应
{
    // TODO simply use get('/api' + query)
    //var query_url = 'http://127.0.0.1:8888/api' + query;
    var query_url = '/api' + query;
    console.log('[get] request sent!', query_url);
    return parent.$http.get(query_url).then((resp) => {
        console.log(resp);
        return new Promise((resolve, reject) => {
            if (resp.body.status === 'SUCCESS.')
                resolve(resp.body);                                     // 回调函数处理响应
            else
                reject(resp.body);                                      // 处理错误操作
        });
    });
}

function getSQLColumns(parent, table_name) {      // 加载表头
    return doSQL(parent, "/developer/show_columns?table_name=" + table_name);
}

function showSQL(parent, table_name) {
    return doSQL(parent, "/developer/show_table?table_name=" + table_name);
}

function insertSQL(parent, table_name, new_row) {
    var query = "/developer/do_query?sql=INSERT INTO " + table_name + " ";
    var values = [];
    for (var item in new_row) {
        if (new_row[item] === null || new_row[item] === '')
            values.push('null');
        else
            values.push('\'' + new_row[item] + '\'');
    }
    query += "values (" + values.join(',') + ")";
    return doSQL(parent, query);
}

function deleteSQL(parent, table_name, id) {
    var query = "/developer/do_query?sql=DELETE FROM " + table_name + " WHERE id = " + id;
    return doSQL(parent, query);
}

function updateSQL(parent, table_name, row) {
    var query = "/developer/do_query?sql=UPDATE " + table_name + " SET ";
    var arr = [];
    for (var item in row) {
        if (row[item] === null || row[item] === '')
            arr.push(item + ' = null');
        else
            arr.push(item + ' = \'' + row[item] + '\'');
    }
    query += arr.join(',');
    query += " WHERE id = " + row.id;
    return doSQL(parent, query);
}

function postSQL(parent, query, params) {       // 向服务器发出post请求
    // TODO simply use post('/api' + query) when push
    //var query_url = 'http://127.0.0.1:8888/api' + query;
    var query_url = '/api' + query;
    console.log('[post] request sent!', query_url);
    return parent.$http.post(query_url, params).then((resp) => {
        console.log(resp);
        return new Promise((resolve, reject) => {
            if (resp.body.status === 'SUCCESS.')
                resolve(resp.body);                                     // 回调函数处理响应
            else
                reject(resp.body);                                      // 处理错误操作
        });
    });
}

function loginSQL(parent, user) {
    return postSQL(parent, "/user/login", user);
}

function registerSQL(parent, user) {
    return postSQL(parent, "/user/register", user);
}

export {showSQL, getSQLColumns, insertSQL, deleteSQL, updateSQL, loginSQL, registerSQL, doSQL}
