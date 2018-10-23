<template>
    <el-container>
        <el-header>
            <h2>课程设置</h2>
        </el-header>
        <el-main>
            <el-form ref="form" :model="CourseData" label-width="140px" v-loading='loading'>
                <el-form-item label="课程名称：">
                    <el-input v-model="CourseData.title" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="课程权限：">
                    <el-radio v-model="CourseData.type" label=1>公开</el-radio>
                    <el-radio v-model="CourseData.type" label=2>私密</el-radio>
                </el-form-item>
                <el-form-item label="课程资源：">
                    <el-transfer v-model="resources" :data="avaliable_resources"
                                 :titles="['可用资源','已选资源']"></el-transfer>
                </el-form-item>
                <el-form-item label="课程简介：">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="CourseData.description"></el-input>
                </el-form-item>
                <el-form-item label="课程公告：">
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="CourseData.notice"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">更新</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    /* eslint-disable camelcase */

    import {avaliable_resources} from '../../utils/Resources';

    export default {
        data() {
            return {
                class_id: undefined,
                CourseData: {
                    title: undefined,
                    name: undefined,
                    type: undefined,
                },
                resources: undefined,
                loading: true,
                avaliable_resources: avaliable_resources
            };
        },
        mounted: function () {
            this.class_id = this.$route.params.class_id;
            this.$http.post('/api/class/info/query', {class_id: this.class_id}).then(function (res) {
                if (res.body.status === 'NOT FOUND.') {
                    this.$message("Room " + this.class_id + " not found!");
                } else {
                    this.CourseData = res.body.info;
                    this.resources = res.body.resources;
                    this.loading = false;
                }
            });
        },
        methods: {
            onSubmit() {
                console.log(this.CourseData);
                this.$http.post('/api/class/info/update', {
                    resources: this.resources,
                    info: this.CourseData,
                    class_id: this.class_id
                }).then(function (res) {
                    console.log(res.bodyText);
                    this.$message("课程信息已更新");
                    location.reload();
                });
            }
        }
    };
</script>

<style scoped>
    h2 {
        text-align: center;
    }
</style>
