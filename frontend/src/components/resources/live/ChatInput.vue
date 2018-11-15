<template>
	<div>
		<div>
			聊天输入
		</div>
		<el-row :gutter='20' type='flex'>
			<el-col :span='19'>
				<el-input type="textarea"
						  v-model="input_message"
						  placeholder="输入文本..."
						  :autosize="{minRows: 3.2}"
						  resize="none">
				</el-input>
			</el-col>
			<el-col :span='5'>
				<div>
					<el-button 
						  type="warning" 
						  icon="el-icon-message"
						  @click="handleSendMessage" :disabled="blockQ">
						发送
					</el-button>
				</div>
				<div>
					<el-button type="success" icon="el-icon-phone"
											  @click="handleSendVoice" :disabled="blockQ">
						语音
					</el-button>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
    export default {
        name: "Chat",
        data() {
            return {
                input_message: '',
                blockQ: false,      // 是否被禁言
            }
        },
        sockets: {
            block() {   // 服务端发来禁言的消息 todo 这个逻辑将来要在后端通过bannedlist来实现
                this.blockQ = true;
                this.$message.warning('老师已开启禁言。');
            },
            allow() {
                this.blockQ = false;
                this.$message.success('老师已允许发言。');
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
