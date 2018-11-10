<template>
    <el-container>
        <el-main>
            <el-table :data="chatrecords" stripe style="width: 100%" @current-change="handleCurrentChange">
                <el-table-column prop="userid" label="发贴人" width="180"></el-table-column>
                <el-table-column prop="message" label="主题" width="180"></el-table-column>
                <el-table-column prop="registration_date" label="发贴时间" width="180"></el-table-column>
            </el-table>
            <el-form>
                <el-form-item label="Input ">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="inputData.message"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">发贴</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onClear">clear</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        data () {
            return {
                chatrecords: [],
                class_id: "undefined",
                inputData: {
                    userId: undefined,
                    classId: undefined,
                    message: undefined,
                }
            };
        },
        mounted: function () {
            this.class_id = this.$route.params.class_id;
            this.inputData.classId = this.class_id;
            this.$http.get('/api/user/session', {}).
                 then(function (res) {
                     this.inputData.userId = res.body.user_id;
                     this.$http.post('/api/chat/info/query', {class_id: this.class_id}).
                          then(function (res) {
                              if (res.body.status === 'NOT FOUND.') {
                                  this.$message("Room " + this.title + " not found!");
                              } else {
                                  this.chatrecords = res.body.chatrecords;
                                  console.log(111);
                              }
                          });
                 });
        },
        methods: {
            onSubmit () {
                this.$http.post('/api/chat/add_comments', {
                    userid: this.inputData.userId,
                    classid: this.inputData.classId,
                    message: this.inputData.message,
                }).
                     then(function (res) {
                         console.log(res);
                         if (res.body.status === 'SUCCESS.') {
                             this.$router.go(0);
                         }
                     });
            },
            onClear () {
                this.$http.post('/api/chat/clear_comments', {classid: this.inputData.classId,}).
                     then(function (res) {
                         console.log(res);
                         if (res.body.status === 'SUCCESS.') {
                             this.chatrecords = [];
                         }
                     });
            },
            handleCurrentChange: function (item) {
                this.$router.push(
                    {name: 'posts', params: {forumid: item.forumid}});
            },
        },
    };
</script>
