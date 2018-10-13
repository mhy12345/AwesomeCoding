<template>
    <el-container>
        <el-header>
            <h2>数据库查看器</h2>
        </el-header>
        <el-container id="DataVisualizer" v-loading="loadingQ">
            <el-header class="sticky-top">
                <div id="load-table" style="width: 50%; margin: auto;" v-on:keydown.enter="handleLoad">
                    <el-input prefix-icon="el-icon-search" placeholder="输入数据库名称..." v-model="input.table_name">
                        <el-button slot="append" icon="el-icon-refresh" v-on:click="handleLoad">载入数据</el-button>
                    </el-input>
                </div>
            </el-header>

            <!--以下是显示的数据，仅在用户点击了载入数据时显示-->
            <el-collapse-transition>
                <div v-if="loadedQ" id="visualizer">
                    <!--表格UI-->
                    <el-table id="display-table"
                              :data="table_data"
                              style="width: 100%; margin: auto; padding: 5px;"
                              highlight-current-row stripe>

                        <el-table-column v-for="(col, index) in heads"
                                         :key="index"
                                         :label="col"
                                         align="center"
                                         :prop="col">
                        </el-table-column>

                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="warning"
                                           icon="el-icon-edit" circle
                                           @click="handleEdit(scope.row)">
                                </el-button>
                                <el-button type="danger"
                                           icon="el-icon-delete" circle
                                           @click="handleDelete(scope.row.id)">
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <!--添加数据的UI-->
                    <div id='inputs-add'
                         @keydown.enter="handleAdd"
                         class="sticky-bottom"
                         style="width: 100%; margin: auto;">
                        <el-row>
                            <el-col :span="2"><label>添加数据：</label></el-col>
                            <el-col :span="2"
                                    v-for="(col, index) in heads"
                                    :key="index">
                                <el-input type="text" size="mini" style="width: 98%;"
                                          v-model="input.items[col]"
                                          :placeholder="col">
                                </el-input>
                            </el-col>
                            <el-col :span="2"><el-button size="mini" @click="handleAdd">添加</el-button></el-col>
                        </el-row>
                    </div>

                    <!--修改数据的对话框-->
                    <el-dialog id="dialog-edit"
                               title="修改行"
                               :visible.sync="edit_dialog.visual"
                               width="30%">
                        <div id="change-inputs" @keydown.enter="handleChange">
                            <el-input type="text" size="mini" style="width: 98%; margin-bottom: 10px"
                                      v-for="(col, index) in heads"
                                      :key="index"
                                      v-model="edit_dialog.row[col]"
                                      :placeholder="col">
                            </el-input>
                        </div>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="edit_dialog.visual = false">取 消</el-button>
                    <el-button type="primary" @click="handleChange">确 认</el-button>
                </span>
                    </el-dialog>
                </div>
            </el-collapse-transition>

        </el-container>
    </el-container>
</template>

<script>
import {copy} from "../../../utils/Copy";
import {showSQL, getSQLColumns, insertSQL, deleteSQL, updateSQL} from '../../../utils/DoSQL.js'

export default {
    name: "DataVisualizer",
    data() {
        return {
            table_name: '',
            heads: [],          // 表头
            table_data: [],
            input: {            // 用户输入的内容
                table_name: 'users',
                items: {},
            },
            edit_dialog: {      // 编辑对话框的属性
                visual: false,
                row: {}
            },
            loadingQ: false,    // 是否处于加载中的状态
            loadedQ: false,     // 是否已经加载完成
        }
    },
    methods: {
        showUnknownError: function (err) {
            console.log("UNKNOWN ERROR!", err);
            var msg = "操作失败。" + JSON.stringify(err['details']);
            this.$message.error(msg);
        },
        handleLoad: function () {     // 向后端发出显示数据库的请求
            this.loadingQ = true;
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
                this.loadingQ = false;
                this.loadedQ = true;
            }).
            catch((err)=>{                                    // 某个步骤失败，交给 showUnknownError 统一处理
                this.loadingQ = false;
                this.loadedQ = false;
                this.showUnknownError(err);
            });
        },
        handleAdd: function () {      // 向后端数据库发出添加数据的请求
            this.loadingQ = true;
            insertSQL(this, this.table_name, this.input.items).
            then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).
            then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
                this.loadingQ = false;
            }).
            catch((err) =>{
                this.loadingQ = false;
                this.showUnknownError(err);
            })
        },
        handleDelete: function (id) {  // 向后端数据库发出删除数据的请求
            this.loadingQ = true;
            deleteSQL(this, this.table_name, id).
            then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).
            then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
                this.loadingQ = false;
            }).
            catch((err) => {
                this.loadingQ = false;
                this.showUnknownError(err);
            });
        },
        handleEdit: function (row) {    // 调出修改行的对话框
            this.edit_dialog.row = copy(row);       // 原先的 row 是表中的引用，因此要先复制一份到对话框
            this.edit_dialog.visual = true;
        },
        handleChange: function () {   // 向后端数据库发出修改数据的请求
            this.loadingQ = true;
            this.edit_dialog.visual = false;
            updateSQL(this, this.table_name, this.edit_dialog.row).then((resp) => {
                console.log(resp);
                return showSQL(this, this.table_name);
            }).then((resp) => {
                console.log(resp);
                this.table_data = resp.results;
                this.loadingQ = false;
            }).catch((err) =>{
                this.loadingQ = false;
                this.showUnknownError(err);
            });
        }
    },
}
</script>

<style scoped>
</style>
