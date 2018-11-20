<template>
	<!--上传图片的按钮-->
    <div>
        <el-button type="primary" plain
                   icon="el-icon-picture-outline"
                   @click="handleSendImage"
                   :disabled="blockQ">
            图片
        </el-button>
        <el-upload
            style="display: none"
            ref="upload"
            :show-file-list="false"
            :data='{ course_id: $route.params.class_id }'
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            action="/api/live/picture">
            <button ref="uploader">上传图片</button>
        </el-upload>
    </div>
</template>

<script>
	export default {
        name: "ChatPictureUploader",
        props: { blockQ: Boolean, course_id: String },
        methods: {
            handleSendImage() { // 发送图片
                if (this.blockQ) return;
                this.$refs.uploader.click();
            },
            onUploadSuccess(res) {
                this.$message.success('上传成功');
                console.log('[upload success]', res);
                let msg = {
                    course_id: this.course_id,
                    type: 'picture',
                    message: '[图片消息]',
                    path: res.path     // 上传成功后，服务器返回的语音文件路径
                };
                this.$socket.emit('message', msg);
                // 通过 socket 广播这条语音消息，相当于告诉别的用户，我发送的图片在云端的哪个地方，你自个儿去找呗
            },
            onUploadError(res) {
                this.$message.error('上传失败');
                console.log('[upload error]', res);
            }
        }
    }
</script>

<style scoped>

</style>
