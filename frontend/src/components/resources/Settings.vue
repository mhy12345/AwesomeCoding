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
					<ContentDisplay @click.native='onEdit(CourseData.description)' :border='true' ref='description_display'>
					</ContentDisplay>
                </el-form-item>
                <el-form-item label="课程公告：">
					<ContentDisplay @click.native='onEdit(CourseData.notice)' :border='true' ref='notice_display'>
					</ContentDisplay>
                </el-form-item>

                <el-form-item label="上传课程图片：">
                    <el-upload
                        action="/api/file/uploadcourseimg"
                        list-type="picture-card"
                        :data='{class:class_id}'
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">更新</el-button>
                </el-form-item>
                <ContentEditor ref=editor
					@updated='handleUpdate'
				>
				</ContentEditor>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
/* eslint-disable camelcase */

import {avaliable_resources} from '../../utils/Resources';
import ContentEditor from '../components/ContentEditor.vue';
import ContentDisplay from '../components/ContentDisplay.vue';
var randomString = require('../../utils/funcs').randomString;

export default {
	data () {
		return {
			class_id: undefined,
			CourseData: {
				title: undefined,
				name: undefined,
				type: undefined,
			},
			resources: undefined,
			loading: true,
			avaliable_resources: avaliable_resources,
            dialogImageUrl: '',
            dialogVisible: false
		};
	},
	mounted: function () {
		this.class_id = this.$route.params.class_id;
		this.$http.post('/api/class/info/query', {class_id: this.class_id}).
			then((res) => {
				if (res.body.status === 'NOT FOUND.') {
					this.$message("Room " + this.class_id + " not found!");
				} else {
					this.CourseData = res.body.info;
					this.resources = res.body.resources;
					this.loading = false;
					this.handleUpdate();
				}
			});
	},
	methods: {
        handleRemove(file, fileList) {
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
		handleUpdate: function () {
			this.$refs.description_display.handleUpdate(this.CourseData.description);
			this.$refs.notice_display.handleUpdate(this.CourseData.notice);
		},
		onSubmit () {
			this.$http.post('/api/class/info/update', {
				resources: this.resources,
				info: this.CourseData,
				class_id: this.class_id
			}).
				then(function (res) {
					this.$message("课程信息已更新");
					location.reload();
				});
		},
		onEdit (content_id) {
			this.$refs.editor.handleOpen(content_id);
		},
	},
	components: {
		'ContentEditor': ContentEditor,
		'ContentDisplay': ContentDisplay
	}
};
</script>

<style scoped>
h2 {
	text-align: center;
}
</style>
