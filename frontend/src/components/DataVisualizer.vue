<template>
    <div id="DataVisualizer">
        <h3>数据库查看器</h3>
        <table border="1" align="center">
            <tr>
                <th v-for="head in heads">{{head}}</th>
            </tr>
            <tr v-for="student in students" :key="student.id">
                <td v-for="item in student">{{item}}</td>
            </tr>
        </table>
        <el-button v-on:click="loadDoc">载入数据</el-button>
        <!--<li v-for="item in items"-->
    </div>
</template>

<script>
    export default {
        name: "DataVisualizer",
        props:['data'],
        data() {
            return {
                heads: ['ID', 'Nickname', 'Realname', 'Role', 'Motto', 'Registration Date', 'Password'],
                students: []
            }
        },
        created: function () {

        },
        methods: {
            loadDoc: function ()
            {
                // this.students.push(JSON.parse('{ "id": 1, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }'));
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
                xmlhttp.onreadystatechange= () =>       // 载入数据到students列表，注意这里一定要使用箭头函数，因为函数中使用了this指针，而传数据是异步的
                {
                    if (xmlhttp.readyState===4 && xmlhttp.status===200)
                    {
                        let resp = eval('(' + xmlhttp.responseText + ')');
                        this.students = resp.results;
                        console.log(this.students);
                    }
                };
                xmlhttp.open("GET","https://awesomecoding_fantastic67.app.secoder.net/api/show_table?table_name=users", false);     // 向服务端发出get 请求
                xmlhttp.send();
                console.log("Request sent!");
            }
        }
    }
</script>

<style scoped>

</style>