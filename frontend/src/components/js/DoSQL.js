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
                    parent.students = resp.results;
                    console.log(parent.students);
                }
                else {
                    showSQL(parent, table_name);
                }
            }
            else {                                                  // 数据库操作失败，打印错误信息
                alert(JSON.stringify(resp.details));
                console.log(resp.status, resp.details);
            }
        }
    };
    xmlhttp.open("GET", query_url, true);     // 向服务端发出get 请求
    xmlhttp.send();
    console.log("Request sent!");
}

function showSQL(parent, table_name) {
    doSQL(parent, './api/show_table?table_name=' + table_name, table_name, true);
}

function insertSQL(parent, table_name) {
    var query_url = "./api/do_query?sql=INSERT INTO " + table_name + " (" + parent.heads_lower.join(',') + ") ";
    var values = [];
    for (let item of parent.input_item) {
        if (item === '')
            values.push('null');
        else
            values.push('\'' + item + '\'');
    }
    query_url += "values (" + values.join(',') + ")";
    doSQL(parent, query_url, table_name, false);
}

function deleteSQL(parent, table_name, index) {
    var query_url = "./api/do_query?sql=DELETE FROM " + table_name + " WHERE id = " + index;
    doSQL(parent, query_url, table_name, false);
}

export {showSQL, insertSQL, deleteSQL}