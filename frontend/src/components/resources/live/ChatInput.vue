<template>
	<div>
		<el-row :gutter='10' type='flex'>
            <!--文本框-->
			<el-col :span='18'>
                <div @keydown.ctrl.enter="handleSendText" @keydown.meta.enter="handleSendText">
                    <el-input type="textarea"
                              v-model="input_message"
                              placeholder="输入文本（按ctrl/meta + enter发送）"
                              :autosize="{minRows: 3.2}"
                              resize="none">
                    </el-input>
                </div>
			</el-col>
            <!--图片和语音按钮-->
			<el-col :span='5'>
                <chat-picture-uploader :block="blockQ" :course_id="$route.params.class_id"></chat-picture-uploader>
                <chat-voice-recorder :blockQ="blockQ" :course_id="$route.params.class_id"></chat-voice-recorder>
			</el-col>
		</el-row>
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
            handleSendText() { // 发送文字消息
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
        },
        components: {
            ChatPictureUploader,
            ChatVoiceRecorder
        }
    };
</script>

<style scoped>

</style>
