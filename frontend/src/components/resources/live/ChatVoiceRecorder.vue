<template>
	<!--语音录制按钮-->
    <div>
        <el-button type="success" plain
                   v-if="!recordingQ"
                   icon="el-icon-phone-outline"
                   :disabled="blockQ"
                   @click="handleRecordStart">
            语音
        </el-button>
        <el-button type="danger" plain
                   v-if="recordingQ"
                   icon="el-icon-loading"
                   @click="handleRecordStop">
            结束
        </el-button>
    </div>
</template>

<script>
    import Recorder from 'recorder-js'; // 录音插件
	export default {
		name: "ChatRecorder",
        props: { blockQ: Boolean, course_id: String },
        data() {
		    return {
                recorder: undefined, // 录制器实例
                recordingQ: false,   // 是否正在录音
            }
        },
        mounted() {
            // 初始化录音器
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.recorder = new Recorder(audioContext);
            navigator.mediaDevices.getUserMedia({ audio: true }).
                      then(stream => this.recorder.init(stream)).
                      catch(err => console.log('Uh oh... unable to get stream...', err));
            console.log('[new recorder]', this.recorder);
        },
        methods: {
            handleRecordStart() {   // 开始录制语音
                this.recorder.start().
                     then(() => {
                         this.recordingQ = true;
                     });
            },
            handleRecordStop() {    // 结束录制语音
                this.recorder.stop().
                     then(({ blob, buffer }) => {
                         this.recordingQ = false;
                         this.sendVoice(blob);
                     });
            },
            sendVoice(blob) {   // 上传语音
                if (this.blockQ) return;
                let fd = new FormData();        // 以 FormData 格式发送语音
                fd.append('course_id', this.course_id);
                fd.append('blob', blob);
                let config = {
                    'headers': {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                this.$http.
                     post('/api/live/voice', fd, config).
                     // 此处需要配置请求头
                     then(res => {
                         this.$message.success('语音上传成功');
                         console.log('[voice uploaded!]', res);
                         let msg = {
                             course_id: this.course_id,
                             type: 'voice',
                             message: '[语音消息]',
                             path: res.body.path     // 上传成功后，服务器返回的语音文件路径
                         };
                         this.$socket.emit('message', msg);
                         // 通过 socket 广播这条语音消息，相当于告诉别的用户，我录制的语音在云端的哪个地方，你自个儿去找呗
                     }).
                     catch(err => {
                         this.$message.error('语音上传失败');
                         console.log('[voice failed to upload]', err);
                     });
            },
        }
	}
</script>

<style scoped>

</style>
