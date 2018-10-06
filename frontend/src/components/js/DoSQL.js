function doSQL (parent, query_url, table_name, flag)      // 使用ajax，向后端数据库发出修改/删除/插入的请求，flag为真表示需要更新parent.students的显示，否则再发出一次显示数据库的请求
{
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
            let resp = eval('(' + xmlhttp.responseText + ')');
            if (resp.status === 'SUCCESS.') {                       // 操作成功，保存结果并显示
                if (flag) {                                         // 反馈是否为更新后的数据?
                    console.log(parent.table_data);
                    parent.table_data = resp.results;

                    if (!parent.loaded) {                           // 初次加载
                        parent.heads = [];
                        parent.input_item = [];
                        for (let head in resp.results[0]) {
                            parent.heads.push(head);                    // 获取表头
                            parent.input_item[head] = null;             // 初始化添加框的内容
                        }
                    }
                    parent.loaded = true;
                }
                else {
                    showSQL(parent, table_name);
                }
            }
            else {                                                  // 数据库操作失败，打印错误信息
                if (flag) {
                    parent.loaded = false;
                    parent.table_data = [];
                    parent.heads = [];
                    parent.input_item = [];
                }
                console.log(resp.status, resp.details);
                alert(JSON.stringify(resp.details));
            }
        }
    };
    xmlhttp.open("GET", query_url, true);     // 向服务端发出get 请求
    xmlhttp.send();
    console.log('Request sent!\n', query_url);
}

function showSQL(parent, table_name) {
    doSQL(parent, '/api/show_table?table_name=' + table_name, table_name, true);
}

function insertSQL(parent, table_name, new_row) {
    var query_url = "/api/do_query?sql=INSERT INTO " + table_name + " ";
    var values = [];
    for (var item in new_row) {
        if (new_row[item] === null || new_row[item] === '')
            values.push('null');
        else
            values.push('\'' + new_row[item] + '\'');
    }
    query_url += "values (" + values.join(',') + ")";
    doSQL(parent, query_url, table_name, false);
}

function deleteSQL(parent, table_name, id) {
    var query_url = "/api/do_query?sql=DELETE FROM " + table_name + " WHERE id = " + id;
    doSQL(parent, query_url, table_name, false);
}

function updateSQL(parent, table_name, row) {
    var query_url = "/api/do_query?sql=UPDATE " + table_name + " SET ";
    var arr = [];
    for (var item in row) {
        if (row[item] === null || row[item] === '')
            arr.push(item + ' = null');
        else
            arr.push(item + ' = \'' + row[item] + '\'');
    }
    query_url += arr.join(',');
    query_url += " WHERE id = " + row.id;
    doSQL(parent, query_url, table_name, false);
}

export {showSQL, insertSQL, deleteSQL, updateSQL}
