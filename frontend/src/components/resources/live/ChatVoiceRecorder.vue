<template>
	<!--语音录制按钮-->
    <div>
        <el-button type="success" plain
                   v-if="!recordingQ"
                   icon="el-icon-phone-outline"
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
                         console.log('[start recording]');
                     });
            },
            handleRecordStop() {    // 结束录制语音
                this.recorder.stop().
                     then(({ blob, buffer }) => {
                         this.recordingQ = false;
                         console.log('[stop recording]', blob, buffer);
                         this.$emit('voice', blob);    // 把录制到的语音消息传给父页面
                     });
            },
        }
	}
</script>

<style scoped>

</style>
