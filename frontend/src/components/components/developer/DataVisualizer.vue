<template>
    <el-container id="DataVisualizer">
        <h2>数据库查看器</h2>
        <el-header>
            <div id="load-table" style="width: 30%; margin: auto;" v-on:keydown.enter="submitLoad">
                <el-input prefix-icon="el-icon-search" placeholder="输入数据库名称..." v-model="input.table_name">
                    <el-button slot="append" icon="el-icon-refresh" v-on:click="submitLoad">载入数据</el-button>
                </el-input>
            </div>
        </el-header>

        <!--以下是显示的数据，仅在用户点击了载入数据时显示-->
        <el-collapse-transition>
        <div v-if="loaded" id="visualizer">
            <my-blank></my-blank>
            <!--表格UI-->
            <el-table id="display-table"
                      :data="table_data"
                      style="width: 80%; margin: auto"
                      highlight-current-row stripe>

                <el-table-column v-for="col in heads"
                                 :label="col"
                                 align="center"
                                 :prop="col">
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="warning"
                                   icon="el-icon-edit" circle
                                   @click="submitEdit(scope.row)">
                        </el-button>
                        <el-button type="danger"
                                   icon="el-icon-delete" circle
                                   @click="submitDelete(scope.row.id)">
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

            <my-blank></my-blank>

            <!--添加数据的UI-->
            <div id='inputs-add' @keydown.enter="submitAdd">
                <el-row style="width: 80%; margin: auto;">
                    <el-col :span="2"><label>添加数据：</label></el-col>
                    <el-col :span="3" v-for="col in heads">
                        <el-input type="text" size="mini" style="width: 98%;"
                                  v-model="input.items[col]"
                                  :placeholder="col">
                        </el-input>
                    </el-col>
                    <el-col :span="1"><el-button size="mini" @click="submitAdd">添加</el-button></el-col>
                </el-row>
            </div>
            <my-blank></my-blank>

            <!--修改数据的对话框-->
            <el-dialog id="dialog-edit"
                       title="修改行"
                       :visible.sync="edit_dialog.visual"
                       width="30%">
                <div id="change-inputs" @keydown.enter="submitChange">
                    <el-input type="text" size="mini" style="width: 98%; margin-bottom: 10px"
                              v-for="col in heads"
                              v-model="edit_dialog.row[col]"
                              :placeholder="col">
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="edit_dialog.visual = false">取 消</el-button>
                    <el-button type="primary" @click="submitChange">确 认</el-button>
                </span>
            </el-dialog>
        </div>
        </el-collapse-transition>

    </el-container>
</template>

<script>
import MyBlank from '../MyBlank.vue'
import {copy, deepCopy} from "../../../utils/Copy";
import {showSQL, getSQLColumns, insertSQL, deleteSQL, updateSQL} from '../../../utils/DoSQL.js'

export default {
    //name: "DataVisualizer",
    data() {
        return {
            table_name: '',
            heads: [],          // 表头
            table_data: [],
            input: {            // 用户输入的内容
                table_name: 'users',
                items: {},
            },
            loaded: false,
            edit_dialog: {      // 编辑对话框的属性
                visual: false,
                row: {}
            }
        }
    },
    mounted: function () {      // 渲染完成后对变量进行初始化
        // for (let i = 0; i < this.heads.length; i++)
        //     this.input.items[i] = '';
    },
    methods: {
        handleError: function (resp) {
            console.log("DB ERROR!", resp);
            var msg = "操作失败。" + JSON.stringify(resp['details']);
            this.$message.error(msg);
        },
        submitLoad: function () {     // 向后端发出显示数据库的请求
            this.loaded = false;
            this.table_name = this.input.table_name;
            this.heads = [];
            this.input.items = {};

            getSQLColumns(this, this.table_name).                             // 异步执行请求，先获取表头
            then((resp) => {                                         // 成功，被 getSQLColumns 的 resolve 调用
                console.log(resp);
                for (var item of resp.results) {
                    this.heads.push(item['COLUMN_NAME']);
                    this.input.items[item['COLUMN_NAME']] = '';
                }
                return showSQL(this, this.table_name);                        // 然后获取表中数据
            }).
            then((resp) => {                                         // 成功，被 showSQL 的 resolve 调用
                console.log(resp);
                this.table_data = resp.results;
                this.loaded = true;
            }).
            catch(this.handleError);                                    // 某个步骤失败，交给 handleError 统一处理

        },
        submitAdd: function () {      // 向后端数据库发出添加数据的请求
            insertSQL(this, this.table_name, this.input.items).
            then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).
            then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
            }).
            catch(this.handleError)
        },
        submitDelete: function (id) {  // 向后端数据库发出删除数据的请求
            deleteSQL(this, this.table_name, id).
            then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).
            then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
            }).
            catch(this.handleError);
        },
        submitEdit: function (row) {    // 调出修改行的对话框
            this.edit_dialog.row = copy(row);       // 原先的 row 是表中的引用，因此要先复制一份到对话框
            this.edit_dialog.visual = true;
        },
        submitChange: function () {   // 向后端数据库发出修改数据的请求
            this.edit_dialog.visual = false;
            updateSQL(this, this.table_name, this.edit_dialog.row).then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
            }).catch(this.handleError);
        }
    },
    components: {
        MyBlank
    }
}
</script>

<style scoped>
</style>
