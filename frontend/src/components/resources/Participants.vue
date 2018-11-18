<template>
    <el-container>
        <!--班级成员管理-->
        <el-collapse v-model="active_name">
            <el-collapse-item title="班级成员" name="class-users">
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
                            <el-table-column align="center" label="移出教室" v-if='course_status.role!==2'>
                                <template slot-scope="scope">
                                    <el-button type="danger"
                                               icon="el-icon-delete" circle
                                               v-if='scope.row.role!==0'
                                               @click="handleDelete(scope.row.id, scope.row.realname)">
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="指定助教" v-if='course_status.role===0'>
                                <template slot-scope="scope">
                                    <el-button type="primary"
                                               icon="el-icon-edit" circle
                                               v-if='scope.row.role===2'
                                               @click="handleAssignTA(scope.row.id)">
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="取消助教身份" v-if='course_status.role===0'>
                                <template slot-scope="scope">
                                    <el-button type="primary"
                                               icon="el-icon-edit" circle
                                               v-if='scope.row.role===1'
                                               @click="handleCancelTA(scope.row.id)">
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="item" v-if='course_status.role!==2'>
                        <el-form :model="ruleForm"
                                 ref="ruleForm">
                            <el-form-item>
                                <el-upload class="upload-demo"
                                           action="/api/file/import"
                                           :on-success="successUpload"
                                           :file-list="fileList">
                                    <el-tooltip content="请上传一个xlsx文件，文件中应含有需导入学生的真实姓名">
                                        <el-button size="small"
                                                   type="primary">导入名单
                                        </el-button>
                                    </el-tooltip>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item title="黑名单" name="blacklisting">
                <div id="Blacklisting" v-loading="black.loadingQ">
                    <div v-if="black.loadedQ">
                        <el-table id="blacklisting-table"
                                  :data="blacklisting_data"
                                  :style="display_config"
                                  highlight-current-row stripe>
                            <el-table-column v-for="obj in black.heads"
                                             :key="obj.idx"
                                             :label="obj.title"
                                             align="center"
                                             :prop="obj.idx">
                            </el-table-column>
                            <el-table-column align="center" label="取消拉黑" v-if='course_status.role!==2'>
                                <template slot-scope="scope">
                                    <el-button type="warning"
                                               icon="el-icon-remove-outline" circle
                                               @click="handleCancelBlacklisting(scope.row.user_id)">
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
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
                },
                ruleForm: {fileList: []},
                fileList: [],
                active_name: 'class-users',
                blacklisting_data: [],
                black: {    // 黑名单表
                    loadedQ: false,
                    loadingQ: false,
                    heads: [
                        { idx: 'user_id', title: '用户id' },
                        { idx: 'realname', title: '真实姓名' },
                        { idx: 'date_time', title: '拉黑时间' }
                    ]
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

            this.$http.post('/api/class/participants/show', {class_id: this.class_id}, null).
                 then((resp) => {										 // 成功，被 showSQL 的 resolve 调用
                     this.table_data = resp.body.results;
                     this.loadingQ = false;
                     this.loadedQ = true;
                 }).
                 catch((resp) => {
                     this.loadingQ = false;
                     this.loadedQ = true;
                     if (resp.body.details === 'NOT_LOGIN.') {
                         this.$message("请登录...");
                     } else if (resp.body.details === "NOT_IN_CLASS.") {
                         this.$message("请先加入班级");
                     } else {
                         this.$message("未知错误");
                     }
                 });

            this.black.loadingQ = true;
            this.$http.post('/api/class/participants/show_blacklisting', { class_id: this.class_id }).
                 then((res) => {
                     this.black.loadingQ = false;
                     this.black.loadedQ = true;
                     this.blacklisting_data = res.body.results;
                 }).
                 catch((err) => {
                     this.black.loadingQ = false;
                     this.black.loadedQ = true;
                     console.log('[Participants]', err);
                 });
        },
        methods: {
            handleAdd: function () { // 向后端数据库发出添加数据的请求
                this.loadingQ = true;
                //TODO
            },
            handleDelete: function (id, realname) { // 向后端数据库发出删除数据的请求
                this.
                    $confirm(`真的要将${realname}移出教室吗？`, '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).
                    then(() => {
                        this.loadingQ = true;
                        return this.$http.post('/api/class/participants/delete', {
                            class_id: this.class_id,
                            user_id: id
                        }, null);
                    }).
                    then(() => {
                        this.$message.success("成功");
                        this.loadingQ = false;

                    }).
                    catch(() => {
                        this.$message.info("失败");
                        this.loadingQ = false;
                    });
            },
            handleAssignTA: function (id) { // 向后端数据库发出指定助教的请求
                this.loadingQ = true;
                this.$http.post('/api/class/participants/assignTA', {class_id: this.class_id, user_id: id}, null).
                     then(() => {
                         this.$message("成功");
                         this.loadingQ = false;
                     }).
                     catch(() => {
                         this.$message("失败");
                         this.loadingQ = false;
                     });
            },
            handleCancelTA: function (id) { // 向后端数据库发出指定助教的请求
                this.loadingQ = true;
                this.$http.post('/api/class/participants/cancelTA', {class_id: this.class_id, user_id: id}, null).
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
            successUpload: function (response, file, fileList, $event) {
                this.loadingQ = true;
                this.$http.post('/api/class/addstudents', {class_id: this.class_id, filename: response.filename}, null).
                     then((resp) => {
                         if(resp.body.status === 'SUCCESS.') {
                             this.$message("成功");
                             this.loadingQ = false;
                         } else {
                             if(resp.body.details === 'NO STUDENTS FILE') {
                                 this.$message("请上传xlsx文件");
                             }
                             if(resp.body.details === 'NOT TEACHER'){
                                 this.$message("您的身份没有导入学生的权限");
                             }
                             this.loadingQ = false;
                         }
                     }).
                     catch((resp) => {
                         if(resp.body.details === 'NO STUDENTS FILE') {
                             this.$message("请上传一个xlsx文件");
                         }
                         if(resp.body.details === 'NOT TEACHER'){
                             this.$message("您的身份没有导入学生的权限");
                         }
                         this.loadingQ = false;
                     });
            },
            handleCancelBlacklisting(user_id) { // 取消拉黑 user_id
                this.$http.post('/api/class/participants/white', { class_id: this.class_id, user_id: user_id }).
                     then((res) => {
                         // this.blacklisting_data.splice() todo
                         this.$message('取消拉黑成功。');
                     }).
                     catch((res) => {
                         this.$message('取消失败，见console');
                         console.log(res);
                     });
            }
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
