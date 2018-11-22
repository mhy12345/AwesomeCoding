<!--统一在这个页面里进行vue的测试-->
<template>
    <div id="test-view">
        <el-button @click="handleCreate">创建录音器</el-button>
        <el-button type="primary" @click="handleStartRecording">开始录音</el-button>
        <el-button type="error" @click="handleStopRecording">结束录音</el-button>
        <el-button type="success" @click="handleDownload">下载录音</el-button>
        <el-button @click="handleDestroy">删除录音器</el-button>

        <el-button @click="handleAlert">学生看过来！</el-button>
    </div>
</template>

<script>
    /* eslint-disable camelcase */

    import EditDialog from './EditDialog';
    import Recorder from 'recorder-js'; // 录音插件
    // import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
    // import Vue from 'vue'
    //
    // Vue.component(CollapseTransition.name, CollapseTransition);
    export default {
        name: 'Test',
        data() {
            var date = new Date();
            var date2 = new Date();
            date2.setTime(date.getTime() + 60 * 1000);
            return {
                host: {
                    host1: window.location.host,
                    host2: document.domain
                },
                my_url: window.location.href,
                my_protocol: window.location.protocol,
                my_path: location.pathname,

                input: '',
                dialog: {
                    title: '一个平凡的标题',
                    content: '一个平凡的段落。',
                    visible: false,
                    input: '',
                    response: false
                },
                showColumn: true,
                cookies: [],
                exp_secs: 120,
                new_cookie: {
                    name: '',
                    value: '',
                },
                cur_date: date.toUTCString(),
                cur_date2: date2.toUTCString(),
                recorder: undefined,
                blob: undefined
            };
        },
        sockets: {  // todo 学生端处理通知
            alert: function (msg) {
                this.$notify.warning({
                    title: '收到通知',
                    message: msg.content
                });
                if (msg.operation === 'SHOW_DIALOG.') {
                    this.dialog.visible = true;
                    this.dialog.title = msg.operation;
                    this.dialog.content = msg.content;
                }
            }
        },
        methods: {
            handleCreate() {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.recorder = new Recorder(audioContext, {
                    // An array of 255 Numbers
                    // You can use this to visualize the audio stream
                    // If you use react, check out react-wave-stream
                    // onAnalysed: data => console.log('[data]', data),
                });
                navigator.mediaDevices.getUserMedia({ audio: true }).
                          then(stream => this.recorder.init(stream)).
                          catch(err => console.log('Uh oh... unable to get stream...', err));
                console.log('[new recorder]', this.recorder);
                this.$message.success('录制器已创建');
            },
            handleStartRecording() {
                this.recorder.start().
                     then(() => {
                         this.$message('开始录制');
                     });
            },
            handleStopRecording() {
                this.recorder.stop().
                     then(({ blob, buffer }) => {
                         this.$message('结束录制');
                         console.log('[stop recording]', blob, buffer);
                         // buffer is an AudioBuffer
                         this.blob = blob;
                     });
            },
            handleDownload() {
                Recorder.download(this.blob, 'my-audio-file');
            },
            handleDestroy() {
                delete this.recorder;
                this.$message.success('录制器已删除');
            },
            createDialog: function () {
                this.dialog.visible = true;
                this.dialog.input = this.input;
            },
            handleClose: function () {
                if (this.dialog.response === true) {
                    this.input = this.dialog.input;
                }
            },
            getCookies: function () {
                var str_cookie = document.cookie;
                var list, cookie;
                list = str_cookie.split(';');
                this.cookies = [];
                for (cookie of list) {
                    this.cookies.push(cookie.trim());
                }
            },
            createCookie: function () {
                var str_cookie;
                var d = new Date();
                d.setTime(d.getTime() + this.exp_secs * 1000);
                str_cookie = this.new_cookie.name + '=' + this.new_cookie.value + ';' + "expires=" + d.toUTCString(); // 这相当于一个字典，‘=’兼有判重和追加的作用
                document.cookie = str_cookie;
                this.getCookies();
            },
            handleAlert: function () {  // todo 教师端发送通知
                var d = new Date();
                var msg = {
                    course_id: 7,
                    operation: 'SHOW_DIALOG.',
                    content: '教师这边的时间：' + d.toTimeString()
                };
                this.$socket.emit('alert', msg);
                this.$message.info('正在广播给学生  ' + msg.content);
            }
        },
        components: {
            EditDialog,
            // CollapseTransition
        }
    };
</script>

<style scoped>
    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
</style>
