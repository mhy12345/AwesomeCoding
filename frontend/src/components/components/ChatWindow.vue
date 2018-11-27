<template>
	<!--chat dialog for private chat-->
    <div  v-if="config.visibleQ">
        <el-card class="window">
            <div slot="header" style="text-align: center;">
                <i class="el-icon-close operator" @click='handleClose'></i>
                <div style="font-weight: bold">{{config.her.realname}}</div>
            </div>
            <chat-records
                ref="chat_window_records"
                :course_id="config.course_id"
                :user="user">
            </chat-records>
            <chat-input :course_id="this.config.course_id"
                        hide_button="none"
                        style="width: 100%"></chat-input>
        </el-card>
    </div>
</template>

<script>
    import ChatRecords from '../resources/live/ChatRecords'
    import ChatInput from '../resources/live/ChatInput';
	export default {
		name: "ChatWindow",
        props: { config: Object, user: Object },
        data() {
		    return {
            }
        },
        sockets: {
            pullFlow: function (msg) {       // 收到服务器发来的消息，更新聊天记录显示
                if (msg.course_id != this.config.course_id) return;
                console.log('[chat-window pullFlow]', msg);
                this.$refs.chat_window_records.pushRecord(msg);
            },
        },
        methods: {
            handleClose() {
                this.config.visibleQ = false;
            }
        },
        components: {
            ChatRecords,
            ChatInput
        }
	}
</script>

<style scoped>
    .window {
        position: fixed;
        right: 50px;
        top: 120px;
        width: 450px;
        height: 650px;
        z-index: 1000;
    }
    .operator {
        position: absolute;
        top: 10px;
        left: 10px;
    }
</style>
