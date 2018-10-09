function doSQL (parent, query)      // 使用ajax，向后端数据库发出 query 请求，然后回调 handleResponse 处理响应
{
    /*return new Promise((resolve, reject) => {
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp=new XMLHttpRequest();
        }
        else
        {
            // IE6, IE5 浏览器执行代码
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = () =>       // 异步载入数据到students列表，注意这里一定要使用箭头函数，因为函数中使用了this指针，而传数据是异步的
        {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {   // 写入状态就绪
                var resp = eval('(' + xmlhttp.responseText + ')');
                if (resp.status === 'SUCCESS.')
                    resolve(resp);                                     // 回调函数处理响应
                else
                    reject(resp);                                      // 处理错误操作
            }
        };
        // var query_url = window.location.protocol + '//' + window.location.host + '/api/' + query; // TODO use this line when npm build
        var query_url = 'http://127.0.0.1:8888/api/' + query;
        xmlhttp.open("GET", query_url, true);     // 向服务端发出get 请求
        xmlhttp.send();
        console.log('Request sent!\n', query_url);
    });*/

    // var query_url = window.location.protocol + '//' + window.location.host + '/api/' + query; // TODO use this line when npm build
    console.log('[get] request sent!', query);
    return parent.$http.get('/api/' + query).then((resp) => {
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
    return doSQL(parent, "show_columns?table_name=" + table_name);
}

function showSQL(parent, table_name) {
    return doSQL(parent, "show_table?table_name=" + table_name);
}

function insertSQL(parent, table_name, new_row) {
    var query = "do_query?sql=INSERT INTO " + table_name + " ";
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
    var query = "do_query?sql=DELETE FROM " + table_name + " WHERE id = " + id;
    return doSQL(parent, query);
}

function updateSQL(parent, table_name, row) {
    var query = "do_query?sql=UPDATE " + table_name + " SET ";
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
    // TODO simply use post('/api/'+query)
    // var query_url = 'http://127.0.0.1:8888/api/' + query;
    console.log('[post] request sent!', query, params);
    return parent.$http.post('/api/' + query, params).then((resp) => {
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
    return postSQL(parent, "login", user);
}

function registerSQL(parent, user) {
    return postSQL(parent, "register", user)
}

export {showSQL, getSQLColumns, insertSQL, deleteSQL, updateSQL, loginSQL, registerSQL}
