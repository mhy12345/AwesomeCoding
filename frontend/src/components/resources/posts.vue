<template>
    <el-container>
        <el-main>
            <el-card class="box-card">
                <div slot="header" class="clear-fix">
                    <h2>主题贴</h2>
                </div>
                <div>
                    <el-row>
                        <el-col :span='10'> <h1>发贴人</h1> </el-col>
                        <el-col :span='14'> <h1>{{nickname}}</h1> </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='10'> <h1>主题</h1> </el-col>
                        <el-col :span='14'> <h1>{{theme}}</h1> </el-col>
                    </el-row>
                </div>
                <el-table :data="chatrecords" stripe style="width: 100%">
                    <el-table-column prop="nickname" label="回复人" width="180"></el-table-column>
                    <el-table-column prop="message" label="回复内容" width="280"></el-table-column>
                    <el-table-column prop="registration_date" label="回复时间" width="180"></el-table-column>
                </el-table>
            </el-card>
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
                nickname: "undefined",
                inputData: {
                    userId: undefined,
                    forumId: undefined,
                    message: undefined,
                    classId: undefined,
                    nickname: undefined,
                }
            };
        },
        mounted: function () {
            this.forumid = this.$route.params.forumid;
            this.inputData.forumId = this.forumid;
            this.$http.get('/api/user/session', {}).
                then((res) => {
                    this.inputData.userId = res.body.user_id;
                    this.inputData.nickname = res.body.nickname;
                    this.$http.post('/api/chat/info/query/posts', {forumid: this.forumid}).
                        then(function (res) {
                            if (res.body.status === 'NOT FOUND.') {
                                this.$message("Room " + this.title + " not found!");
                            } else {
                                this.chatrecords = res.body.chatrecords;
                                this.userid = res.body.userid;
                                this.classid = res.body.classid;
                                this.theme = res.body.theme;
                                this.nickname = res.body.nickname;                  
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
                    nickname: this.inputData.nickname,
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

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clear-fix:before,
    .clear-fix:after {
        display: table;
        content: "";
    }

    .clear-fix:after {
        clear: both
    }

    .box-card {
        width: 1080px;
    }

    .input-box {
        width: 100%;
        margin-bottom: 20px;
    }

    .register-button {
        margin-top: 30px;
        margin-bottom: 30px;
        width: 200px;
    }

    .verification-button {
        position: relative;
        margin-left: 20px;
    }

    .input-error {
        background-color: #ffa392;
        margin-bottom: 20px;
    }

    .register-prompt {
        position: relative;
        margin-top: 5px;
    }

    .option-icon {
        float: right;
        height: 80%;
    }
</style>
