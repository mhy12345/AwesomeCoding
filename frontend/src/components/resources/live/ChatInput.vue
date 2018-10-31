<template>
    <div>
        <div>
            聊天输入
        </div>
        <el-row>
            <el-col style="width: 90%">
                <el-input type="textarea"
                          v-model="input_message"
                          placeholder="输入文本..."
                          :autosize="{minRows: 3.2}"
                          resize="none"
                          @keydown.enter="handleSendMessage">
                </el-input>
            </el-col>
            <el-col style="position:relative; left: 2%; width: 8%">
                <div>
                    <el-button type="warning" icon="el-icon-message" @click="handleSendMessage">发送</el-button>
                </div>
                <div>
                    <el-button type="success" icon="el-icon-phone" @click="handleSendVoice">语音</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import root_url from '../../../../config/http_root_url';

    export default {
        name: "Chat",
        data() {
            return {
                input_message: ''
            }
        },
        sockets: {      // usages of socket.io
            message: function (msg) {       // 收到服务器发来的消息
                this.$notify({
                    title: '收到消息',
                    message: msg.from + ' says: ' + msg.content,
                    duration: 0
                });
                this.$socket.emit('received');
            },
            received: function () {         // 服务器收到客户发出的消息
                this.$notify({
                    title: '发出成功',
                    duration: 0
                });
            }
        },
        methods: {
            handleSendMessage() {   // 发送消息
                if (this.input_message.length <= 0) {
                    this.$message.warning('输入不能为空。');
                    return;
                }
                console.log('[post] send message:', this.input_message);
                this.$http.
                     post(root_url + '/api/live/send_message', { message: this.input_message }).
                     then((res) => {
                         console.log(res);
                     });
                console.log('[socket] send message:', this.input_message);
                this.$socket.emit('message', {
                    from: 'client',
                    content: this.input_message
                });
            },
            handleSendVoice() {     // todo 发送语音

            }
        }
    }
</script>

<style scoped>

</style>
