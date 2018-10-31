<template>
    <div>
        <div>
            聊天输入
        </div>
        <el-row>
            <el-col style="width: 90%">
                <div @keydown.enter="handleSendMessage">
                    <el-input type="textarea"
                              v-model="input_message"
                              placeholder="输入文本..."
                              :autosize="{minRows: 3.2}"
                              resize="none">
                    </el-input>
                </div>
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
        methods: {
            handleSendMessage() {   // 发送消息
                if (this.input_message.length <= 0) {
                    this.$message.warning('输入不能为空。');
                    return;
                }
                let msg = {
                    course_id: this.$route.params.class_id,
                    message: this.input_message
                };
                // 以后聊天统一通过socket来完成
                console.log('[socket] send message:', msg);
                this.$socket.emit('message', msg);
                this.input_message = '';
            },
            handleSendVoice() {     // todo 发送语音

            }
        }
    }
</script>

<style scoped>

</style>
