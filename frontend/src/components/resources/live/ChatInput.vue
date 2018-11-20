<template>
	<div>
		<el-row :gutter='10' type='flex'>
			<el-col :span='18'>
                <div @keydown.ctrl.enter="handleSendMessage" @keydown.meta.enter="handleSendMessage">
                    <el-input type="textarea"
                              v-model="input_message"
                              placeholder="输入文本（按ctrl/meta + enter发送）"
                              :autosize="{minRows: 3.2}"
                              resize="none">
                    </el-input>
                </div>
			</el-col>
			<el-col :span='5'>
                <el-button type="primary" plain
                           icon="el-icon-picture-outline"
                           @click="handleSendImage"
                           :disabled="blockQ">
                    图片
                </el-button>
                <chat-voice-recorder @voice="handleSendVoice"></chat-voice-recorder>
			</el-col>
		</el-row>

        <!--the real file uploader-->
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
        <el-upload
            ref="voice_upload"
            :show-file-list="true"
            :data='{ course_id: $route.params.class_id }'
            :on-change="handleUploadChange"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :auto-upload="false"
            :file-list="[{name: '123', url:''}]"
            action="/api/live/voice">
            上传语音
        </el-upload>
	</div>
</template>

<script>
    import ChatPictureUploader from './ChatPictureUploader';
    import ChatVoiceRecorder from './ChatVoiceRecorder';

    export default {
        name: "Chat",
        data() {
            return {
                input_message: '',
                blockQ: false, // 是否被禁言
                voice_blob: undefined,  // 录到的语音
            };
        },
        sockets: {
            block() { // 服务端发来禁言的消息
                this.blockQ = true;
                this.$message.warning('老师已开启禁言。');
            },
            allow() {
                this.blockQ = false;
                this.$message.success('老师已允许发言。');
            }
        },
        methods: {
            handleUploadChange() {
                console.log('[selected]', this.$refs.voice_upload);
            },
            handleSendMessage() { // 发送消息
                if (this.blockQ) return;
                if (this.input_message.length <= 0) {
                    this.$message.warning('输入不能为空。');
                    return;
                }
                let msg = {
                    course_id: this.$route.params.class_id,
                    type: 'text',
                    message: this.input_message
                };
                // 以后聊天统一通过socket来完成
                this.$socket.emit('message', msg);
                this.input_message = '';
            },
            handleSendImage() { // 发送图片
                if (this.blockQ) return;
                this.$refs.uploader.click();
            },
            handleSendVoice(blob) { // todo 发送语音
                if (this.blockQ) return;
                this.$message.success('成功录制');
                this.voice_blob = blob;
            },
            onUploadSuccess(res) {
                this.$message.success('上传成功');
                this.$refs.uploader.clearFiles();
                console.log('[upload success]', res);
                let msg;
                if (res.type === 'picture') {
                    msg = {
                        course_id: this.$route.params.class_id,
                        type: 'picture',
                        message: '[图片消息]',
                        path: res.path
                    };
                }
                else if (res.type === 'voice') {
                    //todo
                }
                else {
                    this.$message.error('未知文件类型');
                    console.log('[unknown type]', res);
                    return;
                }
                console.log('[to message]', msg);
                this.$socket.emit('message', msg);
            },
            onUploadError(res) {
                this.$message.error('上传失败');
                console.log('[upload error]', res);
            }
        },
        components: {
            ChatPictureUploader,
            ChatVoiceRecorder
        }
    };
</script>

<style scoped>

</style>
