function doSQL (parent, query_url)
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
    xmlhttp.onreadystatechange = () =>       // 载入数据到students列表，注意这里一定要使用箭头函数，因为函数中使用了this指针，而传数据是异步的
    {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let resp = eval('(' + xmlhttp.responseText + ')');
            if (resp.status === 'SUCCESS.') {
                parent.students = resp.results;
                console.log(parent.students);
            }
            else {
                alert(JSON.stringify(resp.details));
                console.log(resp.status, resp.details);
            }
        }
    };
    xmlhttp.open("GET", "./api/" + query_url, false);     // 向服务端发出get 请求，建议使用同步操作，即false
    xmlhttp.send();
    console.log("Request sent!");
}

export {doSQL}