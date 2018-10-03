<template>
    <div id="DataVisualizer">
        <h2>数据库查看器</h2>
        <el-row>
            <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
        <div style="width: 30%; margin: auto;" v-on:keydown.enter="submitLoad">
            <el-input prefix-icon="el-icon-search" placeholder="输入数据库名称..."
                      v-model="table_name" v-on:change="loadQ = false" v-on:keydown.enter="submitLoad">
                <el-button slot="append" icon="el-icon-refresh" v-on:click="submitLoad">载入数据</el-button>
            </el-input>
        </div>

        <!--以下是显示的数据，仅在用户点击了载入数据时显示-->
        <div v-if="loadQ">
            <my-blank></my-blank>
            <table border="1" align="center">
                <tr>
                    <th v-for="head in heads">{{head}}</th>
                </tr>
                <tr v-for="student in students" :key="student.id">
                    <td v-for="item in student">{{item}}</td>
                    <el-button type="danger" icon="el-icon-delete" v-on:click="submitDelete(student.id)" circle></el-button>
                </tr>
            </table>
            <my-blank></my-blank>
            <div style="width: 20%; margin: auto;" v-on:keydown.enter="submitAdd">
                <label>添加数据：</label>
                <el-input type="text" size="mini"
                          v-for="(prompt, index) in heads"
                          v-if="index > 0"
                          v-model="input_item[index - 1]"
                          v-bind:placeholder="prompt">
                </el-input>
                <el-button size="mini" v-on:click="submitAdd">添加</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import MyBlank from '../components/MyBlank'
    import {showSQL, insertSQL, deleteSQL} from '../components/js/DoSQL.js'

    export default {
        name: "DataVisualizer",
        data() {
            return {
                table_name: '',
                heads: [],
                heads_lower: [],
                students: [],
                input_item: [],
                loadQ: false
            }
        },
        mounted: function () {      // 渲染完成后对变量进行初始化
            this.heads = ['ID', 'Nickname', 'Realname', 'Role', 'Motto', 'Registration Date', 'Password'];
            this.heads_lower = ['nickname', 'realname', 'role', 'motto', 'registration_date', 'password'];
            for (let i = 0; i < this.heads.length - 1; i++)     // 没有id这一项
                this.input_item[i] = '';
        },
        methods: {
            submitLoad: function () {     // 向后端发出显示数据库的请求
                showSQL(this, this.table_name);
                this.loadQ = true;
            },
            submitAdd: function () {      // 向后端数据库发出添加数据的请求
                insertSQL(this, this.table_name);
            },
            submitDelete: function (index) {  // 向后端数据库发出删除数据(index)的请求
                deleteSQL(this, this.table_name, index)
            }
        },
        components: {
            MyBlank
        }
    }
</script>

<style scoped>
</style>
