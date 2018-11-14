<template>
    <div>
        <h2>邀请</h2>
        <p> 你的邀请码为：{{invitation_code}} </p>
        <p> 正在为你重定向跳转... </p>
    </div>
</template>

<script>
    /* eslint-disable camelcase,no-unused-vars */

    export default {
        data: function () {
            return {
                invitation_code: undefined,
                class_id: undefined
            };
        },
        computed: {},
        mounted: function () {
            this.invitation_code = this.$route.params.invitation_code;
            let _this = this;
            this.$http.post('/api/class/invite/check', {invitation_code: this.invitation_code}, null).
                 then(function (res) {
                     this.class_id = res.body.class_id;
                     return this.$confirm('你即将加入班级 ' + res.body.class_title + '. 是否继续?', '提示', {
                         confirmButtonText: '继续',
                         cancelButtonText: '取消',
                         type: 'warning'
                     });
                 }).
                 then(function () {
                     return this.$http.post('/api/class/join', {class_id: this.class_id}, null);
                 }).
                 then((res) => {
                     _this.$message({
                         type: 'success',
                         message: '成功加入班级'
                     });
					 self.location=document.referrer;
                 }).
                 catch((res) => {
                     let translate = {
                         undefined: '',
                         'NOT_LOGIN.': '请登录.',
                         'NOT_STUDENT.': '只有学生账户可以加入班级',
                         'ALREADY_IN.': '你已经在班级中了'
                     };
                     this.$message({
                         type: 'info',
                         message: '加入班级失败...' + translate[res.body]
                     });
					 self.location=document.referrer;
                 });
        }
    };
</script>
