<template>
    <div id="DataVisualizer">
        <h2>数据库查看器</h2>
        <div id="load-table" style="width: 30%; margin: auto;" v-on:keydown.enter="submitLoad">
            <el-input prefix-icon="el-icon-search" placeholder="输入数据库名称..." v-model="input_table_name">
                <el-button slot="append" icon="el-icon-refresh" v-on:click="submitLoad">载入数据</el-button>
            </el-input>
        </div>

        <!--以下是显示的数据，仅在用户点击了载入数据时显示-->
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
                                 :prop="col.toLowerCase()">
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
                    <el-col :span="3" v-for="(prompt, index) in heads">
                        <el-input type="text" size="mini" style="width: 98%;"
                                  v-model="input_item[index]"
                                  v-bind:placeholder="prompt">
                        </el-input>
                    </el-col>
                    <el-col :span="1"><el-button size="mini" @click="submitAdd">添加</el-button></el-col>
                </el-row>
            </div>
            <my-blank></my-blank>

            <!--修改数据的对话框-->
            <el-dialog id="dialog-edit"
                       title="修改行"
                       :visible.sync="dialogVisible"
                       width="30%">
                <div id="change-inputs" @keydown.enter="submitChange">
                    <el-input type="text" size="mini" style="width: 98%; margin-bottom: 10px"
                              v-for="col in heads"
                              v-model="selectedRow[col]"
                              :placeholder="col">
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitChange">确 认</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
import MyBlank from '../components/MyBlank'
import {copy, deepCopy} from "../components/js/Copy";
// import EditDialog from '../components/EditDialog'
import {showSQL, insertSQL, deleteSQL, updateSQL} from '../components/js/DoSQL.js'

export default {
    name: "DataVisualizer",
    data() {
        return {
            input_table_name: '',
            table_name: '',
            heads: [],
            table_data: [],
            input_item: [],
            loaded: false,
            dialogVisible: false,
            selectedRow: {}
        }
    },
    mounted: function () {      // 渲染完成后对变量进行初始化
        // for (let i = 0; i < this.heads.length; i++)
        //     this.input_item[i] = '';
    },
    methods: {
        submitLoad: function () {     // 向后端发出显示数据库的请求
            this.table_name = this.input_table_name;
            showSQL(this, this.table_name);
        },
        submitAdd: function () {      // 向后端数据库发出添加数据的请求
            insertSQL(this, this.table_name, this.input_item);
        },
        submitDelete: function (id) {  // 向后端数据库发出删除数据的请求
            deleteSQL(this, this.table_name, id)
        },
        submitEdit: function (row) {    // 调出修改行的对话框
            this.selectedRow = copy(row);
            this.dialogVisible = true;
        },
        submitChange: function () {   // 向后端数据库发出修改数据的请求
            this.dialogVisible = false;
            updateSQL(this, this.table_name, this.selectedRow)
        }
    },
    components: {
        MyBlank
    }
}
</script>

<style scoped>
</style>
