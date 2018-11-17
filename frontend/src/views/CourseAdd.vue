<template>
    <el-container>
        <el-header>
            <h2>新建课程</h2>
        </el-header>
        <el-main>
            <el-form ref="form" :model="CourseData" label-width="140px">
                <el-form-item label="课程名称：">
                    <el-input v-model="CourseData.title" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="课程权限：">
                    <el-radio v-model="CourseData.type" label=1>公开</el-radio>
                    <el-radio v-model="CourseData.type" label=2>私密</el-radio>
                </el-form-item>
                <el-form-item label="课程资源：">
                    <el-transfer v-model="CourseData.resources" :data="avaliable_resources"
                                 :titles="['可用资源','已选资源']"></el-transfer>
                </el-form-item>
                <el-form-item label="课程简介：">
					<div @click='onEdit(CourseData.description)'>[编辑]</div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                </el-form-item>
				<ContentEditor ref=editor>
				</ContentEditor>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    /* eslint-disable camelcase */
    import {avaliable_resources, default_resources} from '../utils/Resources';
	import ContentEditor from '../components/components/ContentEditor.vue';
	var randomString = require('../utils/funcs').randomString;

    export default {
        data () {
            return {
                CourseData: {
                    title: "",
                    type: "1",
                    resources: default_resources,
					notice: randomString(16),
					description: randomString(16),
                },
                avaliable_resources: avaliable_resources
            };
        },
        methods: {
            onSubmit () {
                this.$http.post('/api/class/create', this.CourseData).then(function (res) {
                    this.$message(res.bodyText);
                });
			},
			onEdit (content_id) {
				this.$refs.editor.handleOpen(content_id);
			},
		},
		components: {'ContentEditor': ContentEditor}
	};
</script>

<style scoped>
h2 {
	text-align: center;
}
</style>
