<template>
    <el-container>
        <el-main>
            <el-row>
                <el-col :span='2'> 发贴人</el-col>
                <el-col :span='4'> {{userid}}</el-col>
            </el-row>
            <el-row>
                <el-col :span='2'> 主题:</el-col>
                <el-col :span='20'>{{theme}}</el-col>
            </el-row>
            <el-row v-for="record in chatrecords">
                <el-col :span='4'> {{record.userid}}</el-col>
                <el-col :span='16'> {{record.message}}</el-col>
                <el-col :span='4'> {{record.registration_date}}</el-col>
            </el-row>
            <el-form>
                <el-form-item label="Input ">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="inputData.message"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">回复</el-button>
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
                forumid: "undefined",
                classid: "undefined",
                userid: "undefined",//发贴人
                theme: "undefined",//发贴主题
                inputData: {
                    userId: undefined,
                    forumId: undefined,
                    message: undefined,
                    classId: undefined,
                }
            };
        },
        mounted: function () {
            this.forumid = this.$route.query.forumid;
            this.inputData.forumId = this.forumid;
            this.userid = this.$route.query.userid;
            this.theme = this.$route.query.theme;
            this.$http.get('/api/user/session', {}).
                 then((res) => {
                     this.inputData.userId = res.body.user_id;
                     this.$http.post('/api/chat/info/query/posts', { forumid: this.forumid }).
                          then(function (res) {
                              if (res.body.status === 'NOT FOUND.') {
                                  this.$message("Room " + this.title + " not found!");
                              } else {
                                  this.chatrecords = res.body.chatrecords;
                              }
                          });
                 });
        },
        methods: {
            onSubmit () {
                this.$http.post('/api/chat/add_comments/posts', {
                    userid: this.inputData.userId,
                    forumid: this.forumid,
                    message: this.inputData.message,
                    classid: this.inputData.classId,
                }).
                     then(function (res) {
                         // console.log(res);
                         if (res.body.status === 'SUCCESS.') {
                             // console.log(res.body.results);
                             this.chatrecords.push(res.body.results);
                         }
                     });
            },
            onClear () {
                this.$http.post('/api/chat/clear_comments', {classid: this.inputData.classId,}).
                     then(function (res) {
                         // console.log(res);
                         if (res.body.status === 'SUCCESS.') {
                             this.chatrecords = [];
                         }
                     });
            },
        },
    };
</script>
