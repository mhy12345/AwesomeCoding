<template>
	<div>
        <!--最小化/最大化按钮-->
        <el-button circle :class="toggle_style" size="mini" @click="handleToggle"></el-button>
        <transition name="el-fade-in">
            <div v-if="visibleQ">
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
                <!--发送按钮-->
                <el-button type="text" size="mini" @click="handleSendText" class="send-prompt">
                    <i class="el-icon-back"></i>
                </el-button>
            </div>
        </transition>
	</div>
</template>

<script>
    import ChatPictureUploader from './ChatPictureUploader';
    import ChatVoiceRecorder from './ChatVoiceRecorder';

    export default {
        name: "Chat",
        data() {
            return {
                toggle_style: 'hide-prompt el-icon-arrow-right',    // 最大化/最小化按钮的样式
                visibleQ: true, // 是否显示
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
            handleToggle() {  // 最小化/最大化输入框
                if (this.visibleQ) {
                    this.visibleQ = false;
                    this.toggle_style = 'show-prompt move-to-right el-icon-arrow-left'
                }
                else {
                    this.visibleQ = true;
                    this.toggle_style = 'hide-prompt move-to-left el-icon-arrow-right'
                }
            },
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
    .hide-prompt {
        position: fixed;
        bottom: 65px;
        right: 490px;
    }

    .show-prompt {
        position: fixed;
        bottom: 65px;
        right: 30px;
    }

    .move-to-right {
        -webkit-animation: to-right;
        -o-animation: to-right;
        animation: to-right;
        animation-duration: 1s;
    }

    .move-to-left {
        -webkit-animation: to-left;
        -o-animation: to-left;
        animation: to-left;
        animation-duration: 1s;
    }

    @keyframes to-right
    {
        from {
            bottom: 65px;
            right: 490px;
        }
        to {
            bottom: 65px;
            right: 30px;
        }
    }

    @keyframes to-left {
        from {
            bottom: 65px;
            right: 30px;
        }
        to {
            bottom: 65px;
            right: 490px;
        }
    }

    .send-prompt {
        position: absolute;
        bottom: 10px;
        right: 130px;
    }
</style>
