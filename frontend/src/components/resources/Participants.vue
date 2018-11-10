<template>
    <el-container>
        <!--<el-header>-->
            <!--<h3>班级成员管理</h3>-->
        <!--</el-header>-->
        <div id="DataVisualizer" v-loading="loadingQ">
            <div v-if="loadedQ">
                <el-table id="display-table"
                          :data="fancy_data"
                          :style="display_config"
                          highlight-current-row stripe>
                    <el-table-column v-for="obj in heads"
                                     :key="obj.idx"
                                     :label="obj.title"
                                     align="center"
                                     :prop="obj.idx">
                    </el-table-column>
                    <el-table-column align="center" label="操作" v-if='course_status.role!==2'>
                        <template slot-scope="scope">
                            <el-button type="danger"
                                       icon="el-icon-delete" circle
                                       @click="handleDelete(scope.row.id)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="item" v-if='course_status.role!==2'>
                <el-tooltip content="请上传一个名为students.xlsx的xlsx文件，文件中应含有需导入学生的真实姓名">
                    <el-button type='primary' style='width:100%' @click='handleImportStudents'> 导入学生
                    </el-button>
                </el-tooltip>
            </div>
        </div>
    </el-container>
</template>

<script>

    export default {
        data () {
            return {
                table_name: '',
                heads: [
                    {idx: 'nickname', title: '昵称'},
                    {idx: 'realname', title: '真实姓名'},
                    {idx: 'email', title: '邮箱'},
                    {idx: 'role_title', title: '角色'}
                ], // 表头
                table_data: [],
                input: { // 用户输入的内容
                    table_name: 'users',
                    items: {},
                },
                edit_dialog: { // 编辑对话框的属性
                    visual: false,
                    row: {}
                },
                loadingQ: false, // 是否处于加载中的状态
                loadedQ: false, // 是否已经加载完成
                display_config: {
                    width: '1000px',
                    margin: 'auto',
                    padding: '5px'
                }
            };
        },
        props: ['course_status', 'table_width'],
        computed: {
            fancy_data: function () {
                let data = [];
                for (let item of this.table_data) {
                    if (item.role === 0) {
                        item.role_title = '教师';
                    } else if (item.role === 1) {
                        item.role_title = '助教';
                    } else if (item.role === 2) {
                        item.role_title = '学生';
                    }
                    data.push(item);
                    console.log(item);
                }
                return data;
            }
        },
        mounted: function () {
            if (this.table_width) { // 若父页面传来了表的参数，就修改配置
                this.display_config.width = this.table_width;
            }
            this.class_id = this.$route.params.class_id;
            this.loadingQ = true;//...

            let _this = this;

            this.$http.post('/api/class/participants/show', {class_id: this.class_id}, null).
                 then((resp) => {										 // 成功，被 showSQL 的 resolve 调用
                     this.table_data = resp.body.results;
                     console.log(this.table_data);
                     this.loadingQ = false;
                     this.loadedQ = true;
                 }).
                 catch((resp) => {
                     this.loadingQ = false;
                     this.loadedQ = false;
                     if (resp.body === 'NOT_LOGIN.') {
                         _this.$message("请登录...");
                     } else if (resp.body === "NOT_IN_CLASS.") {
                         _this.$message("请先加入班级");
                     } else {
                         _this.$message("未知错误");
                     }
                 });
        },
        methods: {
            handleAdd: function () { // 向后端数据库发出添加数据的请求
                this.loadingQ = true;
                //TODO
            },
            handleDelete: function (id) { // 向后端数据库发出删除数据的请求
                this.loadingQ = true;
                this.$http.post('/api/class/participants/delete', {class_id: this.class_id, user_id: id}, null).
                     then(() => {
                         this.$message("成功");
                         this.loadingQ = false;
                     }).
                     catch(() => {
                         this.$message("失败");
                         this.loadingQ = false;
                     });
            },
            handleChange: function () { // 向后端数据库发出修改数据的请求
                this.loadingQ = true;
                this.edit_dialog.visual = false;
                //TODO
            },
            handleImportStudents: function() {
                this.loadingQ = true;
                this.$http.post('/api/class/addstudents', {class_id: this.class_id}, null).
                    then((resp) => {
                        if(resp.body.status === 'SUCCESS.') {
                            this.$message("成功");
                            this.loadingQ = false;
                        }
                        else {
                            if(resp.body.details === 'NO STUDENTS FILE') {
                                this.$message("请上传一个名为students.xlsx的xlsx文件");
                            }
                            if(resp.body.details === 'NOT TEACHER'){
                                this.$message("您的身份没有导入学生的权限");
                            }
                            this.loadingQ = false;
                        }
                    }).
                    catch((resp) => {
                        if(resp.body.details === 'NO STUDENTS FILE') {
                            this.$message("请上传一个名为students.xlsx的xlsx文件");
                        }
                        if(resp.body.details === 'NOT TEACHER'){
                            this.$message("您的身份没有导入学生的权限");
                        }
                        this.loadingQ = false;
                    });
            },
        },
    };
</script>

<style scoped>
    .item {
      margin: 4px;
      width: 100px;
      text-align: center;
    }
</style>
