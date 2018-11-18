<template>
    <div>
        <h2>邀请</h2>
        <p> 你的邀请码为：{{invitation_code}} </p>
        <p> 正在为你重定向跳转... </p>
    </div>
</template>

<script>
    /* eslint-disable camelcase,no-unused-vars */
    var translate = {
        undefined: '',
        'NOT_LOGIN.': '请登录。',
        'NOT_STUDENT.': '只有学生账户可以加入班级。',
        'ALREADY_IN.': '你已经在班级中。',
        'IN_BLACKLISTING.': '你在黑名单中，不能加入课程，请联系老师。'
    };
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
            this.$http.post('/api/class/invite/check', {invitation_code: this.invitation_code}, null).
                then(function (res) {
                    this.class_id = res.body.class_id;
                    return this.$confirm('你即将加入班级 ' + res.body.class_title + '. 是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                     });
                 }).
                 then(() => {
                     return this.$http.post('/api/class/join', {class_id: this.class_id}, null);
                 }).
                 then((res) => {
                     this.$message.success('成功加入班级');
                     self.location = document.referrer;
                 }).
                 catch((res) => {
                     this.$message.error('加入班级失败。' + translate[res.body]);
                 });
        }
    };
</script>
