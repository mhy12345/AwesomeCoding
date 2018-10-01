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
                students: [ { "id": 1, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 2, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 3, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 4, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 5, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 6, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 7, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 8, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 9, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 10, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" }, { "id": 11, "nickname": "mhy", "realname": null, "role": 1, "motto": null, "registration_date": null, "password": "123" } ]
            }
        }
    }
</script>

<style scoped>

</style>