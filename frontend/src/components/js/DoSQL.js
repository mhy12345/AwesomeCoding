function doSQL (query)      // 使用ajax，向后端数据库发出 query 请求，然后回调 handleResponse 处理响应
{
    return new Promise((resolve, reject) => {
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
        var query_url = window.location.protocol + '//' + window.location.host + '/api/' + query; // TODO use this line when npm build
        // var query_url = 'http://127.0.0.1/api/' + query;
        xmlhttp.open("GET", query_url, true);     // 向服务端发出get 请求
        xmlhttp.send();
        console.log('Request sent!\n', query_url);
    });
}

function getSQLColumns(table_name) {      // 加载表头
    return doSQL("show_columns?table_name=" + table_name);
}

function showSQL(table_name) {
    return doSQL("show_table?table_name=" + table_name);
}

function insertSQL(table_name, new_row, handleThen, handleError) {
    var query = "do_query?sql=INSERT INTO " + table_name + " ";
    var values = [];
    for (var item in new_row) {
        if (new_row[item] === null || new_row[item] === '')
            values.push('null');
        else
            values.push('\'' + new_row[item] + '\'');
    }
    query += "values (" + values.join(',') + ")";
    return doSQL(query);
}

function deleteSQL(table_name, id) {
    var query = "do_query?sql=DELETE FROM " + table_name + " WHERE id = " + id;
    return doSQL(query);
}

function updateSQL(table_name, row) {
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
    return doSQL(query);
}

function loginSQL(user) {           // TODO 改为 post 版本，需要后端的支持
    var query = "login?nickname=" + user.nickname + "&password=" + user.password;
    return doSQL(query);
}

function registerSQL(user) {
    var query = "register?";
    for (var item in user) {
        query += item + "=" + user[item] + "&";
    }
    return doSQL(query);
}

export {showSQL, getSQLColumns, insertSQL, deleteSQL, updateSQL, loginSQL, registerSQL}
